import { withPluginApi } from "discourse/lib/plugin-api";
import { setup } from "../lib/discourse-markdown/spoiler-auth-alert";

function initializeSpoilerAuth(api) {
  const siteSettings = api.container.lookup("service:site-settings");
  if (!siteSettings.spoiler_auth_enabled) return;

  const helper = api.container.lookup("service:markdown-it");
  if (helper) {
    setup(api);
  }

  api.decorateCookedElement((elem) => {
    elem.querySelectorAll(".spoiler-auth").forEach((el) => {
      el.classList.add("spoiler-auth-blurred");
      el.addEventListener("click", (e) => {
        if (e.target === el) {
          el.classList.remove("spoiler-auth-blurred");
        }
      });
    });
  }, { id: "spoiler-auth" });

  api.addComposerToolbarPopupMenuOption({
    action: "insertSpoilerAuth",
    icon: "eye-slash",
    label: "spoiler_auth_alert.insert_spoiler",
  });

  api.modifyClass("component:composer-editor", {
    pluginId: "spoiler-auth",
    actions: {
      insertSpoilerAuth() {
        this.getSelectedText().then((text) => {
          const selected = text || I18n.t("spoiler_auth_alert.spoiler_text");
          this.replaceSelection(`[spoiler-auth]${selected}[/spoiler-auth]`);
        });
      },
    },
  });
}

export default {
  name: "spoiler-auth-alert",
  initialize() {
    withPluginApi("0.8.31", initializeSpoilerAuth);
  },
}; 