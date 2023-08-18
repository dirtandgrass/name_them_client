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

let el: HTMLElement;
export function setLoading(loading: boolean): void {
  if (el == null) {
    const findEl = document.getElementById("name-loading");
    if (findEl) {
      // ensure it exists
      el = findEl;
    }
  }

  if (el) {
    el.classList.remove(loading ? "settled" : "active");
    el.classList.add(loading ? "active" : "settled");
  }
}

let elText: HTMLElement;
export function setLoadingText(text: string): void {
  if (elText == null) {
    const findEl = document.getElementById("name-loading-text");
    if (findEl) {
      // ensure it exists
      elText = findEl;
    }
  }

  if (elText) {
    elText.innerHTML = text;
  }
}

export default NameLoader;
