import { withPluginApi } from "discourse/lib/plugin-api";

function initializeSpoilerAuth(api) {
  const currentUser = api.getCurrentUser();

  api.decorateCookedElement(
    (element) => {
      if (!element || !element.querySelectorAll) return;

      const spoilers = element.querySelectorAll(".spoiler-auth");
      if (!spoilers.length) return;

      spoilers.forEach((spoiler) => {
        if (!currentUser) return;

        // For logged-in users only
        spoiler.style.cursor = "pointer";
        spoiler.addEventListener("click", function() {
          this.classList.remove("spoiler-blurred");
        });
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