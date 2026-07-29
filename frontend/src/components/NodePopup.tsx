import type { NodeData } from "../types/graph";
import "./NodePopup.css";

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


  const model = node.model;


  return (
    <div className="node-popup">


      {/* ===========================
          Data Section
      =========================== */}

      <div className="popup-section">

        <h3>
          {identifier} = {node.id}
        </h3>


        <div className="table-container">

          <table>

            <thead>

              <tr>

                {columns.map((column) => (

                  <th key={column}>
                    {column}
                  </th>

                ))}

              </tr>

            </thead>


            <tbody>

              {rows.map((row, index) => (

                <tr key={index}>

                  {columns.map((column) => (

                    <td key={column}>
                      {String(row[column])}
                    </td>

                  ))}

                </tr>

              ))}

            </tbody>


          </table>

        </div>

      </div>



      {/* ===========================
          Local Model Section
      =========================== */}

      <div className="popup-section model-section">


        <h3>
          Local Model
        </h3>


        {
          model ?

          (

            <div className="model-info">


              <div className="model-row">

                <span className="model-label">
                  Type:
                </span>

                <span>
                  {model.type}
                </span>

              </div>



              <div className="model-row">

                <span className="model-label">
                  Features:
                </span>

                <span>
                  {
                    model.features.length > 0
                    ? model.features.join(", ")
                    : "None"
                  }
                </span>

              </div>



              <div className="model-row">

                <span className="model-label">
                  Labels:
                </span>

                <span>
                  {
                    model.labels.length > 0
                    ? model.labels.join(", ")
                    : "None"
                  }
                </span>

              </div>


            </div>

          )


          :

          (

            <div className="no-model">

              No local model assigned.

            </div>

          )

        }


      </div>


    </div>
  );
}

export default NodePopup;