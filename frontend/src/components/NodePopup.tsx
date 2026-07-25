import type { NodeData } from "../types/graph";


interface NodePopupProps {

    node: NodeData;

    identifier: string;

}


function NodePopup({
    node,
    identifier
}:NodePopupProps){


    return (

        <div className="node-popup">


            <h3>

                {identifier} = {node.id}

            </h3>



            <div className="table-container">


                <table>


                    <tbody>

                    {
                        Object.entries(node.data)
                        .map(
                            ([key,value]) => (

                                <tr key={key}>

                                    <td>
                                        {key}
                                    </td>

                                    <td>
                                        {String(value)}
                                    </td>

                                </tr>

                            )
                        )
                    }

                    </tbody>


                </table>


            </div>


        </div>

    );


}


export default NodePopup;