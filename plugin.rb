# name: spoiler-alert-auth
# about: Extends Discourse Spoiler-Alert to only allow logged-in users to reveal spoilers
# version: 1.0.0
# authors: Your Name

enabled_site_setting :spoiler_auth_enabled

register_asset "stylesheets/spoiler_auth.scss"

after_initialize do
  # Register our custom markdown processor
  register_html_builder('post') do |context|
    begin
      next if context.nil? || context.post.nil?
      
      # Only process if the user is not logged in
      if !context.user
        context.post.cooked = context.post.cooked.gsub(
          /<div class="spoiler">(.*?)<\/div>/m,
          '<div class="spoiler spoiler-auth spoiler-blurred"><div class="spoiler-auth-prompt"><a href="/login" class="btn btn-primary">' + I18n.t("spoiler_auth.login_to_reveal") + '</a></div></div>'
        )
      end
    rescue => e
      Rails.logger.error("Spoiler Auth Plugin Error (html_builder): #{e.message}\n#{e.backtrace.join("\n")}")
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