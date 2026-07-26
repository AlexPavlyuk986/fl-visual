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

        </div>

    );

}


export default LayoutSelector;