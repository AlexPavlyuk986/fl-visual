import { useState } from "react";
import "./AddNodeModal.css";

interface Props {

    columns: string[];

    identifier: string;

    onClose: () => void;

    onAdd: (data: Record<string,string>) => boolean;

}



function AddNodeModal({
    columns,
    identifier,
    onClose,
    onAdd
}: Props) {


    const [values, setValues] =
        useState<Record<string,string>>({});

    const [warning, setWarning] =
    useState("");

    const handleChange = (
        column:string,
        value:string
    ) => {

        setValues({

            ...values,

            [column]:value

        });

    };

    const canAdd =
        Boolean(
            values[identifier]
        );
     const handleAdd = () => {


        if (!canAdd) {

            return;

        }

        const success =
            onAdd(values);

        if (!success) {


            setWarning(
                "A node with this identifier already exists."
            );


            return;


        }

        setWarning("");

    };


    return (

        <div className="modal-overlay">


            <div className="add-node-modal">


                <h3>
                    Add New Node
                </h3>



                {
                    columns.map(column => (

                        <div
                            key={column}
                            className="attribute-row"
                        >

                            <label>
                                {column}
                            </label>


                            <input

                                value={
                                    values[column] ?? ""
                                }

                                onChange={
                                    e =>
                                    handleChange(
                                        column,
                                        e.target.value
                                    )
                                }

                            />

                        </div>

                    ))
                }

                {
                    warning && (

                        <div className="node-warning">

                            {warning}

                        </div>

                    )
                }

                <div className="modal-buttons">


                    <button
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


                        disabled={
                            !canAdd
                        }


                        onClick={handleAdd}

                    >

                        Add

                    </button>


                </div>


            </div>


        </div>

    );

}


export default AddNodeModal;