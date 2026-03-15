import { useState } from "react";
import { NEIGHBORHOODS } from "../data/mockData";

const AVATAR_SEEDS = [
  "amber", "brook", "cedar", "dawn",
  "echo", "falcon", "grove", "haven",
  "iris", "jade", "kestrel", "lyra",
];

const INTEREST_OPTIONS = [
  "Coffee", "Food", "Music", "Art", "Sports", "Cycling", "Running",
  "Yoga", "Dogs", "Photography", "Travel", "Books", "Tech", "Comedy",
  "Beer", "Dancing", "Film", "Cooking", "Architecture", "Jazz",
  "Theater", "Hiking", "Brunch", "Fitness", "Vinyl", "Gaming",
];

const avatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/personas/svg?seed=${seed}`;

// Extract seed from a DiceBear URL, or fall back to first seed
function seedFromUrl(url) {
  try {
    const match = url.match(/seed=([^&]+)/);
    return match ? match[1] : AVATAR_SEEDS[0];
  } catch {
    return AVATAR_SEEDS[0];
  }
}

export default function ProfileEdit({ profile, onSave, onClose, onDeleteProfile }) {
  const [form, setForm] = useState({
    avatarSeed: seedFromUrl(profile.avatar),
    name: profile.name,
    age: String(profile.age),
    bio: profile.bio || "",
    neighborhood: profile.neighborhood,
    interests: [...profile.interests],
  });
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    const age = parseInt(form.age);
    if (!form.age || isNaN(age) || age < 18 || age > 99)
      errs.age = "Enter a valid age (18–99)";
    if (form.interests.length < 2) errs.interests = "Pick at least 2 interests";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...profile,
      name: form.name.trim(),
      age: parseInt(form.age),
      bio: form.bio.trim(),
      neighborhood: form.neighborhood,
      interests: form.interests,
      avatar: avatarUrl(form.avatarSeed),
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="picker-handle" />
        <div className="picker-header">
          <h3 className="picker-title">Edit Profile</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="edit-scroll">
          {/* Avatar row */}
          <div className="edit-section">
            <div className="edit-section-label">Avatar</div>
            <div className="edit-avatar-current">
              <img src={avatarUrl(form.avatarSeed)} alt="current avatar" />
            </div>
            <div className="avatar-grid compact">
              {AVATAR_SEEDS.map((seed) => (
                <button
                  key={seed}
                  className={`avatar-option ${form.avatarSeed === seed ? "selected" : ""}`}
                  onClick={() => setForm({ ...form, avatarSeed: seed })}
                >
                  <img src={avatarUrl(seed)} alt={seed} />
                </button>
              ))}
            </div>
          </div>

          {/* Info fields */}
          <div className="edit-section">
            <div className="edit-section-label">Info</div>
            <div className="setup-fields" style={{ gap: 10 }}>
              <label className="setup-label">
                Name *
                <input
                  className={`setup-input ${errors.name ? "input-error" : ""}`}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={40}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </label>
              <label className="setup-label">
                Age *
                <input
                  className={`setup-input ${errors.age ? "input-error" : ""}`}
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  min={18} max={99}
                />
                {errors.age && <span className="field-error">{errors.age}</span>}
              </label>
              <label className="setup-label">
                Bio
                <textarea
                  className="setup-input setup-textarea"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  maxLength={120}
                  rows={2}
                />
                <span className="char-count">{form.bio.length}/120</span>
              </label>
              <label className="setup-label">
                Neighborhood
                <select
                  className="setup-input"
                  value={form.neighborhood}
                  onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                >
                  {NEIGHBORHOODS.map((n) => (
                    <option key={n.name} value={n.name}>{n.name}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Interests */}
          <div className="edit-section">
            <div className="edit-section-label">
              Interests
              <span className="setup-label-hint"> (pick at least 2)</span>
            </div>
            <div className="interests-grid">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  className={`interest-tag ${form.interests.includes(interest) ? "selected" : ""}`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
            {errors.interests && (
              <span className="field-error" style={{ marginTop: 6, display: "block" }}>
                {errors.interests}
              </span>
            )}
          </div>

          {/* Danger zone */}
          <div className="edit-section danger-zone">
            {!confirmDelete ? (
              <button
                className="delete-btn"
                onClick={() => setConfirmDelete(true)}
              >
                Delete Profile
              </button>
            ) : (
              <div className="delete-confirm">
                <p>Are you sure? This cannot be undone.</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="delete-confirm-yes" onClick={onDeleteProfile}>
                    Yes, delete
                  </button>
                  <button className="delete-confirm-no" onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="edit-footer">
          <button className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave} style={{ flex: 2 }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
