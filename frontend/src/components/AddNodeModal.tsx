import { useState } from "react";
import "./AddNodeModal.css";

interface Props {
  columns: string[];

  identifier: string;

  onClose: () => void;

  onSubmit: (data: {
    id: string;
    attributes: Record<string, string>[];
  }) => Promise<boolean> | boolean;

  editMode?: boolean;

  initialRows?: Record<string, string>[];

  originalIdentifier?: string;
}

function AddNodeModal({
  columns,
  identifier,
  onClose,
  onSubmit,
  editMode = false,
  initialRows,
  originalIdentifier,
}: Props) {
  /*
        Remove identifier column from the editable table.
    */

  const attributeColumns = columns.filter((column) => column !== identifier);

  /*
        Create an empty data row.
    */

  const createEmptyRow = () => {
    const row: Record<string, string> = {};

    attributeColumns.forEach((column) => {
      row[column] = "";
    });

    return row;
  };

  /*
        Identifier
    */

  const [nodeId, setNodeId] = useState(originalIdentifier ?? "");

  /*
        Existing data rows
    */

  const [rows, setRows] = useState<Record<string, string>[]>(
    initialRows
      ? initialRows.map((row) => {
          const newRow: Record<string, string> = {};

          attributeColumns.forEach((column) => {
            newRow[column] = row[column] ?? "";
          });

          return newRow;
        })
      : [createEmptyRow()],
  );

  const [warning, setWarning] = useState("");

  /*
        Update one table cell.
    */

  const updateCell = (rowIndex: number, column: string, value: string) => {
    setRows((previous) =>
      previous.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              [column]: value,
            }
          : row,
      ),
    );
  };

  /*
        Add another data row.
    */

  const addRow = () => {
    setRows((previous) => [...previous, createEmptyRow()]);
  };

  /*
        Remove data row.
    */

  const removeRow = (index: number) => {
    if (rows.length <= 1) {
      return;
    }

    setRows((previous) => previous.filter((_, i) => i !== index));
  };

  const canAdd = nodeId.trim() !== "" && rows.length > 0;

  /*
        Save
    */

  const handleAdd = async () => {
    if (!canAdd) {
      return;
    }

    /*
            Insert identifier into every record.
        */

    const attributes = rows.map((row) => ({
      [identifier]: nodeId,

      ...row,
    }));

    const success = await onSubmit({
      id: nodeId,

      attributes,
    });

    if (!success) {
      setWarning("A node with this key attribute already exists.");

      return;
    }

    setWarning("");
  };

  return (
    <div className="modal-overlay">
      <div className="add-node-modal large">
        <h3>{editMode ? "Edit Node" : "Add New Node"}</h3>

        {/* Identifier */}

        <div className="attribute-row key-attribute-row">
          <label className="key-attribute-label">
            <span className="key-attribute-name">{identifier}</span>

            <span className="key-note">(key attribute)</span>
          </label>

          <input value={nodeId} onChange={(e) => setNodeId(e.target.value)} />
        </div>

        {/* Data table */}

        <div className="node-table-container">
          <table className="node-data-table">
            <thead>
              <tr>
                {attributeColumns.map((column) => (
                  <th key={column}>{column}</th>
                ))}

                <th></th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {attributeColumns.map((column) => (
                    <td key={column}>
                      <input
                        value={row[column] ?? ""}
                        onChange={(e) =>
                          updateCell(
                            rowIndex,

                            column,

                            e.target.value,
                          )
                        }
                      />
                    </td>
                  ))}

                  <td>
                    <button
                      type="button"
                      className="delete-row-button"
                      onClick={() => removeRow(rowIndex)}
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="add-row-button" type="button" onClick={addRow}>
          Add Row
        </button>

        {warning && <div className="node-warning">{warning}</div>}

        <div className="modal-buttons">
          <button className="modal-button active" onClick={onClose}>
            Cancel
          </button>

          <button
            className={canAdd ? "modal-button active" : "modal-button"}
            disabled={!canAdd}
            onClick={handleAdd}
          >
            {editMode ? "Apply" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNodeModal;
