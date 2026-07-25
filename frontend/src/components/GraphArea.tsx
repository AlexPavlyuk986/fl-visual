import CytoscapeComponent from "react-cytoscapejs";

import type { EventObject } from "cytoscape";

import AttributeSelector from "./AttributeSelector";
import LayoutSelector from "./LayoutSelector";
import NodePopup from "./NodePopup";

import type { NodeData } from "../types/graph";


interface GraphAreaProps {

    step: number;

    uploaded: boolean;


    columns: string[];


    selectedAttribute: string;

    setSelectedAttribute:
        (value: string) => void;



    selectedLayout: string;

    setSelectedLayout:
        (value: string) => void;



    onNext: () => void;

    onApply: () => void;



    nodes: NodeData[];



    selectedNode: NodeData | null;

    setSelectedNode:
        (node: NodeData | null) => void;

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

    setSelectedNode


}: GraphAreaProps) {



    /*
        Phase 0:
        Waiting for CSV upload
    */

    if (!uploaded) {


        return (

            <main className="graph-area">

                <h2>
                    Please, upload CSV file.
                </h2>

            </main>

        );

    }



    /*
        Phase 1:
        Choose node identifier
    */

    if (step === 1) {


        return (

            <main className="graph-area">


                <AttributeSelector

                    columns={columns}

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


            </main>

        );

    }




    /*
        Phase 2:
        Choose graph layout
    */

    if (step === 2) {


        return (

            <main className="graph-area">


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


            </main>

        );

    }




    /*
        Phase 3:
        Display graph
        Phase 4:
        Node interaction
    */


    if (
        step === 3 &&
        nodes.length > 0
    ) {



        const elements = nodes.map(
            (node) => ({

                data: {

                    id: node.id

                },


                position: {

                    x:
                    node.position[0] * 500,


                    y:
                    node.position[1] * 500

                }

            })
        );



        const nodeMap =
            new Map(
                nodes.map(
                    node => [
                        node.id,
                        node
                    ]
                )
            );



        const stylesheet = [


            {
                selector: "node",

                style: {

                    label:
                        "data(id)",


                    width: 35,

                    height: 35,


                    "background-color":
                        "#888888",


                    color:
                        "#ffffff",


                    "text-valign":
                        "center",


                    "text-halign":
                        "center",

                    "font-size":
                        10

                }

            },


            {

                selector:
                    "node.selected",


                style: {


                    "background-color":
                        "#2563eb",


                    width: 50,

                    height: 50

                }

            }


        ];




        return (

            <main className="graph-area">


                <CytoscapeComponent


                    elements={
                        elements
                    }



                    stylesheet={
                        stylesheet
                    }



                    layout={{
                        name: "preset"
                    }}



                    style={{

                        width:
                            "100%",


                        height:
                            "100%"

                    }}



                    cy={(cy) => {


                        cy.on(

                            "tap",

                            "node",

                            (event: EventObject) => {


                                /*
                                    Remove previous highlight
                                */

                                cy.nodes()
                                    .removeClass(
                                        "selected"
                                    );



                                /*
                                    Highlight clicked node
                                */

                                event.target
                                    .addClass(
                                        "selected"
                                    );



                                /*
                                    Get node ID
                                */

                                const nodeId =
                                    event.target.id();



                                /*
                                    Get full node data
                                */

                                const node =
                                    nodeMap.get(
                                        nodeId
                                    );



                                if (node) {

                                    setSelectedNode(
                                        node
                                    );

                                }


                            }

                        );


                    }}


                />



                {
                    selectedNode && (

                        <NodePopup

                            node={selectedNode}

                            identifier={selectedAttribute}

                        />

                    )
                }



            </main>

        );

    }




    /*
        Fallback
    */

    return (

        <main className="graph-area">

            <h2>
                Data Uploaded
            </h2>

        </main>

    );


}


export default GraphArea;