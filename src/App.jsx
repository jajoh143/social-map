import { useState } from "react";
import MapView from "./components/MapView";
import ProximityGrid from "./components/ProximityGrid";
import EventsView from "./components/EventsView";
import NeighborhoodPicker from "./components/NeighborhoodPicker";
import ProfileSetup from "./components/ProfileSetup";
import ProfileEdit from "./components/ProfileEdit";
import useGeolocation from "./hooks/useGeolocation";
import useProfile from "./hooks/useProfile";
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
  const [showEditProfile, setShowEditProfile] = useState(false);

  const { location: myLocation, ready: locationReady } = useGeolocation();
  const { profile, saveProfile, clearProfile } = useProfile();

  const handleAddEvent = (event) => {
    setEvents((prev) => [...prev, event]);
  };

  // First launch — no profile yet
  if (!profile) {
    return (
      <div className="app">
        <ProfileSetup onComplete={saveProfile} />
      </div>
    );
  }

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
            <button
              className="my-avatar"
              onClick={() => setShowEditProfile(true)}
              title="Edit profile"
            >
              <img src={profile.avatar} alt={profile.name} />
            </button>
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
            profile={profile}
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

      {showEditProfile && (
        <ProfileEdit
          profile={profile}
          onSave={saveProfile}
          onClose={() => setShowEditProfile(false)}
          onDeleteProfile={() => {
            clearProfile();
            setShowEditProfile(false);
          }}
        />
      )}
    </div>
  );
}
