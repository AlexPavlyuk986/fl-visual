export interface NodeData {

    /**
     * Unique node identifier.
     * 
     * Example:
     * "1"
     */
    id: string;



    /**
     * All attributes belonging to this datapoint.
     *
     * Example:
     *
     * {
     *    station: "1",
     *    day: "23",
     *    temp: "12.3"
     * }
     */
    attributes:
        Record<string,string>[];


    /**
     * Optional graph coordinates.
     * 
     * Used later for NetworkX layouts
     * (spring, random, circular).
     */
    position?: {

        x: number;

        y: number;

    };

}