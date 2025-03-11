# name: spoiler-alert-auth
# about: Extends Discourse Spoiler-Alert to only allow logged-in users to reveal spoilers
# version: 1.9.4
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
      el.add_class("spoiler-auth")
      el.add_class("spoiler-blurred")
      
      unless state&.user
        el.add_class("spoiler-auth-locked")
        el["title"] = "Login to view"
      end
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