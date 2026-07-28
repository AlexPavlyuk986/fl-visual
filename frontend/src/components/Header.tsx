import "./Header.css";
import { useRef } from "react";

interface HeaderProps {
  onUpload: (file: File) => void;

  uploaded: boolean;

  onAddNode: () => void;

  onAddEdge: () => void;

  onDeleteNode: () => void;

  onEditNode: () => void;

  editEnabled: boolean;

  deleteEnabled: boolean;
}

function Header({
  onUpload,

  uploaded,

  onAddNode,

  onAddEdge,

  onDeleteNode,

  deleteEnabled,

  onEditNode,

  editEnabled,
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
              disabled={!uploaded}
              onClick={onAddNode}
            >
              Add Node
            </button>

            <button
              type="button"
              className={
                editEnabled
                  ? "header-button edit-node-button active"
                  : "header-button edit-node-button"
              }
              disabled={!editEnabled}
              onClick={onEditNode}
            >
              Edit Node
            </button>

            <button
              type="button"
              className={
                deleteEnabled
                  ? "header-button delete-node-button active"
                  : "header-button delete-node-button"
              }
              disabled={!deleteEnabled}
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
              onClick={onAddEdge}
            >
              Add Edge
            </button>
          </div>
        </div>

        <div className="section-title">Edges</div>
      </div>

      <div className="header-divider"></div>

      {/* Model Section */}

      <div className="header-section">
        <div className="header-content">{/* Future model buttons */}</div>

        <div className="section-title">Model</div>
      </div>
    </header>
  );
}

export default Header;
