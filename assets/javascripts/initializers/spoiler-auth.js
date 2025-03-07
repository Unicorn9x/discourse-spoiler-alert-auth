import { withPluginApi } from "discourse/lib/plugin-api";
import { i18n } from "discourse-i18n";

function setupSpoilerAuth(api) {
  // Check if user is logged in
  const currentUser = api.getCurrentUser();
  
  api.decorateCookedElement((element) => {
    try {
      if (!element) return;
      
      const spoilers = element.querySelectorAll(".spoiler-auth.spoiler-blurred");
      if (!spoilers.length) return;

      spoilers.forEach((spoiler) => {
        if (!spoiler) return;

        try {
          // Only process if user is logged in
          if (currentUser) {
            // Store original content
            const originalContent = spoiler.getAttribute("data-original-content");
            if (!originalContent) return;
            
            // Add click handler for logged-in users
            const clickHandler = (event) => {
              event.preventDefault();
              event.stopPropagation();
              spoiler.classList.remove("spoiler-blurred");
              spoiler.innerHTML = originalContent;
              spoiler.removeEventListener("click", clickHandler);
            };
            
            spoiler.addEventListener("click", clickHandler);
          }
        } catch (e) {
          console.error("Error processing spoiler element:", e);
        }
      });
    } catch (e) {
      console.error("Error in spoiler-auth setup:", e);
    }
  }, { id: "spoiler-auth" });
}

export default {
  name: "spoiler-auth",
  
  initialize(container) {
    try {
      const siteSettings = container.lookup("service:site-settings");
      
      if (siteSettings.spoiler_auth_enabled) {
        withPluginApi("1.15.0", setupSpoilerAuth);
      }
    } catch (e) {
      console.error("Error initializing spoiler-auth:", e);
    }
  }
}; 