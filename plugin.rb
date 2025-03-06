# name: spoiler-alert-auth
# about: Extends Discourse Spoiler-Alert to only allow logged-in users to reveal spoilers
# version: 1.0.0
# authors: Your Name

enabled_site_setting :spoiler_auth_enabled

register_asset "stylesheets/spoiler_auth.scss"

after_initialize do
  # Process spoilers in posts
  on(:post_process_cooked) do |doc, post|
    begin
      return if doc.nil? || post.nil?
      
      # Only process if the user is not logged in
      if !post.user
        doc.css(".spoiler").each do |el|
          next if el.nil? || el.inner_html.blank?
          
          begin
            # Store original content
            el["data-original-content"] = el.inner_html
            
            # Replace content with login prompt
            el.inner_html = <<~HTML
              <div class="spoiler-auth-prompt">
                <a href="/login" class="btn btn-primary">
                  #{I18n.t("spoiler_auth.login_to_reveal")}
                </a>
              </div>
            HTML
            
            # Add necessary classes
            el.add_class("spoiler-auth")
            el.add_class("spoiler-blurred")
          rescue => e
            Rails.logger.error("Spoiler Auth Plugin Error (post_process_cooked element): #{e.message}")
            next
          end
        end
      end
    rescue => e
      Rails.logger.error("Spoiler Auth Plugin Error (post_process_cooked): #{e.message}\n#{e.backtrace.join("\n")}")
    end
  end

  # Handle topic excerpts
  on(:reduce_excerpt) do |doc, post|
    begin
      return if doc.nil? || post.nil?
      doc.css(".spoiler").remove
    rescue => e
      Rails.logger.error("Spoiler Auth Plugin Error (reduce_excerpt): #{e.message}\n#{e.backtrace.join("\n")}")
    end
  end
end 