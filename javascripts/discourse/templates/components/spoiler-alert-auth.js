import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "spoiler-alert-auth",
  initialize() {
    withPluginApi("0.8.31", api => {
      api.modifyClass("component:spoiler-alert", {
        pluginId: "spoiler-alert-auth",

        click(event) {
          if (!this.currentUser) {
            // If user is not logged in, show a message and prevent revealing
            event.preventDefault();
            this.dialog.alert(I18n.t("spoiler_alert_auth.login_required"));
            return;
          }
          // If user is logged in, proceed with normal spoiler reveal
          this._super(event);
        }
      });
    });
  }
}; 