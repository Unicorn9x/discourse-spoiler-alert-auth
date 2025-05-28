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

function createLoginMessage() {
  const message = document.createElement('a');
  message.className = 'spoiler-auth-login-message';
  message.href = '/login';
  message.textContent = '🔒 Login to reveal';
  message.style.cssText = `
    position: fixed;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9em;
    text-decoration: none;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 9999;
  `;
  document.body.appendChild(message);

  // Add hover events to keep message visible when hovering over it
  message.addEventListener('mouseenter', () => {
    message.style.opacity = '1';
  });
  message.addEventListener('mouseleave', () => {
    message.style.opacity = '0';
  });

  return message;
}

function updateMessagePosition(message, element) {
  const rect = element.getBoundingClientRect();
  message.style.top = `${rect.top + rect.height / 2}px`;
  message.style.left = `${rect.left + rect.width / 2}px`;
  message.style.transform = 'translate(-50%, -50%)';
}

function _setSpoilerAuthHidden(element) {
  const currentUser = window.Discourse.__container__.lookup("service:current-user");
  
  if (!currentUser) {
    // For non-logged-in users: blur and show login message
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

    // Create login message
    const loginMessage = createLoginMessage();
    element.dataset.loginMessageId = loginMessage.className;

    // Add hover event listeners
    element.addEventListener('mouseenter', () => {
      updateMessagePosition(loginMessage, element);
      loginMessage.style.opacity = '1';
    });
    element.addEventListener('mouseleave', () => {
      loginMessage.style.opacity = '0';
    });

    // Set aria-hidden for all children of the spoiler
    Array.from(element.children).forEach((e) => {
      e.setAttribute("aria-hidden", true);
    });
  } else {
    // For logged-in users: show content immediately
    _setSpoilerAuthVisible(element);
  }
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

  // Remove login message
  const loginMessage = document.querySelector(`.${element.dataset.loginMessageId}`);
  if (loginMessage) {
    loginMessage.remove();
  }
  delete element.dataset.loginMessageId;

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
      // If not logged in, just prevent revealing
      event.preventDefault();
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