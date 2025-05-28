import { withPluginApi } from "discourse/lib/plugin-api";

function setupMarkdownIt(helper) {
  if (!helper) return;

  helper.registerOptions((opts) => {
    opts.features["spoiler-auth"] = true;
  });

  helper.registerPlugin((md) => {
    const spoilerAuthRule = {
      matcher: /\[spoiler-auth\]([\s\S]*?)\[\/spoiler-auth\]/,
      onMatch: (buffer, matches, state) => {
        const content = matches[1];
        const isInline = !content.includes("\n");
        const tag = isInline ? "span" : "div";
        const token = new state.Token("html_inline", "", 0);
        token.content = `<${tag} class="spoiler-auth spoiler-auth-blurred">${content}</${tag}>`;
        buffer.push(token);
        return buffer;
      },
    };

    md.block.bbcode.ruler.push("spoiler-auth", spoilerAuthRule);
    md.inline.bbcode.ruler.push("spoiler-auth", spoilerAuthRule);
  });
}

export function setup(api) {
  const helper = api.container.lookup("service:markdown-it");
  setupMarkdownIt(helper);
} 