import type { NodeData } from "../types/graph";

interface NodePopupProps {
  node: NodeData;

  identifier: string;
}

function NodePopup({
  node,

  identifier,
}: NodePopupProps) {
  const rows = Array.isArray(node.attributes)
    ? node.attributes
    : [node.attributes];

  // Remove identifier column from table

  const columns = Object.keys(rows[0] ?? {})

    .filter((column) => column !== identifier);

  return (
    <div className="node-popup">
      <h3>
        {identifier} = {node.id}
      </h3>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column}>{String(row[column])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NodePopup;
