import { useState } from "react";

import Header from "./components/Header";
import GraphArea from "./components/GraphArea";
import Footer from "./components/Footer";

import AddNodeModal from "./components/AddNodeModal";
import AddEdgeModal from "./components/AddEdgeModal";

import { api } from "./services/api";

import type { NodeData, EdgeData } from "./types/graph";



function App() {


    const [uploaded, setUploaded] =
        useState(false);


    const [columns, setColumns] =
        useState<string[]>([]);


    const [selectedAttribute, setSelectedAttribute] =
        useState("");


    const [selectedLayout, setSelectedLayout] =
        useState("");


    const [nodes, setNodes] =
        useState<NodeData[]>([]);


    const [edges, setEdges] =
        useState<EdgeData[]>([]);


    const [selectedNode, setSelectedNode] =
        useState<NodeData | null>(null);



    const [showAddNode, setShowAddNode] =
        useState(false);



    const [showAddEdge, setShowAddEdge] =
        useState(false);



    const [step, setStep] =
        useState(0);





    /*
        Upload CSV
    */

    const uploadFile = async(file:File)=>{


        const formData =
            new FormData();


        formData.append(
            "file",
            file
        );



        try{


            const response =
                await api.post(
                    "/upload",
                    formData
                );



            if(response.data.success){


                setUploaded(true);


                setColumns(
                    response.data.columns
                );


                setStep(1);

            }


        }

        catch(error){

            console.error(error);

        }

    };









    /*
        Create graph
    */

    const createGraph = async()=>{


        try{


            const response =
                await api.post(

                    "/create_graph",

                    null,

                    {

                        params:{

                            identifier:selectedAttribute,

                            layout:selectedLayout

                        }

                    }

                );



            if(response.data.success){


                setNodes(
                    response.data.nodes
                );


                setEdges(
                    response.data.edges
                );


                setStep(3);

            }


        }

        catch(error){

            console.error(error);

            alert(
                "Graph creation failed"
            );

        }

    };








    /*
        Save dragged positions
    */

    const updateNodePosition = (

        id:string,

        position:{
            x:number;
            y:number;
        }

    )=>{


        setNodes(previous=>

            previous.map(node=>

                node.id===id

                ?

                {

                    ...node,

                    position

                }

                :

                node

            )

        );


    };









    /*
        Add node
    */

    const addNode = (

        data:Record<string,string>

    ):boolean=>{


        const id =
            data[selectedAttribute];



        if(
            nodes.some(
                node=>node.id===id
            )
        ){

            return false;

        }



        const newNode:NodeData={


            id,


            attributes:[
                data
            ],


            position:{

                x:250,

                y:250

            }


        };



        setNodes(previous=>[

            ...previous,

            newNode

        ]);



        setShowAddNode(false);



        return true;

    };









    /*
        Add edge
    */

    const addEdge = async(

        source:string,

        target:string,

        weight:number

    ):Promise<boolean>=>{


        try{


            const response =
                await api.post(

                    "/add_edge",

                    {

                        source,

                        target,

                        weight

                    }

                );



            if(response.data.success){


                setEdges(
                    response.data.edges
                );


                setShowAddEdge(false);


                return true;

            }


            return false;


        }

        catch(error){


            console.error(error);


            return false;

        }


    };









    /*
        Delete node
    */

    const deleteNode = async()=>{


        if(!selectedNode)
            return;



        await api.delete(

            "/delete_node",

            {

                params:{

                    node_id:selectedNode.id

                }

            }

        );



        setNodes(previous=>

            previous.filter(

                node=>

                    node.id!==selectedNode.id

            )

        );


        setEdges(previous=>

            previous.filter(

                edge=>

                    edge.source!==selectedNode.id &&

                    edge.target!==selectedNode.id

            )

        );


        setSelectedNode(null);

    };









    return (

        <div className="app-container">


            <Header

                onUpload={uploadFile}

                uploaded={uploaded}

                onAddNode={()=>setShowAddNode(true)}

                onAddEdge={()=>setShowAddEdge(true)}

                onDeleteNode={deleteNode}

                deleteEnabled={
                    selectedNode!==null
                }

            />





            <GraphArea

                step={step}

                uploaded={uploaded}


                columns={columns}


                selectedAttribute={
                    selectedAttribute
                }


                setSelectedAttribute={
                    setSelectedAttribute
                }


                selectedLayout={
                    selectedLayout
                }


                setSelectedLayout={
                    setSelectedLayout
                }


                onNext={()=>setStep(2)}


                onApply={createGraph}


                nodes={nodes}


                edges={edges}


                selectedNode={selectedNode}


                setSelectedNode={setSelectedNode}


                updateNodePosition={
                    updateNodePosition
                }


            />





            <Footer />







            {
                showAddNode &&

                <AddNodeModal

                    columns={columns}

                    identifier={selectedAttribute}

                    onAdd={addNode}

                    onClose={()=>
                        setShowAddNode(false)
                    }

                />

            }






            {
                showAddEdge &&

                <AddEdgeModal

                    nodes={nodes}

                    onAdd={addEdge}

                    onClose={()=>
                        setShowAddEdge(false)
                    }

                />

            }



        </div>

    );

}


export default App;