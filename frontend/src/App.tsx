import { useState } from "react";

import Header from "./components/Header";
import GraphArea from "./components/GraphArea";
import Footer from "./components/Footer";
import AddNodeModal from "./components/AddNodeModal";

import { api } from "./services/api";

import type { NodeData } from "./types/graph";


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



    const [selectedNode, setSelectedNode] =
        useState<NodeData | null>(null);



    const [showAddNode, setShowAddNode] =
        useState(false);



    /*
        0 - Waiting for CSV upload
        1 - Select identifier
        2 - Select layout
        3 - Display graph
    */

    const [step, setStep] =
        useState(0);







    /*
        Upload CSV
    */

    const uploadFile = async (
        file: File
    ) => {


        if (!file.name.endsWith(".csv")) {


            alert(
                "Please upload CSV file."
            );


            return;

        }



        const formData =
            new FormData();



        formData.append(
            "file",
            file
        );



        try {


            const response =
                await api.post(
                    "/upload",
                    formData
                );



            if (response.data.success) {


                setUploaded(true);



                setColumns(
                    response.data.columns
                );



                setStep(1);


            }

            else {


                alert(
                    response.data.message
                );

            }


        }

        catch(error) {


            console.error(error);


            alert(
                "Upload failed"
            );


        }

    };








    /*
        Create NetworkX graph
    */

    const createGraph = async () => {


        try {


            const response =
                await api.post(

                    "/create_graph",

                    null,

                    {

                        params: {

                            identifier:
                                selectedAttribute,


                            layout:
                                selectedLayout

                        }

                    }

                );



            if (response.data.success) {


                setNodes(

                    response.data.nodes

                );



                setStep(3);


            }

            else {


                alert(
                    response.data.message
                );


            }


        }

        catch(error) {


            console.error(error);


            alert(
                "Graph creation failed"
            );


        }

    };


    /*
        Save manually dragged node position
    */

    const updateNodePosition = (

        id: string,

        position: {

            x: number;

            y: number;

        }

    ) => {


        setNodes(

            previous =>

                previous.map(node =>


                    node.id === id

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
        Delete the selected node
    */

    const deleteNode = async () => {


        if (!selectedNode) {

            return;

        }



        try {


            await api.delete(
                "/delete_node",
                {

                    params: {

                        node_id:
                            selectedNode.id

                    }

                }

            );



            setNodes(
                previous =>
                    previous.filter(
                        node =>
                            node.id !== selectedNode.id
                    )
            );



            setSelectedNode(null);


        }

        catch(error) {

            console.error(error);

            alert(
                "Node deletion failed"
            );

        }

    };


    /*
        Add new node from AddNodeModal

        Modal returns:

        {
            attribute1: value1,
            attribute2: value2
        }

        Convert it to NodeData.
    */

    const addNode = (

        data: Record<string, string>

    ): boolean => {

        const nodeId =
            data[selectedAttribute];

        const exists =
            nodes.some(
                node =>
                    node.id === nodeId
            );

        if (exists) {
            return false;
        }

        const newNode: NodeData = {


            id:

                data[selectedAttribute],



            attributes:

                [data],



            position: {


                x: 250,


                y: 250


            }


        };




        setNodes(

            previous => [

                ...previous,

                newNode

            ]

        );

        // close modal only after successful creation
        setShowAddNode(false);

        return true;


    };









    return (


        <div className="app-container">





            <Header


                onUpload={
                    uploadFile
                }



                uploaded={
                    uploaded
                }



                onAddNode={() =>
                    setShowAddNode(true)
                }

                onDeleteNode={deleteNode}


                deleteEnabled={
                    selectedNode !== null
                }

            />








            <GraphArea



                step={
                    step
                }



                uploaded={
                    uploaded
                }




                columns={
                    columns
                }





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





                onNext={() =>
                    setStep(2)
                }





                onApply={
                    createGraph
                }





                nodes={
                    nodes
                }





                selectedNode={
                    selectedNode
                }





                setSelectedNode={
                    setSelectedNode
                }





                updateNodePosition={
                    updateNodePosition
                }



            />









            <Footer />








            {
                showAddNode && (


                    <AddNodeModal


                        columns={
                            columns
                        }


                         identifier={
                            selectedAttribute
                        }


                        onAdd={
                            addNode
                        }


                        onClose={() =>
                            setShowAddNode(false)
                        }



                    />


                )

            }





        </div>


    );

}


export default App;