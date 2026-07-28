import { useMemo } from "react";

import CytoscapeComponent from "react-cytoscapejs";

import AttributeSelector from "./AttributeSelector";
import LayoutSelector from "./LayoutSelector";

import NodePopup from "./NodePopup";
import EdgePopup from "./EdgePopup";

import type { NodeData, EdgeData } from "../types/graph";

import type cytoscape from "cytoscape";

import "./GraphArea.css";

interface GraphAreaProps {
  step: number;

  uploaded: boolean;

  dataset: Record<string, string>[];

  showReview: boolean;

  setShowReview: React.Dispatch<React.SetStateAction<boolean>>;

  columns: string[];

  selectedAttribute: string;

  setSelectedAttribute: React.Dispatch<React.SetStateAction<string>>;

  selectedLayout: string;

  setSelectedLayout: React.Dispatch<React.SetStateAction<string>>;

  onNext: () => void;

  onApply: () => void;

  nodes: NodeData[];

  selectedNode: NodeData | null;

  setSelectedNode: React.Dispatch<React.SetStateAction<NodeData | null>>;

  edges: EdgeData[];

  selectedEdge: EdgeData | null;

  setSelectedEdge: React.Dispatch<React.SetStateAction<EdgeData | null>>;

  updateNodePosition: (
    id: string,

    position: {
      x: number;
      y: number;
    },
  ) => void;

  updateEdgeWeight: (
    source: string,

    target: string,

    weight: number,
  ) => void;
}

function GraphArea({
  step,

  uploaded,

  dataset,

  showReview,

  setShowReview,

  columns,

  selectedAttribute,

  setSelectedAttribute,

  selectedLayout,

  setSelectedLayout,

  onNext,

  onApply,

  nodes,

  selectedNode,

  setSelectedNode,

  updateNodePosition,

  edges,

  selectedEdge,

  setSelectedEdge,

  updateEdgeWeight,
}: GraphAreaProps) {
  const elements = useMemo(() => {
    const nodeElements = nodes.map((node) => ({
      data: {
        id: node.id,

        label: node.id,
      },

      position: node.position,
    }));

    const edgeElements = edges.map((edge) => ({
      data: {
        id: `${edge.source}-${edge.target}`,

        source: edge.source,

        target: edge.target,

        weight: edge.weight,
      },
    }));

    return [...nodeElements, ...edgeElements];
  }, [nodes, edges]);

  const stylesheet = [
    {
      selector: "node",

      style: {
        label: "data(label)",

        width: 40,

        height: 40,

        backgroundColor: "#888",

        color: "#fff",

        textValign: "center",

        textHalign: "center",

        fontSize: 12,
      },
    },

    {
      selector: "node:selected",

      style: {
        backgroundColor: "#2563eb",
      },
    },

    {
      selector: "edge",

      style: {
        width: 3,

        lineColor: "#999",

        textRotation: "autorotate",
      },
    },

    {
      selector: "edge:selected",

      style: {
        lineColor: "#2563eb",

        width: 5,
      },
    },
  ];

  const handleNodeClick = (event: cytoscape.EventObject) => {
    const nodeId = event.target.id();

    const node = nodes.find((n) => n.id === nodeId);

    if (node) {
      // Open node popup
      setSelectedNode(node);

      // Close edge popup
      setSelectedEdge(null);
    }
  };

  const handleEdgeClick = (event: cytoscape.EventObject) => {
    const edgeId = event.target.id();

    const edge = edges.find(
      (e) =>
        `${e.source}-${e.target}` === edgeId ||
        `${e.target}-${e.source}` === edgeId,
    );

    if (edge) {
      /*
                Store edge selection
                through selectedNode reset
                to close node popup
            */

      setSelectedEdge(edge);
      setSelectedNode(null);
    }
  };

  return (
    <div className="graph-area">
      {showReview ? (
        <div className="dataset-review">
          <button className="back-button" onClick={() => setShowReview(false)}>
            Back to Graph
          </button>

          <div className="dataset-table-container">
            <table className="dataset-table">
              <thead>
                <tr>
                  {dataset.length > 0 &&
                    Object.keys(dataset[0]).map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                </tr>
              </thead>

              <tbody>
                {dataset.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          {step === 0 && (
            <div className="graph-message">Please, upload CSV file.</div>
          )}

          {step === 1 && (
            <div className="selection-window">
              <h3>Choose node's key attribute</h3>

              <AttributeSelector
                columns={columns}
                selectedAttribute={selectedAttribute}
                setSelectedAttribute={setSelectedAttribute}
                onNext={onNext}
              />

              <button
                className={
                  selectedAttribute ? "next-button active" : "next-button"
                }
                disabled={!selectedAttribute}
                onClick={onNext}
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="selection-window">
              <h3>Graph Layout</h3>

              <LayoutSelector
                selectedLayout={selectedLayout}
                setSelectedLayout={setSelectedLayout}
                onApply={onApply}
              />

              <button
                className={
                  selectedLayout ? "apply-button active" : "apply-button"
                }
                disabled={!selectedLayout}
                onClick={onApply}
              >
                Apply
              </button>
            </div>
          )}

          {step === 3 && (
            <>
              <CytoscapeComponent
                elements={elements}
                stylesheet={stylesheet}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                layout={{
                  name: "preset",
                }}
                cy={(cy) => {
                  cy.on("tap", "node", handleNodeClick);

                  cy.on("tap", "edge", handleEdgeClick);

                  cy.on("tap", (event: cytoscape.EventObject) => {
                    if (event.target === cy) {
                      setSelectedNode(null);

                      setSelectedEdge(null);
                    }
                  });

                  cy.on("dragfree", "node", (event: cytoscape.EventObject) => {
                    const node = event.target;

                    const position = node.position();

                    updateNodePosition(node.id(), {
                      x: position.x,
                      y: position.y,
                    });
                  });
                }}
              />

              {selectedNode && (
                <NodePopup node={selectedNode} identifier={selectedAttribute} />
              )}

              {selectedEdge && (
                <EdgePopup
                  edge={selectedEdge}
                  onClose={() => setSelectedEdge(null)}
                  onUpdateWeight={updateEdgeWeight}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default GraphArea;
