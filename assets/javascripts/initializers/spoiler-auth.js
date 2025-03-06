import { withPluginApi } from "discourse/lib/plugin-api";
import { i18n } from "discourse-i18n";

function setupSpoilerAuth(api) {
  // Handle cooked elements
  api.decorateCookedElement((element) => {
    try {
      if (!element) return;
      
      const spoilers = element.querySelectorAll(".spoiler");
      if (!spoilers.length) return;

      spoilers.forEach((spoiler) => {
        if (!spoiler) return;

        try {
          // Store original content before any modifications
          const originalContent = spoiler.innerHTML;
          if (!originalContent) return;

          // Add necessary classes
          spoiler.classList.remove("spoiler");
          spoiler.classList.add("spoiled");
          spoiler.classList.add("spoiler-auth");
          spoiler.classList.add("spoiler-blurred");
          
          // Handle non-logged in users
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
          const clickHandler = (event) => {
            if (api.getCurrentUser()) {
              event.preventDefault();
              event.stopPropagation();
              spoiler.classList.remove("spoiler-blurred");
              spoiler.innerHTML = originalContent;
              spoiler.removeEventListener("click", clickHandler);
            }
          };
          
          spoiler.addEventListener("click", clickHandler);
        } catch (e) {
          console.error("Error processing spoiler element:", e);
        }
      });
    } catch (e) {
      console.error("Error in spoiler-auth setup:", e);
    }
  }, { id: "spoiler-auth" });

  // Handle topic view
  api.decorateTopicView((topicView) => {
    try {
      if (!topicView) return;
      
      // Ensure spoilers are properly initialized in the topic view
      const posts = topicView.posts;
      if (!posts || !posts.length) return;

      posts.forEach((post) => {
        if (!post || !post.element) return;
        
        try {
          const spoilers = post.element.querySelectorAll(".spoiler");
          if (!spoilers.length) return;

          spoilers.forEach((spoiler) => {
            if (!spoiler) return;
            
            const originalContent = spoiler.innerHTML;
            if (!originalContent) return;

            spoiler.classList.remove("spoiler");
            spoiler.classList.add("spoiled");
            spoiler.classList.add("spoiler-auth");
            spoiler.classList.add("spoiler-blurred");

            if (!api.getCurrentUser()) {
              spoiler.innerHTML = `
                <div class="spoiler-auth-prompt">
                  <a href="/login" class="btn btn-primary">
                    ${i18n("spoiler_auth.login_to_reveal")}
                  </a>
                </div>
              `;
            }
          });
        } catch (e) {
          console.error("Error processing post spoilers:", e);
        }
      });
    } catch (e) {
      console.error("Error in topic view decoration:", e);
    }
  });
}

export default {
  name: "spoiler-auth",
  
  initialize(container) {
    try {
      const siteSettings = container.lookup("service:site-settings");
      
      if (siteSettings.spoiler_auth_enabled) {
        withPluginApi("1.15.0", setupSpoilerAuth);
      }
    } catch (e) {
      console.error("Error initializing spoiler-auth:", e);
    }
  }
}; 