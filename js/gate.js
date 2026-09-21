// ============ Password gate ============
// Client-side only: this deters casual visitors, it is not real access control
// (the password check runs in the browser and the password is visible in this file).

const SITE_PASSWORD = "7979";

function unlockSite() {
  localStorage.setItem("siteUnlocked", "1");
  document.documentElement.classList.remove("gate-locked");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("gateForm");
  const input = document.getElementById("gatePasswordInput");
  const errorEl = document.getElementById("gateError");
  const card = document.querySelector(".gate-card");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value === SITE_PASSWORD) {
      errorEl.hidden = true;
      unlockSite();
    } else {
      errorEl.hidden = false;
      input.value = "";
      input.focus();
      card.classList.remove("shake");
      void card.offsetWidth; // restart animation
      card.classList.add("shake");
    }
  });
});
