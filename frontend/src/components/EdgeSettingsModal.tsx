import "./EdgeSettingsModal.css";

interface Props {
    edgeWidthByWeight: boolean;

    setEdgeWidthByWeight: React.Dispatch<React.SetStateAction<boolean>>;

    showEdgeLabels: boolean;

    setShowEdgeLabels: React.Dispatch<React.SetStateAction<boolean>>;

    onClose: () => void;
}

function EdgeSettingsModal({
    edgeWidthByWeight,
    setEdgeWidthByWeight,
    showEdgeLabels,
    setShowEdgeLabels,
    onClose,
}: Props) {

    return (
        <div className="modal-overlay">

            <div className="edge-settings-modal">

                <h3>Edge Settings</h3>

                <label className="setting-row">

                    <input
                        type="checkbox"
                        checked={edgeWidthByWeight}
                        onChange={(e)=>
                            setEdgeWidthByWeight(e.target.checked)
                        }
                    />

                    Edge width according to the weight

                </label>

                <label className="setting-row">

                    <input
                        type="checkbox"
                        checked={showEdgeLabels}
                        onChange={(e)=>
                            setShowEdgeLabels(e.target.checked)
                        }
                    />

                    Show weight labels

                </label>

                <div className="modal-buttons">

                    <button
                        className="modal-button active"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>
    );
}

export default EdgeSettingsModal;