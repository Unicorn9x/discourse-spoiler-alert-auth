import { withPluginApi } from "discourse/lib/plugin-api";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import { i18n } from "discourse-i18n";

function initializeSpoilerAuth(api) {
  const currentUser = api.getCurrentUser();

  function revealSpoiler(spoiler) {
    const originalContent = spoiler.getAttribute("data-spoiler-content");
    if (!originalContent) return;

    spoiler.classList.remove("spoiler-blurred");
    spoiler.innerHTML = originalContent;
  }

  api.decorateCookedElement(
    (element) => {
      if (!element || !element.querySelectorAll) return;

      try {
        const spoilers = element.querySelectorAll(".spoiler-auth");
        if (!spoilers.length) return;

        spoilers.forEach((spoiler) => {
          if (!spoiler) return;

          if (!currentUser) {
            // For non-logged-in users, just add tooltip
            spoiler.style.cursor = "default";
            return;
          }

          // For logged-in users
          spoiler.style.cursor = "pointer";
          spoiler.addEventListener("click", function handler(e) {
            e.preventDefault();
            e.stopPropagation();
            revealSpoiler(this);
            this.removeEventListener("click", handler);
          });
        });
      } catch (error) {
        console.error("Error processing spoiler element:", error);
      }
    },
    { id: "spoiler-auth" }
  );
}

export default {
  name: "spoiler-auth",

  initialize(container) {
    const siteSettings = container.lookup("service:site-settings");
    if (siteSettings.spoiler_auth_enabled) {
      withPluginApi("1.15.0", initializeSpoilerAuth);
    }
  },
}; 