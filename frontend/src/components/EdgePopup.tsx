import type { EdgeData } from "../types/graph";

import "./EdgePopup.css";


interface EdgePopupProps {


    edge: EdgeData;


}



function EdgePopup({
    edge
}: EdgePopupProps) {


    return (

        <div className="edge-popup">


            <h3>
                Edge
            </h3>



            <table>


                <tbody>


                    <tr>

                        <td>
                            Source
                        </td>

                        <td>
                            {edge.source}
                        </td>

                    </tr>



                    <tr>

                        <td>
                            Target
                        </td>

                        <td>
                            {edge.target}
                        </td>

                    </tr>



                    <tr>

                        <td>
                            Weight
                        </td>

                        <td>
                            {edge.weight}
                        </td>

                    </tr>


                </tbody>


            </table>


        </div>

    );

}



export default EdgePopup;