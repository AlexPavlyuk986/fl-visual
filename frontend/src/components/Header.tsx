import "./Header.css";
import { useRef } from "react";

interface HeaderProps {
  onUpload: (file: File) => void;

  uploaded: boolean;

  onReview: () => void;

  onAddNode: () => void;

  onAddEdge: () => void;

  onDeleteNode: () => void;

  onEditNode: () => void;

  onDeleteEdge: () => void;

  onEdgeSettings: () => void;

  onAddModel: () => void;

  modelEnabled: boolean;

  edgeDeleteEnabled: boolean;

  editEnabled: boolean;

  deleteEnabled: boolean;

  reviewActive: boolean;
}

function Header({
  onUpload,

  uploaded,

  onReview,

  onAddNode,

  onAddEdge,

  onDeleteNode,

  onDeleteEdge,

  onEdgeSettings,

  edgeDeleteEnabled,

  deleteEnabled,

  onEditNode,

  editEnabled,

  reviewActive,

  onAddModel,

  modelEnabled,
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      onUpload(file);
    }

    event.target.value = "";
  };

  return (
    <header className="header">
      {/* Data Section */}

      <div className="header-section">
        <div className="header-content">
          <div className="data-buttons">
            <button
              type="button"
              className="header-button upload-button"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileChange}
            />

            <button
              type="button"
              className={
                uploaded
                  ? "header-button review-button"
                  : "header-button review-button disabled"
              }
              disabled={!uploaded}
              onClick={onReview}
            >
              Review
            </button>

            <button
              type="button"
              className="header-button download-button"
              disabled
            >
              Download
            </button>
          </div>
        </div>

        <div className="section-title">Data</div>
      </div>

      <div className="header-divider"></div>

      {/* Nodes Section */}

      <div className="header-section">
        <div className="header-content">
          <div className="data-buttons">
            <button
              type="button"
              className="header-button add-node-button"
              disabled={!uploaded || reviewActive}
              onClick={onAddNode}
            >
              Add Node
            </button>

            <button
              type="button"
              className={
                editEnabled && !reviewActive
                  ? "header-button edit-node-button active"
                  : "header-button edit-node-button"
              }
              disabled={!editEnabled || reviewActive}
              onClick={onEditNode}
            >
              Edit Node
            </button>

            <button
              type="button"
              className={
                deleteEnabled && !reviewActive
                  ? "header-button delete-node-button active"
                  : "header-button delete-node-button"
              }
              disabled={!deleteEnabled || reviewActive}
              onClick={onDeleteNode}
            >
              Delete Node
            </button>
          </div>
        </div>

        <div className="section-title">Nodes</div>
      </div>

      <div className="header-divider"></div>

      {/* Edges Section */}

      <div className="header-section">
        <div className="header-content">
          <div className="data-buttons">
            <button
              type="button"
              className="header-button add-edge-button"
              disabled={reviewActive}
              onClick={onAddEdge}
            >
              Add Edge
            </button>

            <button
              type="button"
              className="header-button edge-settings-button"
              disabled={reviewActive}
              onClick={onEdgeSettings}
            >
              Edge Settings
            </button>

            <button
              type="button"
              className="header-button delete-edge-button"
              disabled={!edgeDeleteEnabled || reviewActive}
              onClick={onDeleteEdge}
            >
              Delete Edge
            </button>
          </div>
        </div>

        <div className="section-title">Edges</div>
      </div>

      <div className="header-divider"></div>

      {/* Model Section */}

      <div className="header-section">
        <div className="header-content">
          <div className="data-buttons">
            <button
              type="button"
              className="header-button add-model-button"
              disabled={!modelEnabled}
              onClick={onAddModel}
            >
              Add Model
            </button>
          </div>
        </div>

        <div className="section-title">Model</div>
      </div>
    </header>
  );
}

export default Header;
