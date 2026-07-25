import { useState } from "react";

import Header from "./components/Header";
import GraphArea from "./components/GraphArea";
import Footer from "./components/Footer";
import AttributeSelector from "./components/AttributeSelector";
import LayoutSelector from "./components/LayoutSelector";

import { api } from "./services/api";

import type { NodeData } from "./types/graph";


function App() {


    const [uploaded, setUploaded] = useState(false);


    const [columns, setColumns] = useState<string[]>([]);


    const [selectedAttribute, setSelectedAttribute] =
        useState("");


    const [selectedLayout, setSelectedLayout] =
        useState("");


    const [nodes, setNodes] =
        useState<NodeData[]>([]);

    const [selectedNode, setSelectedNode] =
        useState<NodeData | null>(null);


    /*
        Application steps:

        0 - Waiting for CSV upload
        1 - Choose node identifier
        2 - Choose graph layout
        3 - Display graph
    */

    const [step, setStep] =
        useState(0);



    /*
        Upload CSV file
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



            if (
                response.data.success
            ) {


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



            if (
                response.data.success
            ) {


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



    return (

        <div className="app-container">


            <Header
                onUpload={uploadFile}
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


                onNext={() =>
                    setStep(2)
                }


                onApply={
                    createGraph
                }


                nodes={nodes}


                selectedNode={selectedNode}


                setSelectedNode={setSelectedNode}

            />


            <Footer />


        </div>

    );

}


export default App;