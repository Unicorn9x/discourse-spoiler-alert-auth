const CONTAINS_BLOCK_REGEX = /\n|<img|!\[[^\]]*\][(\[]/;

function insertSpoilerAuth(_, spoiler) {
  const element = CONTAINS_BLOCK_REGEX.test(spoiler) ? "div" : "span";
  return `<${element} class='spoiler-auth'>${spoiler}</${element}>`;
}

function replaceSpoilerAuths(text) {
  text ||= "";
  let previousText;

  do {
    previousText = text;
    text = text.replace(
      /\[spoiler-auth\]((?:(?!\[spoiler-auth\]|\[\/spoiler-auth\])[\S\s])*)\[\/spoiler-auth\]/gi,
      insertSpoilerAuth
    );
  } while (text !== previousText);

  return text;
}

function setupMarkdownIt(helper) {
  helper.registerOptions((opts, siteSettings) => {
    opts.features["spoiler-auth-alert"] = !!siteSettings.spoiler_auth_enabled;
  });

  helper.registerPlugin((md) => {
    md.inline.bbcode.ruler.push("spoiler-auth", {
      tag: "spoiler-auth",
      wrap: "span.spoiler-auth",
    });

    md.block.bbcode.ruler.push("spoiler-auth", {
      tag: "spoiler-auth",
      wrap: "div.spoiler-auth",
    });
  });
}

export function setup(helper) {
  helper.allowList(["span.spoiler-auth", "div.spoiler-auth"]);

  if (helper.markdownIt) {
    setupMarkdownIt(helper);
  } else {
    helper.addPreProcessor(replaceSpoilerAuths);
  }
} 