declare module "react-cytoscapejs" {
    import React from "react";

    interface CytoscapeComponentProps {
        elements?: any;
        stylesheet?: any;
        style?: React.CSSProperties;
        layout?: any;
        cy?: (cy: any) => void;
    }

    const CytoscapeComponent:
        React.ComponentType<CytoscapeComponentProps>;

    export default CytoscapeComponent;
}