import { withPluginApi } from "discourse/lib/plugin-api";
import { i18n } from "discourse-i18n";

function setupSpoilerAuth(api) {
  api.decorateCookedElement((element) => {
    element.querySelectorAll(".spoiler").forEach((spoiler) => {
      spoiler.classList.remove("spoiler");
      spoiler.classList.add("spoiled");
      spoiler.classList.add("spoiler-auth");
      
      // Store original content
      const originalContent = spoiler.innerHTML;
      
      // Replace content with login prompt for non-logged in users
      if (!api.getCurrentUser()) {
        spoiler.innerHTML = `
          <div class="spoiler-auth-prompt">
            <a href="/login" class="btn btn-primary">
              ${i18n("spoiler_auth.login_to_reveal")}
            </a>
          </div>
        `;
      }
      
      // Add click handler for logged-in users
      spoiler.addEventListener("click", (event) => {
        if (api.getCurrentUser()) {
          event.preventDefault();
          spoiler.classList.remove("spoiler-blurred");
          spoiler.innerHTML = originalContent;
        }
      });
    });
  }, { id: "spoiler-auth" });
}

export default {
  name: "spoiler-auth",
  
  initialize(container) {
    const siteSettings = container.lookup("service:site-settings");
    
    if (siteSettings.spoiler_auth_enabled) {
      withPluginApi("1.15.0", setupSpoilerAuth);
    }
  }
}; 