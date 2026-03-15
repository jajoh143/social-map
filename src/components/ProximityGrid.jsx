import { useState } from "react";
import { getDistance } from "../data/mockData";
import UserModal from "./UserModal";

const INTEREST_COLORS = [
  "badge-purple", "badge-pink", "badge-amber", "badge-green", "badge-blue",
];

export default function ProximityGrid({ users, myLocation }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const sorted = [...users]
    .map((u) => ({
      ...u,
      distance: getDistance(myLocation[0], myLocation[1], u.lat, u.lng),
    }))
    .filter((u) => filter === "all" || (filter === "online" && u.online))
    .sort((a, b) => a.distance - b.distance);

  return (
    <div className="grid-page">
      <div className="grid-header">
        <h2 className="section-title">Nearby People</h2>
        <div className="filter-row">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Everyone
          </button>
          <button
            className={`filter-btn ${filter === "online" ? "active" : ""}`}
            onClick={() => setFilter("online")}
          >
            🟢 Online
          </button>
        </div>
      </div>

      <div className="user-grid">
        {sorted.map((user) => (
          <div
            key={user.id}
            className="user-card"
            onClick={() => setSelected(user)}
          >
            <div className="card-avatar-wrap">
              <img src={user.avatar} alt={user.name} className="card-avatar" />
              <span className={`online-dot ${user.online ? "online" : "offline"}`} />
            </div>
            <div className="card-body">
              <div className="card-name">{user.name}, {user.age}</div>
              <div className="card-neighborhood">{user.neighborhood}</div>
              <div className="card-bio">{user.bio}</div>
              <div className="card-interests">
                {user.interests.slice(0, 3).map((interest, i) => (
                  <span key={interest} className={`badge ${INTEREST_COLORS[i % INTEREST_COLORS.length]}`}>
                    {interest}
                  </span>
                ))}
              </div>
              <div className="card-distance">
                📍 {user.distance.toFixed(1)} mi away
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <UserModal user={selected} myLocation={myLocation} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
