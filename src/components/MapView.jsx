import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CHICAGO_CENTER, getDistance } from "../data/mockData";

// Fix default marker icons broken by Vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CATEGORY_COLORS = {
  Music: "#8b5cf6",
  Art: "#ec4899",
  Sports: "#f59e0b",
  Food: "#10b981",
  Other: "#6b7280",
};

function createUserIcon(user) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:44px;height:44px;border-radius:50%;
        border:3px solid ${user.online ? "#22c55e" : "#9ca3af"};
        overflow:hidden;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);
        cursor:pointer;
      ">
        <img src="${user.avatar}" style="width:100%;height:100%;object-fit:cover;" />
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -24],
  });
}

function createEventIcon(event) {
  const color = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other;
  return L.divIcon({
    className: "",
    html: `
      <div style="
        background:${color};color:#fff;
        padding:4px 10px;border-radius:20px;
        font-size:12px;font-weight:600;
        white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3);
        cursor:pointer;
      ">${event.title}</div>
    `,
    iconAnchor: [0, 10],
    popupAnchor: [60, -10],
  });
}

export default function MapView({ users, events, myLocation, onUserClick, onEventClick }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [activeLayer, setActiveLayer] = useState("both");

  useEffect(() => {
    if (mapInstance.current) return;
    mapInstance.current = L.map(mapRef.current, {
      center: CHICAGO_CENTER,
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    // My location marker
    L.circleMarker(myLocation, {
      radius: 10,
      fillColor: "#3b82f6",
      color: "#fff",
      weight: 3,
      fillOpacity: 1,
    })
      .addTo(mapInstance.current)
      .bindPopup("<b>You are here</b>");
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (activeLayer !== "events") {
      users.forEach((user) => {
        const dist = getDistance(myLocation[0], myLocation[1], user.lat, user.lng).toFixed(1);
        const marker = L.marker([user.lat, user.lng], { icon: createUserIcon(user) })
          .addTo(mapInstance.current)
          .bindPopup(
            `<div style="min-width:160px">
              <div style="font-weight:700;font-size:14px">${user.name}, ${user.age}</div>
              <div style="color:#6b7280;font-size:12px">${user.neighborhood}</div>
              <div style="font-size:12px;margin-top:4px">${user.bio}</div>
              <div style="font-size:11px;margin-top:6px;color:#3b82f6">${dist} mi away</div>
              <button onclick="window.__userClick(${user.id})" style="
                margin-top:8px;width:100%;padding:6px;background:#3b82f6;
                color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:12px;
              ">View Profile</button>
            </div>`
          );
        markersRef.current.push(marker);
      });
    }

    if (activeLayer !== "users") {
      events.forEach((event) => {
        const marker = L.marker([event.lat, event.lng], { icon: createEventIcon(event) })
          .addTo(mapInstance.current)
          .bindPopup(
            `<div style="min-width:160px">
              <div style="font-weight:700;font-size:14px">${event.title}</div>
              <div style="color:#6b7280;font-size:12px">${event.neighborhood}</div>
              <div style="font-size:12px;margin-top:4px">${event.description}</div>
              <div style="font-size:11px;margin-top:6px">
                📅 ${event.date} at ${event.time}<br/>
                👥 ${event.attendees} attending
              </div>
            </div>`
          );
        markersRef.current.push(marker);
      });
    }
  }, [users, events, activeLayer]);

  useEffect(() => {
    window.__userClick = (id) => {
      const user = users.find((u) => u.id === id);
      if (user) onUserClick(user);
    };
    return () => { delete window.__userClick; };
  }, [users, onUserClick]);

  return (
    <div className="map-container">
      <div className="map-controls">
        {["both", "users", "events"].map((l) => (
          <button
            key={l}
            className={`layer-btn ${activeLayer === l ? "active" : ""}`}
            onClick={() => setActiveLayer(l)}
          >
            {l === "both" ? "All" : l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
      </div>
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
