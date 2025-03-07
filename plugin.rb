# name: spoiler-alert-auth
# about: Extends Discourse Spoiler-Alert to only allow logged-in users to reveal spoilers
# version: 1.9.2
# authors: Unicorn9x

enabled_site_setting :spoiler_auth_enabled

register_asset "stylesheets/spoiler_auth.scss"

after_initialize do
  module ::DiscourseSpoilerAuth
    class Engine < ::Rails::Engine
      engine_name "discourse_spoiler_auth"
      isolate_namespace DiscourseSpoilerAuth
    end
  end

  on(:before_post_process_cooked) do |doc, state|
    return if !SiteSetting.spoiler_auth_enabled

    doc.css(".spoiler").each do |el|
      # Store original content and add classes
      original_content = el.inner_html.strip
      el["data-spoiler-content"] = original_content
      el["class"] = "#{el["class"]} spoiler-auth spoiler-blurred".strip

      # For non-logged-in users, replace content with placeholder
      unless state&.user
        el["data-requires-auth"] = "true"
        el["data-tooltip"] = I18n.t("login_required")
        el["data-tooltip-class"] = "spoiler-auth-tooltip"
        el["data-tooltip-position"] = "top"
        el["data-tooltip-delay"] = "100"
        el["data-tooltip-html"] = "true"
        
        # Replace content with placeholder for non-logged-in users
        el.inner_html = <<~HTML
          <div class="spoiler-content-placeholder">#{I18n.t("spoiler_hidden")}</div>
        HTML
      end
    end
  end

  # Process spoilers in posts
  on(:post_process_cooked) do |doc|
    return if !SiteSetting.spoiler_auth_enabled

    doc.css(".spoiler").each do |el|
      el.add_class("spoiler-auth")
      el.add_class("spoiler-blurred")
    end
  end

  # Handle topic excerpts
  on(:reduce_excerpt) do |doc|
    doc.css(".spoiler").each do |el|
      el.inner_html = I18n.t("spoiler_hidden")
    end if doc
  end

  # Add site setting
  Site.preloaded_category_custom_fields << "spoiler_auth_enabled" if Site.respond_to? :preloaded_category_custom_fields
end 