export interface NodeData {

    id: string;


    /*
        All CSV rows belonging to this node.

        Example:

        [
            {
                day: "23",
                temp: "12.3"
            },
            {
                day: "24",
                temp: "13.1"
            }
        ]

    */

    attributes: Record<string, string>[];



    position: {

        x: number;

        y: number;

    };

}





export interface EdgeData {


    /*
        Source node identifier
    */

    source: string;



    /*
        Target node identifier
    */

    target: string;



    /*
        Edge weight
    */

    weight: number;

}