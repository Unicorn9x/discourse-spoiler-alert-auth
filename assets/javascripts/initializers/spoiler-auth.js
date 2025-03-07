import { withPluginApi } from "discourse/lib/plugin-api";
import { i18n } from "discourse-i18n";

function initializeSpoilerAuth(api) {
  const currentUser = api.getCurrentUser();

  api.decorateCookedElement(
    (element) => {
      element.querySelectorAll(".spoiler-auth").forEach((spoiler) => {
        if (!currentUser) {
          // For non-logged in users, show login prompt
          const prompt = document.createElement("div");
          prompt.className = "spoiler-auth-prompt";
          prompt.innerHTML = `
            <a href="/login" class="btn btn-primary">
              ${i18n.t("spoiler_auth.login_to_reveal")}
            </a>
          `;
          spoiler.appendChild(prompt);
        } else {
          // For logged-in users, allow revealing on click
          spoiler.addEventListener("click", function handler(e) {
            if (e.target.tagName !== "A") {
              e.preventDefault();
              e.stopPropagation();
              this.classList.remove("spoiler-blurred");
              this.removeEventListener("click", handler);
            }
          });
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