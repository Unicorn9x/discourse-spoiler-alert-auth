# name: spoiler-alert-auth
# about: Extends Discourse Spoiler-Alert to only allow logged-in users to reveal spoilers
# version: 1.0.0
# authors: Your Name

enabled_site_setting :spoiler_auth_enabled

register_asset "stylesheets/spoiler_auth.scss"

after_initialize do
  on(:reduce_cooked) do |fragment, post|
    begin
      return if fragment.nil? || post.nil?
      
      fragment
        .css(".spoiler")
        .each do |el|
          next if el.nil? || el.inner_html.blank?
          
          begin
            link = fragment.document.create_element("a")
            link["href"] = post.url
            link.content = I18n.t("spoiler_auth.excerpt_spoiler")
            el.inner_html = link.to_html
          rescue => e
            Rails.logger.error("Spoiler Auth Plugin Error (reduce_cooked element): #{e.message}")
            next
          end
        end
    rescue => e
      Rails.logger.error("Spoiler Auth Plugin Error (reduce_cooked): #{e.message}\n#{e.backtrace.join("\n")}")
    end
  end

  # Remove spoilers from topic excerpts
  on(:reduce_excerpt) do |doc, post|
    begin
      return if doc.nil? || post.nil?
      doc.css(".spoiler").remove
    rescue => e
      Rails.logger.error("Spoiler Auth Plugin Error (reduce_excerpt): #{e.message}\n#{e.backtrace.join("\n")}")
    end
  end

  # Handle post cooking
  on(:post_process_cooked) do |doc, post|
    begin
      return if doc.nil? || post.nil?
      
      doc.css(".spoiler").each do |el|
        next if el.nil? || el.inner_html.blank?
        
        begin
          el.add_class("spoiler-auth")
          el.add_class("spoiler-blurred")
        rescue => e
          Rails.logger.error("Spoiler Auth Plugin Error (post_process_cooked): #{e.message}")
          next
        end
      end
    rescue => e
      Rails.logger.error("Spoiler Auth Plugin Error (post_process_cooked): #{e.message}\n#{e.backtrace.join("\n")}")
    end
  end
end 