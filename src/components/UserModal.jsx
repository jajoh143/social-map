import { getDistance } from "../data/mockData";

export default function UserModal({ user, myLocation, onClose }) {
  const dist = getDistance(myLocation[0], myLocation[1], user.lat, user.lng).toFixed(1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-avatar-wrap">
          <img src={user.avatar} alt={user.name} className="modal-avatar" />
          <span className={`online-dot lg ${user.online ? "online" : "offline"}`} />
        </div>
        <h2 className="modal-name">{user.name}, {user.age}</h2>
        <div className="modal-location">
          <span className={`status-badge ${user.online ? "status-online" : "status-offline"}`}>
            {user.online ? "🟢 Online" : "⚫ Offline"}
          </span>
          <span className="modal-dist">📍 {dist} mi · {user.neighborhood}</span>
        </div>
        <p className="modal-bio">{user.bio}</p>
        <div className="modal-interests">
          {user.interests.map((i) => (
            <span key={i} className="badge badge-blue">{i}</span>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn-primary">👋 Say Hi</button>
          <button className="btn-secondary">📌 View on Map</button>
        </div>
      </div>
    </div>
  );
}
