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

        </div>

    );

}


export default AttributeSelector;