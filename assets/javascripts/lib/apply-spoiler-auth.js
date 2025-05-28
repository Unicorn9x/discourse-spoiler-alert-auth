import { i18n } from "discourse-i18n";

const INTERACTIVE_SELECTOR = [
  "a",
  "area",
  "audio",
  "button",
  "details",
  "embed",
  "iframe",
  "img.animated",
  "input",
  "map",
  "object",
  "option",
  "portal",
  "select",
  "textarea",
  "track",
  "video",
  ".lightbox",
].join(", ");

function isInteractive(event) {
  return event.defaultPrevented || event.target.closest(INTERACTIVE_SELECTOR);
}

function noTextSelected() {
  return window.getSelection() + "" === "";
}

function setAttributes(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === null) {
      element.removeAttribute(key);
    } else {
      element.setAttribute(key, value);
    }
  });
}

function _setSpoilerAuthHidden(element) {
  const spoilerHiddenAttributes = {
    role: "button",
    tabindex: "0",
    "data-spoiler-auth-state": "blurred",
    "aria-expanded": false,
    "aria-label": i18n("spoiler_auth_alert.label.show"),
    "aria-live": "polite",
  };

  // Set default attributes & classes on spoiler
  setAttributes(element, spoilerHiddenAttributes);
  element.classList.add("spoiler-auth-blurred");

  // Set aria-hidden for all children of the spoiler
  Array.from(element.children).forEach((e) => {
    e.setAttribute("aria-hidden", true);
  });
}

function _setSpoilerAuthVisible(element) {
  const spoilerVisibleAttributes = {
    "data-spoiler-auth-state": "revealed",
    "aria-expanded": true,
    "aria-label": null,
    role: null,
  };

  // Set attributes & classes for when spoiler is visible
  setAttributes(element, spoilerVisibleAttributes);
  element.classList.remove("spoiler-auth-blurred");

  // Remove aria-hidden for all children of the spoiler when visible
  Array.from(element.children).forEach((e) => {
    e.removeAttribute("aria-hidden");
  });
}

function toggleSpoilerAuth(event, element) {
  if (element.getAttribute("data-spoiler-auth-state") === "blurred") {
    // Check if user is logged in
    const currentUser = window.Discourse.__container__.lookup("service:current-user");
    if (!currentUser) {
      // If not logged in, show login modal
      const modal = window.Discourse.__container__.lookup("service:modal");
      modal.showModal("login", {
        title: "login.title",
        model: {
          canSignUp: true,
          showLoginButtons: true
        }
      });
      return;
    }
    _setSpoilerAuthVisible(element);
    event.preventDefault();
  } else if (!isInteractive(event) && noTextSelected()) {
    _setSpoilerAuthHidden(element);
  }
}

export default function applySpoilerAuth(element) {
  _setSpoilerAuthHidden(element);

  element.addEventListener("click", (event) => {
    toggleSpoilerAuth(event, element);
  });

  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      toggleSpoilerAuth(event, element);
    }
  });
} 