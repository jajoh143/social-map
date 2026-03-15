import { useState } from "react";

const CATEGORIES = ["Music", "Art", "Sports", "Food", "Other"];

const CATEGORY_COLORS = {
  Music: "#8b5cf6",
  Art: "#ec4899",
  Sports: "#f59e0b",
  Food: "#10b981",
  Other: "#6b7280",
};

const defaultForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  category: "Other",
  neighborhood: "",
  lat: 41.8781,
  lng: -87.6298,
};

export default function EventsView({ events, onAddEvent }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [filterCat, setFilterCat] = useState("All");

  const filtered = filterCat === "All" ? events : events.filter((e) => e.category === filterCat);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time) return;
    onAddEvent({
      ...form,
      id: Date.now(),
      attendees: 1,
      organizer: "You",
    });
    setForm(defaultForm);
    setShowForm(false);
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <h2 className="section-title">Events in Chicago</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Event
        </button>
      </div>

      <div className="filter-row scroll-x">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${filterCat === cat ? "active" : ""}`}
            style={filterCat === cat && cat !== "All" ? { background: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] } : {}}
            onClick={() => setFilterCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="events-list">
        {filtered.length === 0 && (
          <div className="empty-state">No events in this category yet.</div>
        )}
        {filtered.map((event) => (
          <div key={event.id} className="event-card">
            <div
              className="event-cat-bar"
              style={{ background: CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other }}
            />
            <div className="event-body">
              <div className="event-top">
                <div>
                  <div className="event-title">{event.title}</div>
                  <div className="event-neighborhood">{event.neighborhood}</div>
                </div>
                <span
                  className="event-badge"
                  style={{ background: CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other }}
                >
                  {event.category}
                </span>
              </div>
              <p className="event-desc">{event.description}</p>
              <div className="event-meta">
                <span>📅 {event.date} at {event.time}</span>
                <span>👤 {event.organizer}</span>
                <span>👥 {event.attendees} attending</span>
              </div>
              <button className="btn-attend">Join Event</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal form-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            <h3 className="modal-name" style={{ fontSize: "1.25rem" }}>Create New Event</h3>
            <form className="event-form" onSubmit={handleSubmit}>
              <label>
                Title *
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Event name"
                  required
                />
              </label>
              <label>
                Description
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What's happening?"
                  rows={3}
                />
              </label>
              <div className="form-row">
                <label>
                  Date *
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Time *
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    required
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Category
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Neighborhood
                  <input
                    value={form.neighborhood}
                    onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                    placeholder="e.g. Logan Square"
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Latitude
                  <input
                    type="number"
                    step="0.0001"
                    value={form.lat}
                    onChange={(e) => setForm({ ...form, lat: parseFloat(e.target.value) })}
                  />
                </label>
                <label>
                  Longitude
                  <input
                    type="number"
                    step="0.0001"
                    value={form.lng}
                    onChange={(e) => setForm({ ...form, lng: parseFloat(e.target.value) })}
                  />
                </label>
              </div>
              <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: 8 }}>
                Create Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
