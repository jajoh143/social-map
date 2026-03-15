import { useState } from "react";
import { getDistance } from "../data/mockData";
import UserModal from "./UserModal";

export default function ProximityGrid({ users, myLocation, selectedNeighborhood }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const sorted = [...users]
    .map((u) => ({
      ...u,
      distance: getDistance(myLocation[0], myLocation[1], u.lat, u.lng),
    }))
    .filter((u) => {
      if (filter === "online" && !u.online) return false;
      if (selectedNeighborhood && u.neighborhood !== selectedNeighborhood.name) return false;
      return true;
    })
    .sort((a, b) => a.distance - b.distance);

  const title = selectedNeighborhood ? selectedNeighborhood.name : "Nearby People";

  return (
    <div className="grid-page">
      <div className="grid-header">
        <h2 className="section-title">{title}</h2>
        <div className="filter-row" style={{ padding: 0 }}>
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === "online" ? "active" : ""}`}
            onClick={() => setFilter("online")}
          >
            Online
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">No users found here.</div>
      ) : (
        <div className="photo-grid">
          {sorted.map((user) => (
            <button
              key={user.id}
              className="photo-cell"
              onClick={() => setSelected(user)}
            >
              <div className="photo-img-wrap">
                <img src={user.avatar} alt={user.name} className="photo-img" />
                {user.online && <span className="photo-online-dot" />}
              </div>
              <span className="photo-username">{user.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <UserModal
          user={selected}
          myLocation={myLocation}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
