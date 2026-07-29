import { useState } from "react";

import Header from "./components/Header";
import GraphArea from "./components/GraphArea";
import Footer from "./components/Footer";

import AddNodeModal from "./components/AddNodeModal";
import AddEdgeModal from "./components/AddEdgeModal";
import EdgeSettingsModal from "./components/EdgeSettingsModal";
import ModelConfigurationModal from "./components/ModelConfigurationModal";

import EdgePopup from "./components/EdgePopup";

import { api } from "./services/api";

import type { NodeData, EdgeData } from "./types/graph";

function App() {
  const [uploaded, setUploaded] = useState(false);

  const [columns, setColumns] = useState<string[]>([]);

  const [selectedAttribute, setSelectedAttribute] = useState("");

  const [selectedLayout, setSelectedLayout] = useState("");

  const [nodes, setNodes] = useState<NodeData[]>([]);

  const [edges, setEdges] = useState<EdgeData[]>([]);

  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  const [showAddNode, setShowAddNode] = useState(false);

  const [showAddEdge, setShowAddEdge] = useState(false);

  const [step, setStep] = useState(0);

  const [selectedEdge, setSelectedEdge] = useState<EdgeData | null>(null);

  const [showEditNode, setShowEditNode] = useState(false);

  const [dataset, setDataset] = useState<Record<string, string>[]>([]);

  const [showReview, setShowReview] = useState(false);

  const [showEdgeSettings, setShowEdgeSettings] = useState(false);

  const [edgeWidthByWeight, setEdgeWidthByWeight] = useState(false);

  const [showEdgeLabels, setShowEdgeLabels] = useState(false);

  const [showModelConfiguration, setShowModelConfiguration] = useState(false);

  /*
            Upload CSV
        */

  const uploadFile = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await api.post("/upload", formData);

      if (response.data.success) {
        setUploaded(true);

        setColumns(response.data.columns);

        setDataset(response.data.data);

        setStep(1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*
            Create graph
        */

  const createGraph = async () => {
    try {
      const response = await api.post(
        "/create_graph",

        null,

        {
          params: {
            identifier: selectedAttribute,

            layout: selectedLayout,
          },
        },
      );

      if (response.data.success) {
        setNodes(response.data.nodes);

        setEdges(response.data.edges);

        setStep(3);
      }
    } catch (error) {
      console.error(error);

      alert("Graph creation failed");
    }
  };

  /*
            Save dragged positions
        */

  const updateNodePosition = async (
    id: string,

    position: {
      x: number;
      y: number;
    },
  ) => {
    // Update frontend immediately
    setNodes((previous) =>
      previous.map((node) =>
        node.id === id
          ? {
              ...node,
              position,
            }
          : node,
      ),
    );

    // Save permanently in backend
    try {
      await api.put("/update_node_position", {
        id,
        position,
      });
    } catch (error) {
      console.error("Failed to save node position", error);
    }
  };

  /*
            Add node
        */

  const addNode = async (data: {
    id: string;
    attributes: Record<string, string>[];
  }): Promise<boolean> => {
    if (nodes.some((node) => node.id === data.id)) {
      return false;
    }

    try {
      const response = await api.post("/add_node", {
        id: data.id,

        attributes: data.attributes,
      });

      if (!response.data.success) {
        return false;
      }

      setNodes(response.data.nodes);

      // IMPORTANT:
      // Do not overwrite edges here.
      // Adding a node does not modify edges.

      setShowAddNode(false);

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  };

  /*
            Add edge
        */

  const addEdge = async (
    source: string,

    target: string,

    weight: number,
  ): Promise<boolean> => {
    try {
      const response = await api.post(
        "/add_edge",

        {
          source,

          target,

          weight,
        },
      );

      if (response.data.success) {
        setEdges(response.data.edges);

        setShowAddEdge(false);

        return true;
      }

      return false;
    } catch (error) {
      console.error(error);

      return false;
    }
  };

  /*
            Delete node
        */

  const deleteNode = async () => {
    if (!selectedNode) return;

    await api.delete(
      "/delete_node",

      {
        params: {
          node_id: selectedNode.id,
        },
      },
    );

    setNodes((previous) =>
      previous.filter((node) => node.id !== selectedNode.id),
    );

    setEdges((previous) =>
      previous.filter(
        (edge) =>
          edge.source !== selectedNode.id && edge.target !== selectedNode.id,
      ),
    );

    setSelectedNode(null);
  };

  const deleteEdge = async () => {
    if (!selectedEdge) return;

    try {
      const response = await api.delete("/delete_edge", {
        data: {
          source: selectedEdge.source,
          target: selectedEdge.target,
        },
      });

      if (response.data.success) {
        setEdges(response.data.edges);

        setSelectedEdge(null);
      }
    } catch (error) {
      console.error(error);

      alert("Failed to delete edge");
    }
  };

  const updateEdgeWeight = async (
    source: string,

    target: string,

    weight: number,
  ) => {
    try {
      const response = await api.put(
        "/update_edge",

        {
          source,

          target,

          weight,
        },
      );

      if (response.data.success) {
        setEdges(response.data.edges);

        setSelectedEdge(null);
      }
    } catch (error) {
      console.error(error);

      alert("Failed to update edge weight");
    }
  };

  const editNode = async (data: {
    id: string;
    attributes: Record<string, string>[];
  }): Promise<boolean> => {
    if (!selectedNode) {
      return false;
    }

    try {
      const response = await api.put(
        "/edit_node",

        {
          original_id: selectedNode.id,

          id: data.id,

          attributes: data.attributes,
        },
      );

      if (!response.data.success) {
        alert(response.data.message);

        return false;
      }

      setNodes(response.data.nodes);

      setEdges(response.data.edges);

      const updatedNode = response.data.nodes.find(
        (node: NodeData) => node.id === data.id,
      );

      setSelectedNode(updatedNode ?? null);

      setShowEditNode(false);

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  };

  const openReview = async () => {
    try {
      const response = await api.get("/dataset");

      if (response.data.success) {
        setDataset(response.data.dataset);

        setShowReview(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const applyModel = async (model: {
    type: string;
    features: string[];
    labels: string[];
  }): Promise<boolean> => {
    if (!selectedNode) {
      return false;
    }

    try {
      const response = await api.put("/add_model", {
        node_id: selectedNode.id,

        config: model,
      });

      if (!response.data.success) {
        return false;
      }

      setNodes(response.data.nodes);

      const updatedNode = response.data.nodes.find(
        (node: NodeData) => node.id === selectedNode.id,
      );

      setSelectedNode(updatedNode ?? null);

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  };

  return (
    <div className="app-container">
      <Header
        onUpload={uploadFile}
        uploaded={uploaded}
        onReview={openReview}
        onAddNode={() => setShowAddNode(true)}
        onAddEdge={() => setShowAddEdge(true)}
        onEditNode={() => setShowEditNode(true)}
        onEdgeSettings={() => setShowEdgeSettings(true)}
        onDeleteEdge={deleteEdge}
        onDeleteNode={deleteNode}
        edgeDeleteEnabled={selectedEdge !== null}
        deleteEnabled={selectedNode !== null}
        editEnabled={selectedNode !== null}
        reviewActive={showReview}
        onAddModel={() => setShowModelConfiguration(true)}
        modelEnabled={selectedNode !== null}
      />

      <GraphArea
        step={step}
        uploaded={uploaded}
        dataset={dataset}
        showReview={showReview}
        setShowReview={setShowReview}
        columns={columns}
        selectedAttribute={selectedAttribute}
        setSelectedAttribute={setSelectedAttribute}
        selectedLayout={selectedLayout}
        setSelectedLayout={setSelectedLayout}
        onNext={() => setStep(2)}
        onApply={createGraph}
        nodes={nodes}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
        updateNodePosition={updateNodePosition}
        edges={edges}
        selectedEdge={selectedEdge}
        setSelectedEdge={setSelectedEdge}
        updateEdgeWeight={updateEdgeWeight}
        edgeWidthByWeight={edgeWidthByWeight}
        showEdgeLabels={showEdgeLabels}
      />

      <Footer />

      {showAddNode && (
        <AddNodeModal
          columns={columns}
          identifier={selectedAttribute}
          onSubmit={addNode}
          onClose={() => setShowAddNode(false)}
        />
      )}

      {showAddEdge && (
        <AddEdgeModal
          nodes={nodes}
          onAdd={addEdge}
          onClose={() => setShowAddEdge(false)}
        />
      )}

      {showEditNode && selectedNode && (
        <AddNodeModal
          columns={columns}
          identifier={selectedAttribute}
          initialRows={selectedNode.attributes}
          editMode={true}
          originalIdentifier={selectedNode.id}
          onSubmit={editNode}
          onClose={() => setShowEditNode(false)}
        />
      )}

      {showEdgeSettings && (
        <EdgeSettingsModal
          edgeWidthByWeight={edgeWidthByWeight}
          setEdgeWidthByWeight={setEdgeWidthByWeight}
          showEdgeLabels={showEdgeLabels}
          setShowEdgeLabels={setShowEdgeLabels}
          onClose={() => setShowEdgeSettings(false)}
        />
      )}
      {showModelConfiguration && selectedNode && (
        <ModelConfigurationModal
          node={selectedNode}
          onApply={applyModel}
          onClose={() => setShowModelConfiguration(false)}
        />
      )}
    </div>
  );
}

export default App;
