interface LayoutSelectorProps {

    selectedLayout: string;

    setSelectedLayout:
        (value: string) => void;

    onApply: () => void;

}



function LayoutSelector({

    selectedLayout,

    setSelectedLayout,

    onApply

}: LayoutSelectorProps) {


    const layouts = [

        "Random Layout",

        "Spring Layout",

        "Circular Layout"

    ];


    return (

        <div className="selection-panel">


            <h3>
                Graph Layout
            </h3>



            {
                layouts.map(layout => (

                    <label key={layout}>


                        <input

                            type="radio"

                            checked={
                                selectedLayout === layout
                            }

                            onChange={() =>
                                setSelectedLayout(layout)
                            }

                        />


                        {layout}


                    </label>

                ))
            }



            <br />



            <button

                disabled={!selectedLayout}

                className={
                    selectedLayout
                    ?
                    "active-button"
                    :
                    "inactive-button"
                }


                onClick={onApply}

            >

                Apply

            </button>



        </div>

    );

}


export default LayoutSelector;