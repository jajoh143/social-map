import { useState } from "react";
import MapView from "./components/MapView";
import ProximityGrid from "./components/ProximityGrid";
import EventsView from "./components/EventsView";
import NeighborhoodPicker from "./components/NeighborhoodPicker";
import useGeolocation from "./hooks/useGeolocation";
import { mockUsers, mockEvents } from "./data/mockData";
import "./App.css";

const NAV_ITEMS = [
  { id: "map", label: "Map", icon: "🗺️" },
  { id: "grid", label: "People", icon: "👥" },
  { id: "events", label: "Events", icon: "📅" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("map");
  const [users] = useState(mockUsers);
  const [events, setEvents] = useState(mockEvents);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const { location: myLocation, ready: locationReady, error: locationError } = useGeolocation();

  const handleAddEvent = (event) => {
    setEvents((prev) => [...prev, event]);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">📍</span>
            <span className="logo-text">ChiSocial</span>
          </div>
          <div className="header-right">
            <button
              className="neighborhood-btn"
              onClick={() => setShowPicker(true)}
            >
              <span className="neighborhood-pin">
                {locationReady ? "📌" : "⏳"}
              </span>
              <span className="neighborhood-name">
                {selectedNeighborhood ? selectedNeighborhood.name : "Chicago"}
              </span>
              <span className="neighborhood-caret">▾</span>
            </button>
            <div className="my-avatar">
              <img
                src="https://api.dicebear.com/7.x/personas/svg?seed=me"
                alt="Me"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        {activeTab === "map" && (
          <MapView
            users={users}
            events={events}
            myLocation={myLocation}
            locationReady={locationReady}
            selectedNeighborhood={selectedNeighborhood}
            onUserClick={() => {}}
          />
        )}
        {activeTab === "grid" && (
          <ProximityGrid
            users={users}
            myLocation={myLocation}
            selectedNeighborhood={selectedNeighborhood}
          />
        )}
        {activeTab === "events" && (
          <EventsView events={events} onAddEvent={handleAddEvent} />
        )}
      </main>

      <nav className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {showPicker && (
        <NeighborhoodPicker
          selected={selectedNeighborhood}
          onSelect={setSelectedNeighborhood}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
