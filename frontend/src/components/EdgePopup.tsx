import { useEffect, useState } from "react";
import "./EdgePopup.css";

import type { EdgeData } from "../types/graph";

interface Props {
  edge: EdgeData;

  onClose: () => void;

  onUpdateWeight: (source: string, target: string, weight: number) => void;
}

function EdgePopup({
  edge,

  onClose,

  onUpdateWeight,
}: Props) {
  const [weight, setWeight] = useState(String(edge.weight));

  useEffect(() => {
    setWeight(String(edge.weight));
  }, [edge]);

  const changed =
    Number(weight) !== edge.weight &&
    weight.trim() !== "" &&
    !isNaN(Number(weight));

  const handleApply = () => {
    if (!changed) {
      return;
    }

    onUpdateWeight(
      edge.source,

      edge.target,

      Number(weight),
    );
  };

  return (
    <div className="edge-popup">
      <h3>Edge Information</h3>

      <table>
        <tbody>
          <tr>
            <td>Source</td>

            <td>{edge.source}</td>
          </tr>

          <tr>
            <td>Target</td>

            <td>{edge.target}</td>
          </tr>

          <tr>
            <td>Weight</td>

            <td>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <button
        className={changed ? "edge-apply-button active" : "edge-apply-button"}
        disabled={!changed}
        onClick={handleApply}
      >
        Apply
      </button>
    </div>
  );
}

export default EdgePopup;
