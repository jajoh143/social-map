import { useState, useEffect, useRef } from "react";
import { CHICAGO_CENTER } from "../data/mockData";

const GEO_OPTIONS = {
  enableHighAccuracy: true,
  maximumAge: 15000,      // accept a cached position up to 15s old
  timeout: 10000,         // give up waiting after 10s
};

export default function useGeolocation() {
  const [location, setLocation] = useState(CHICAGO_CENTER); // [lat, lng]
  const [ready, setReady] = useState(false);   // true once we have a real fix
  const [error, setError] = useState(null);    // permission denied, etc.
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    const onSuccess = (pos) => {
      setLocation([pos.coords.latitude, pos.coords.longitude]);
      setReady(true);
      setError(null);
    };

    const onError = (err) => {
      setError(err.message);
      // Keep the last known location (or Chicago fallback) — don't blank it
    };

    // watchPosition fires immediately with a cached fix, then again on movement
    watchIdRef.current = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      GEO_OPTIONS
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return { location, ready, error };
}
