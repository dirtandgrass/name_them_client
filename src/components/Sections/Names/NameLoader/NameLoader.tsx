import { useEffect } from "react";
import Spinner from "../../../Spinner/Spinner";
import "./NameLoader.css";
function NameLoader() {
  return (
    <div className="loading active" id="name-loading">
      <Spinner />
      <div id="name-loading-text">Loading some names...</div>
    </div>
  );
}

export function setLoading(loading: boolean): void {
  const findEl = document.getElementById("name-loading");
  if (findEl) {
    // ensure it exists

    findEl.classList.remove(loading ? "settled" : "active");
    findEl.classList.add(loading ? "active" : "settled");
  }
}

export function setLoadingText(text: string): void {
  const findEl = document.getElementById("name-loading-text");
  if (findEl) {
    // ensure it exists

    findEl.innerHTML = text;
  }
}

export default NameLoader;
