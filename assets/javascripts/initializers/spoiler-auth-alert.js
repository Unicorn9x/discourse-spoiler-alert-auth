import { withPluginApi } from "discourse/lib/plugin-api";
import {
  addBlockDecorateCallback,
  addTagDecorateCallback,
} from "discourse/lib/to-markdown";
import applySpoilerAuth from "../lib/apply-spoiler-auth";
import richEditorExtension from "../lib/rich-editor-extension";
import { setup as setupMarkdown } from "../lib/discourse-markdown/spoiler-auth-alert";

function spoil(element) {
  element.querySelectorAll(".spoiler-auth").forEach((spoiler) => {
    spoiler.classList.remove("spoiler-auth");
    spoiler.classList.add("spoiled-auth");
    applySpoilerAuth(spoiler);
  });
}

export function initializeSpoilerAuth(api) {
  api.decorateCookedElement(spoil, { id: "spoiler-auth-alert" });

  api.addComposerToolbarPopupMenuOption({
    icon: "wand-magic",
    label: "spoiler_auth.title",
    action: (toolbarEvent) => {
      toolbarEvent.applySurround("[spoiler-auth]", "[/spoiler-auth]", "spoiler_auth_text", {
        multiline: false,
        useBlockMode: true,
      });
    },
  });

  addTagDecorateCallback(function () {
    const { attributes } = this.element;

    if (/\bspoiled-auth\b/.test(attributes.class)) {
      this.prefix = "[spoiler-auth]";
      this.suffix = "[/spoiler-auth]";
    }
  });

  addBlockDecorateCallback(function (text) {
    const { name, attributes } = this.element;

    if (name === "div" && /\bspoiled-auth\b/.test(attributes.class)) {
      this.prefix = "[spoiler-auth]\n";
      this.suffix = "\n[/spoiler-auth]";
      return text.trim();
    }
  });
  api.registerRichEditorExtension(richEditorExtension);
}

export default {
  name: "spoiler-auth-alert",

  initialize(container) {
    const siteSettings = container.lookup("service:site-settings");

    if (siteSettings.spoiler_auth_enabled) {
      withPluginApi("1.15.0", initializeSpoilerAuth);
      setupMarkdown(container.lookup("service:markdown-it"));
    }
  },
}; 