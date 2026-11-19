(() => {
  // popup/popup.js
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(["lastAnalysis", "settings"], (data) => {
        const a = data.lastAnalysis;
        if (a) {
          const platEl = document.getElementById("popup-platform");
          const langEl = document.getElementById("popup-lang");
          const timeEl = document.getElementById("popup-time");
          const spaceEl = document.getElementById("popup-space");
          const runtimeEl = document.getElementById("popup-runtime");
          if (platEl) platEl.textContent = a.site || "LeetCode";
          if (langEl) langEl.textContent = a.language || "C++";
          if (timeEl) timeEl.textContent = typeof a.time === "object" ? a.time?.complexity : a.timeComplexity || a.time || "\u2014";
          if (spaceEl) spaceEl.textContent = typeof a.space === "object" ? a.space?.complexity : a.spaceComplexity || a.space || "\u2014";
          if (runtimeEl) runtimeEl.textContent = a.analysisTimeMs ? `\u26A1 ${a.analysisTimeMs}ms` : "\u26A1 Ready";
        }
        const s = data.settings;
        if (s) {
          const toggle2 = document.getElementById("toggle-realtime");
          if (toggle2) toggle2.checked = s.realtimeAnalysis !== false;
        }
      });
      const toggle = document.getElementById("toggle-realtime");
      if (toggle) {
        toggle.addEventListener("change", (e) => {
          chrome.storage.local.get("settings", ({ settings }) => {
            const updated = { ...settings || {}, realtimeAnalysis: e.target.checked };
            chrome.storage.local.set({ settings: updated });
          });
        });
      }
    }
  });
})();
