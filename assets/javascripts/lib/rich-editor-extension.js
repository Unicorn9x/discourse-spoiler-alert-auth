const SPOILER_AUTH_NODES = ["inline_spoiler_auth", "spoiler_auth"];

/** @type {RichEditorExtension} */
const extension = {
  nodeSpec: {
    spoiler_auth: {
      attrs: { blurred: { default: true } },
      group: "block",
      content: "block+",
      parseDOM: [{ tag: "div.spoiled-auth" }],
      toDOM: () => ["div", { class: "spoiled-auth" }, 0],
    },
    inline_spoiler_auth: {
      attrs: { blurred: { default: true } },
      group: "inline",
      inline: true,
      content: "inline*",
      parseDOM: [{ tag: "span.spoiled-auth" }],
      toDOM: () => ["span", { class: "spoiled-auth" }, 0],
    },
  },
  parse: {
    bbcode_spoiler_auth: { block: "inline_spoiler_auth" },
    wrap_bbcode(state, token) {
      if (token.nesting === 1 && token.attrGet("class") === "spoiler-auth") {
        state.openNode(state.schema.nodes.spoiler_auth);
        return true;
      } else if (token.nesting === -1 && state.top().type.name === "spoiler_auth") {
        state.closeNode();
        return true;
      }
    },
  },
  serializeNode: {
    spoiler_auth(state, node) {
      state.write("[spoiler-auth]\n");
      state.renderContent(node);
      state.write("[/spoiler-auth]\n\n");
    },
    inline_spoiler_auth(state, node) {
      state.write("[spoiler-auth]");
      state.renderInline(node);
      state.write("[/spoiler-auth]");
    },
  },
  plugins({ pmState: { Plugin }, pmView: { Decoration, DecorationSet } }) {
    return new Plugin({
      props: {
        decorations(state) {
          return this.getState(state);
        },
        handleClickOn(view, pos, node, nodePos) {
          if (SPOILER_AUTH_NODES.includes(node.type.name)) {
            const decoSet = this.getState(view.state) || DecorationSet.empty;

            const isBlurred =
              decoSet.find(nodePos, nodePos + node.nodeSize).length > 0;

            const newDeco = isBlurred
              ? decoSet.remove(decoSet.find(nodePos, nodePos + node.nodeSize))
              : decoSet.add(view.state.doc, [
                  Decoration.node(nodePos, nodePos + node.nodeSize, {
                    class: "spoiler-auth-blurred",
                  }),
                ]);

            view.dispatch(view.state.tr.setMeta(this, newDeco));
            return true;
          }
        },
      },
      state: {
        init() {
          return DecorationSet.empty;
        },
        apply(tr, set) {
          return tr.getMeta(this) || set.map(tr.mapping, tr.doc);
        },
      },
    });
  },
};

export default extension; 