import { NEIGHBORHOODS } from "../data/mockData";

export default function NeighborhoodPicker({ selected, onSelect, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="picker-handle" />
        <div className="picker-header">
          <h3 className="picker-title">Choose Neighborhood</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="picker-list">
          <button
            className={`picker-item ${!selected ? "picker-item-active" : ""}`}
            onClick={() => { onSelect(null); onClose(); }}
          >
            <span className="picker-item-name">📍 All of Chicago</span>
          </button>
          {NEIGHBORHOODS.map((n) => (
            <button
              key={n.name}
              className={`picker-item ${selected?.name === n.name ? "picker-item-active" : ""}`}
              onClick={() => { onSelect(n); onClose(); }}
            >
              <span className="picker-item-name">{n.name}</span>
              {selected?.name === n.name && <span className="picker-check">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
