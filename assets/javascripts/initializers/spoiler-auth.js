import { withPluginApi } from "discourse/lib/plugin-api";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import { i18n } from "discourse-i18n";

function initializeSpoilerAuth(api) {
  const currentUser = api.getCurrentUser();

  api.decorateCookedElement(
    (element) => {
      if (!element || !element.querySelectorAll) {
        return;
      }

      const spoilers = element.querySelectorAll(".spoiler-auth");
      if (!spoilers.length) {
        return;
      }

      spoilers.forEach((spoiler) => {
        if (!spoiler) {
          return;
        }

        try {
          if (currentUser) {
            // For logged-in users, allow revealing on click
            const originalContent = spoiler.getAttribute("data-spoiler-content");
            if (!originalContent) return;

            spoiler.addEventListener("click", function handler(e) {
              if (e.target.tagName !== "A") {
                e.preventDefault();
                e.stopPropagation();
                this.classList.remove("spoiler-blurred");
                this.innerHTML = originalContent;
                this.removeEventListener("click", handler);
              }
            });
          } else {
            // For non-logged in users, ensure they can't reveal content
            spoiler.addEventListener("click", function(e) {
              if (e.target.tagName !== "A") {
                e.preventDefault();
                e.stopPropagation();
              }
            });
          }
        } catch (error) {
          // Log error but don't break the page
          console.error("Error processing spoiler element:", error);
        }
      });
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