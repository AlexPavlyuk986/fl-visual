interface AttributeSelectorProps {

    columns: string[];

    selectedAttribute: string;

    setSelectedAttribute:
        (value: string) => void;

    onNext: () => void;

}


function AttributeSelector({
    columns,
    selectedAttribute,
    setSelectedAttribute,
    onNext
}: AttributeSelectorProps) {


    return (

        <div className="selection-panel">


            <h3>
                Choose datapoint identifier
            </h3>


            {
                columns.map((column) => (

                    <label key={column}>

                        <input

                            type="radio"

                            checked={
                                selectedAttribute === column
                            }

                            onChange={() =>
                                setSelectedAttribute(column)
                            }

                        />

                        {column}

                    </label>

                ))
            }


            <br />


            <button

                disabled={!selectedAttribute}

                className={
                    selectedAttribute
                    ?
                    "active-button"
                    :
                    "inactive-button"
                }

                onClick={onNext}

            >

                Next

            </button>


        </div>

    );

}


export default AttributeSelector;