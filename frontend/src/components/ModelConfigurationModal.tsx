import { useState } from "react";
import "./ModelConfigurationModal.css";

interface Props {
  node: {
    id: string;
    attributes: Record<string, string>[];
  };

  onClose: () => void;

  onApply: (config: {
    type: string;
    features: string[];
    labels: string[];
  }) => Promise<boolean>;
}

function ModelConfigurationModal({ node, onClose, onApply }: Props) {
  const attributes = Object.keys(node.attributes[0] ?? {});

  const [features, setFeatures] = useState<string[]>([]);

  const [labels, setLabels] = useState<string[]>([]);

  const toggleFeature = (feature: string) => {
    setFeatures((previous) =>
      previous.includes(feature)
        ? previous.filter((f) => f !== feature)
        : [...previous, feature],
    );
  };

  const toggleLabel = (label: string) => {
    setLabels((previous) =>
      previous.includes(label)
        ? previous.filter((l) => l !== label)
        : [...previous, label],
    );
  };

  const handleApply = async () => {
    const success = await onApply({
      type: "LinearRegression",

      features,

      labels,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="model-modal">
        <h3>Model Configuration</h3>

        <label>Model type</label>

        <select>
          <option>Linear Regression</option>
        </select>

        <h4>Features</h4>

        <div className="feature-list">
          {attributes.map((attribute) => (
            <label key={attribute} className="feature-item">
              <input
                type="checkbox"
                checked={features.includes(attribute)}
                onChange={() => toggleFeature(attribute)}
              />

              {attribute}
            </label>
          ))}
        </div>

        <h4>Labels</h4>

        <div className="feature-list">
          {attributes.map((attribute) => (
            <label key={attribute} className="feature-item">
              <input
                type="checkbox"
                checked={labels.includes(attribute)}
                onChange={() => toggleLabel(attribute)}
              />

              {attribute}
            </label>
          ))}
        </div>

        <div className="modal-buttons">
          <button className="modal-button active" onClick={onClose}>
            Cancel
          </button>

          <button
            className={
              features.length > 0 && labels.length > 0
                ? "modal-button active"
                : "modal-button"
            }
            disabled={features.length === 0 || labels.length === 0}
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModelConfigurationModal;
