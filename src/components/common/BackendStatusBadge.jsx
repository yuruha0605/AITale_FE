import { useEffect, useState } from "react";
import { checkBackendHealth } from "../../services/systemService";
import "./BackendStatusBadge.css";

const POLL_INTERVAL_MS = 30000;

export default function BackendStatusBadge() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    const syncStatus = async () => {
      try {
        const result = await checkBackendHealth();
        if (!active) {
          return;
        }
        setStatus(result.ok ? "up" : "down");
      } catch {
        if (!active) {
          return;
        }
        setStatus("down");
      }
    };

    syncStatus();
    const timer = setInterval(syncStatus, POLL_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const labelByStatus = {
    checking: "BE 확인중",
    up: "BE 연결됨",
    down: "BE 끊김",
  };

  return (
    <div className={`backend-status-badge ${status}`} aria-live="polite">
      <span className="backend-status-dot" />
      <span className="backend-status-label">{labelByStatus[status]}</span>
    </div>
  );
}