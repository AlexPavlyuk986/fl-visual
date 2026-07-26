import { useMemo } from "react";

import CytoscapeComponent from "react-cytoscapejs";
import type { EventObject } from "cytoscape";

import AttributeSelector from "./AttributeSelector";
import LayoutSelector from "./LayoutSelector";
import NodePopup from "./NodePopup";

import type { NodeData } from "../types/graph";

import "./GraphArea.css";



interface GraphAreaProps {


    step: number;


    uploaded: boolean;


    columns: string[];



    selectedAttribute: string;

    setSelectedAttribute:
        React.Dispatch<
            React.SetStateAction<string>
        >;



    selectedLayout: string;

    setSelectedLayout:
        React.Dispatch<
            React.SetStateAction<string>
        >;



    onNext: () => void;


    onApply: () => void;



    nodes: NodeData[];



    selectedNode: NodeData | null;


    setSelectedNode:
        React.Dispatch<
            React.SetStateAction<NodeData | null>
        >;



    updateNodePosition:

        (

            id: string,

            position: {

                x: number;

                y: number;

            }

        ) => void;

}






function GraphArea({

    step,

    uploaded,

    columns,

    selectedAttribute,

    setSelectedAttribute,

    selectedLayout,

    setSelectedLayout,

    onNext,

    onApply,

    nodes,

    selectedNode,

    setSelectedNode,

    updateNodePosition


}: GraphAreaProps) {



    /*
        Convert NetworkX nodes
        into Cytoscape elements
    */

    const elements = useMemo(() => {


        return nodes.map(node => ({


            data: {


                id: node.id,


                label: node.id


            },



            position: {


                x:
                    node.position?.x ?? 250,



                y:
                    node.position?.y ?? 250,


            }


        }));


    }, [nodes]);






    const stylesheet = [


        {


            selector: "node",


            style: {


                label:
                    "data(label)",


                width: 35,


                height: 35,


                backgroundColor:
                    "#888",


                color:
                    "#ffffff",


                textValign:
                    "center",


                textHalign:
                    "center",


                fontSize:
                    12


            }


        },



        {


            selector:
                "node:selected",


            style: {


                backgroundColor:
                    "#2563eb"


            }


        }


    ];








    const handleNodeClick = (

        event: EventObject

    ) => {


        const nodeId =
            event.target.id();



        const node =
            nodes.find(

                n =>
                    n.id === nodeId

            );



        if (node) {


            setSelectedNode(node);


        }


    };







    return (


        <div className="graph-area">





            {
                step === 0 && (


                    <div className="graph-message">

                        Please, upload CSV file.

                    </div>


                )
            }







            {
                step === 1 && (


                    <div className="selection-window">


                        <h3>

                            Choose node identifier

                        </h3>



                        <AttributeSelector


                            columns={
                                columns
                            }


                            selectedAttribute={
                                selectedAttribute
                            }


                            setSelectedAttribute={
                                setSelectedAttribute
                            }

                            onNext={
                                onNext
                            }


                        />



                        <button


                            className={

                                selectedAttribute

                                ?

                                "next-button active"

                                :

                                "next-button"

                            }



                            disabled={
                                !selectedAttribute
                            }



                            onClick={
                                onNext
                            }


                        >

                            Next

                        </button>


                    </div>


                )
            }







            {
                step === 2 && (


                    <div className="selection-window">


                        <h3>

                            Graph Layout

                        </h3>



                        <LayoutSelector


                            selectedLayout={
                                selectedLayout
                            }



                            setSelectedLayout={
                                setSelectedLayout
                            }

                            onApply={
                                onApply
                            }


                        />



                        <button


                            className={

                                selectedLayout

                                ?

                                "apply-button active"

                                :

                                "apply-button"

                            }



                            disabled={
                                !selectedLayout
                            }



                            onClick={
                                onApply
                            }


                        >

                            Apply

                        </button>



                    </div>


                )
            }









            {
                step === 3 && (


                    <>


                        <CytoscapeComponent



                            elements={
                                elements
                            }




                            stylesheet={
                                stylesheet
                            }





                            style={

                                {

                                    width:
                                        "100%",


                                    height:
                                        "100%"

                                }

                            }





                            layout={

                                {

                                    name:
                                        "preset"

                                }

                            }






                            cy={(cy) => {



                                /*
                                    Node click
                                */

                                cy.on(

                                    "tap",

                                    "node",

                                    handleNodeClick

                                );





                                /*
                                    Background click
                                */

                                cy.on(

                                    "tap",

                                    (event: EventObject) => {



                                        if (
                                            event.target === cy
                                        ) {


                                            setSelectedNode(null);


                                        }


                                    }

                                );







                                /*
                                    Save dragged position
                                */

                                cy.on(

                                    "dragfree",

                                    "node",

                                    (event: EventObject) => {


                                        const node =
                                            event.target;



                                        updateNodePosition(


                                            node.id(),


                                            {


                                                x:
                                                    node.position("x"),



                                                y:
                                                    node.position("y")


                                            }


                                        );


                                    }

                                );



                            }}


                        />








                        {
                            selectedNode && (


                                <NodePopup


                                    node={
                                        selectedNode
                                    }



                                    identifier={
                                        selectedAttribute
                                    }


                                />


                            )
                        }



                    </>


                )
            }





        </div>


    );

}



export default GraphArea;