import { useState } from "react";
import MapView from "./components/MapView";
import ProximityGrid from "./components/ProximityGrid";
import EventsView from "./components/EventsView";
import { mockUsers, mockEvents, CHICAGO_CENTER } from "./data/mockData";
import "./App.css";

const MY_LOCATION = CHICAGO_CENTER;

const NAV_ITEMS = [
  { id: "map", label: "Map", icon: "🗺️" },
  { id: "grid", label: "People", icon: "👥" },
  { id: "events", label: "Events", icon: "📅" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("map");
  const [users] = useState(mockUsers);
  const [events, setEvents] = useState(mockEvents);

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
            <span className="my-location-badge">📌 The Loop</span>
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
            myLocation={MY_LOCATION}
            onUserClick={() => {}}
            onEventClick={() => {}}
          />
        )}
        {activeTab === "grid" && (
          <ProximityGrid users={users} myLocation={MY_LOCATION} />
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
    </div>
  );
}
