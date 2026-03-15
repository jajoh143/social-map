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

const TOTAL_STEPS = 3;

export default function ProfileSetup({ onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    avatarSeed: AVATAR_SEEDS[0],
    name: "",
    age: "",
    bio: "",
    neighborhood: NEIGHBORHOODS[0].name,
    interests: [],
  });
  const [errors, setErrors] = useState({});

  const avatarUrl = (seed) =>
    `https://api.dicebear.com/7.x/personas/svg?seed=${seed}`;

  const toggleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const validateStep = () => {
    const errs = {};
    if (step === 2) {
      if (!form.name.trim()) errs.name = "Name is required";
      const age = parseInt(form.age);
      if (!form.age || isNaN(age) || age < 18 || age > 99)
        errs.age = "Enter a valid age (18–99)";
    }
    if (step === 3) {
      if (form.interests.length < 2) errs.interests = "Pick at least 2 interests";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else handleSubmit();
  };

  const back = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = () => {
    onComplete({
      name: form.name.trim(),
      age: parseInt(form.age),
      bio: form.bio.trim(),
      neighborhood: form.neighborhood,
      interests: form.interests,
      avatar: avatarUrl(form.avatarSeed),
      online: true,
    });
  };

  return (
    <div className="setup-screen">
      {/* Progress bar */}
      <div className="setup-progress">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`setup-progress-dot ${i + 1 <= step ? "active" : ""}`}
          />
        ))}
      </div>

      <div className="setup-body">
        {/* ── Step 1: Avatar ── */}
        {step === 1 && (
          <div className="setup-step">
            <div className="setup-step-header">
              <div className="setup-logo">📍 ChiSocial</div>
              <h1 className="setup-title">Choose your look</h1>
              <p className="setup-subtitle">Pick an avatar that represents you</p>
            </div>
            <div className="avatar-preview-wrap">
              <img
                src={avatarUrl(form.avatarSeed)}
                className="avatar-preview"
                alt="Selected avatar"
              />
            </div>
            <div className="avatar-grid">
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
        )}

        {/* ── Step 2: Info ── */}
        {step === 2 && (
          <div className="setup-step">
            <div className="setup-step-header">
              <img
                src={avatarUrl(form.avatarSeed)}
                className="setup-mini-avatar"
                alt="avatar"
              />
              <h1 className="setup-title">About you</h1>
              <p className="setup-subtitle">Tell people a little about yourself</p>
            </div>
            <div className="setup-fields">
              <label className="setup-label">
                Name *
                <input
                  className={`setup-input ${errors.name ? "input-error" : ""}`}
                  placeholder="Your first name"
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
                  placeholder="e.g. 28"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  min={18}
                  max={99}
                />
                {errors.age && <span className="field-error">{errors.age}</span>}
              </label>
              <label className="setup-label">
                Bio
                <textarea
                  className="setup-input setup-textarea"
                  placeholder="One line about yourself…"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  maxLength={120}
                  rows={3}
                />
                <span className="char-count">{form.bio.length}/120</span>
              </label>
            </div>
          </div>
        )}

        {/* ── Step 3: Neighborhood + Interests ── */}
        {step === 3 && (
          <div className="setup-step">
            <div className="setup-step-header">
              <img
                src={avatarUrl(form.avatarSeed)}
                className="setup-mini-avatar"
                alt="avatar"
              />
              <h1 className="setup-title">Your scene</h1>
              <p className="setup-subtitle">Where are you based and what do you love?</p>
            </div>
            <div className="setup-fields">
              <label className="setup-label">
                Home neighborhood
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
              <div className="setup-label">
                Interests * <span className="setup-label-hint">(pick at least 2)</span>
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
                  <span className="field-error">{errors.interests}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div className="setup-footer">
        {step > 1 && (
          <button className="setup-back-btn" onClick={back}>
            Back
          </button>
        )}
        <button className="setup-next-btn" onClick={next}>
          {step === TOTAL_STEPS ? "Create Profile" : "Continue"}
        </button>
      </div>
    </div>
  );
}
