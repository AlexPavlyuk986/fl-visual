import { useState } from "react";

import type { NodeData } from "../types/graph";

import "./AddNodeModal.css";



interface AddEdgeModalProps {


    nodes: NodeData[];


    onClose: () => void;


    onAdd: (

        source: string,

        target: string,

        weight: number

    ) => Promise<boolean>;


}





function AddEdgeModal({

    nodes,

    onClose,

    onAdd

}: AddEdgeModalProps) {



    const [source, setSource] =

        useState("");



    const [target, setTarget] =

        useState("");



    const [weight, setWeight] =

        useState("1");



    const [warning, setWarning] =

        useState("");




    const canAdd =

        source.trim() !== "" &&

        target.trim() !== "";






    const handleAdd = async () => {



        if (!canAdd) {

            return;

        }





        const sourceExists =

            nodes.some(

                node =>

                    node.id === source

            );



        if (!sourceExists) {


            setWarning(

                `Node "${source}" does not exist.`

            );


            return;


        }






        const targetExists =

            nodes.some(

                node =>

                    node.id === target

            );



        if (!targetExists) {


            setWarning(

                `Node "${target}" does not exist.`

            );


            return;


        }






        if (source === target) {


            setWarning(

                "Source and target must be different."

            );


            return;


        }







        const success =

            await onAdd(

                source,

                target,

                Number(weight)

            );






        if (!success) {


            setWarning(

                "Edge already exists."

            );


            return;


        }






        setWarning("");



    };







    return (



        <div className="modal-overlay">



            <div className="add-node-modal">




                <h3>

                    Add Edge

                </h3>






                <div className="attribute-row">


                    <label>

                        Source

                    </label>



                    <input


                        value={source}


                        onChange={

                            e =>

                            setSource(

                                e.target.value

                            )

                        }


                    />


                </div>







                <div className="attribute-row">


                    <label>

                        Target

                    </label>



                    <input


                        value={target}


                        onChange={

                            e =>

                            setTarget(

                                e.target.value

                            )

                        }


                    />


                </div>








                <div className="attribute-row">


                    <label>

                        Weight

                    </label>



                    <input


                        type="number"


                        value={weight}


                        onChange={

                            e =>

                            setWeight(

                                e.target.value

                            )

                        }


                    />


                </div>








                {

                    warning && (


                        <div className="node-warning">


                            {warning}


                        </div>


                    )

                }









                <div className="modal-buttons">





                    <button


                        className="modal-button active"


                        onClick={onClose}


                    >

                        Cancel


                    </button>







                    <button



                        className={

                            canAdd

                            ?

                            "modal-button active"

                            :

                            "modal-button"

                        }



                        disabled={!canAdd}



                        onClick={handleAdd}


                    >


                        Add Edge


                    </button>





                </div>







            </div>





        </div>


    );


}



export default AddEdgeModal;