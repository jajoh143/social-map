import { useState } from "react";

const STORAGE_KEY = "chisocial_profile";

export default function useProfile() {
  const [profile, setProfileState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const saveProfile = (data) => {
    const updated = { ...data, updatedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setProfileState(updated);
  };

  const clearProfile = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfileState(null);
  };

  return { profile, saveProfile, clearProfile };
}
