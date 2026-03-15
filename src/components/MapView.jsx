import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CHICAGO_CENTER, getDistance } from "../data/mockData";

function buildMyIcon(avatarSrc) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:46px;height:46px;border-radius:50%;
        border:3px solid #3b82f6;
        overflow:hidden;background:#1e3a5f;
        box-shadow:0 0 0 3px rgba(59,130,246,0.35), 0 3px 12px rgba(0,0,0,0.7);
        cursor:pointer;
      ">
        <img src="${avatarSrc}" style="width:100%;height:100%;object-fit:cover;" />
      </div>`,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
    popupAnchor: [0, -26],
  });
}

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
        width:42px;height:42px;border-radius:50%;
        border:2.5px solid ${user.online ? "#22c55e" : "#4b5563"};
        overflow:hidden;background:#1f2937;
        box-shadow:0 2px 10px rgba(0,0,0,0.6);cursor:pointer;
      ">
        <img src="${user.avatar}" style="width:100%;height:100%;object-fit:cover;" />
      </div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
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
        font-size:11px;font-weight:700;letter-spacing:.3px;
        white-space:nowrap;box-shadow:0 2px 10px rgba(0,0,0,0.5);cursor:pointer;
      ">${event.title}</div>`,
    iconAnchor: [0, 10],
    popupAnchor: [60, -10],
  });
}

// Dark popup styles injected once
let popupStyleInjected = false;
function injectPopupStyle() {
  if (popupStyleInjected) return;
  popupStyleInjected = true;
  const s = document.createElement("style");
  s.textContent = `
    .leaflet-popup-content-wrapper {
      background: #1f2937 !important;
      color: #f9fafb !important;
      border-radius: 12px !important;
      border: 1px solid #374151 !important;
      box-shadow: 0 8px 24px rgba(0,0,0,.6) !important;
    }
    .leaflet-popup-tip { background: #1f2937 !important; }
    .leaflet-popup-close-button { color: #9ca3af !important; }
  `;
  document.head.appendChild(s);
}

export default function MapView({ users, events, myLocation, locationReady, selectedNeighborhood, profile, onUserClick }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const myDotRef = useRef(null);        // blue "you are here" circle
  const flewToUserRef = useRef(false);  // only fly to user location once

  // Init map once (always starts at Chicago center)
  useEffect(() => {
    if (mapInstance.current) return;
    injectPopupStyle();

    mapInstance.current = L.map(mapRef.current, {
      center: CHICAGO_CENTER,
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(mapInstance.current);

    L.control.zoom({ position: "bottomright" }).addTo(mapInstance.current);

    // My profile avatar marker — avatar src and name updated after profile loads
    const avatarSrc = profile?.avatar ?? "https://api.dicebear.com/7.x/personas/svg?seed=me";
    const myIcon = buildMyIcon(avatarSrc);
    const popupLabel = profile ? `<span style="color:#f9fafb;font-weight:700">${profile.name}</span><br/><span style="color:#9ca3af;font-size:11px">${profile.neighborhood}</span>` : '<span style="color:#f9fafb;font-weight:700">You</span>';

    myDotRef.current = L.marker(CHICAGO_CENTER, { icon: myIcon, zIndexOffset: 1000 })
      .addTo(mapInstance.current)
      .bindPopup(popupLabel);
  }, []);

  // Update my marker icon + popup when profile changes
  useEffect(() => {
    if (!myDotRef.current || !profile) return;
    myDotRef.current.setIcon(buildMyIcon(profile.avatar));
    myDotRef.current
      .getPopup()
      ?.setContent(
        `<span style="color:#f9fafb;font-weight:700">${profile.name}</span><br/><span style="color:#9ca3af;font-size:11px">${profile.neighborhood}</span>`
      );
  }, [profile]);

  // Move the blue dot whenever myLocation updates; fly there on first real fix
  useEffect(() => {
    if (!mapInstance.current || !myDotRef.current) return;
    const latlng = L.latLng(myLocation[0], myLocation[1]);
    myDotRef.current.setLatLng(latlng);

    if (locationReady && !flewToUserRef.current) {
      flewToUserRef.current = true;
      mapInstance.current.flyTo(latlng, 14, { duration: 1.2 });
    }
  }, [myLocation, locationReady]);

  // Fly to selected neighborhood (overrides the auto-fly)
  useEffect(() => {
    if (!mapInstance.current || !selectedNeighborhood) return;
    mapInstance.current.flyTo(
      [selectedNeighborhood.lat, selectedNeighborhood.lng],
      14,
      { duration: 0.8 }
    );
  }, [selectedNeighborhood]);

  // Redraw markers whenever data changes
  useEffect(() => {
    if (!mapInstance.current) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    users.forEach((user) => {
      const dist = getDistance(myLocation[0], myLocation[1], user.lat, user.lng).toFixed(1);
      const marker = L.marker([user.lat, user.lng], { icon: createUserIcon(user) })
        .addTo(mapInstance.current)
        .bindPopup(
          `<div style="min-width:150px">
            <div style="font-weight:700;font-size:13px;color:#f9fafb">${user.name}, ${user.age}</div>
            <div style="color:#9ca3af;font-size:11px;margin-top:2px">${user.neighborhood}</div>
            <div style="font-size:12px;margin-top:5px;color:#d1d5db">${user.bio}</div>
            <div style="font-size:11px;margin-top:6px;color:#60a5fa">${dist} mi away</div>
            <button onclick="window.__userClick(${user.id})" style="
              margin-top:8px;width:100%;padding:6px;background:#3b82f6;
              color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;
            ">View Profile</button>
          </div>`
        );
      markersRef.current.push(marker);
    });

    events.forEach((event) => {
      const marker = L.marker([event.lat, event.lng], { icon: createEventIcon(event) })
        .addTo(mapInstance.current)
        .bindPopup(
          `<div style="min-width:150px">
            <div style="font-weight:700;font-size:13px;color:#f9fafb">${event.title}</div>
            <div style="color:#9ca3af;font-size:11px;margin-top:2px">${event.neighborhood}</div>
            <div style="font-size:12px;margin-top:5px;color:#d1d5db">${event.description}</div>
            <div style="font-size:11px;margin-top:6px;color:#9ca3af">
              📅 ${event.date} at ${event.time} · 👥 ${event.attendees}
            </div>
          </div>`
        );
      markersRef.current.push(marker);
    });
  }, [users, events]);

  useEffect(() => {
    window.__userClick = (id) => {
      const user = users.find((u) => u.id === id);
      if (user) onUserClick(user);
    };
    return () => { delete window.__userClick; };
  }, [users, onUserClick]);

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}
