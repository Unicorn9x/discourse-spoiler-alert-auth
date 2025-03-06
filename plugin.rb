# name: spoiler-alert-auth
# about: Extends Discourse Spoiler-Alert to only allow logged-in users to reveal spoilers
# version: 1.6.0
# authors: Unicorn9x

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
            original_content = el.inner_html
            el.inner_html = ""
            
            # Create login prompt
            prompt = doc.create_element("div")
            prompt["class"] = "spoiler-auth-prompt"
            
            link = doc.create_element("a")
            link["href"] = "/login"
            link["class"] = "btn btn-primary"
            link.content = I18n.t("spoiler_auth.login_to_reveal")
            
            prompt.add_child(link)
            el.add_child(prompt)
            
            # Add necessary classes
            el["class"] = "spoiler spoiler-auth spoiler-blurred"
            el["data-original-content"] = original_content
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
