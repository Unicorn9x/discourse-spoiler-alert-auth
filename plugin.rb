# name: spoiler-alert-auth
# about: Extends Discourse Spoiler-Alert to only allow logged-in users to reveal hidden text
# version: 1.0.0
# authors: Unicorn9x

enabled_site_setting :spoiler_auth_enabled

register_asset "stylesheets/spoiler_auth.scss"

after_initialize do
  on(:reduce_cooked) do |fragment, post|
    fragment
      .css(".spoiler")
      .each do |el|
        link = fragment.document.create_element("a")
        link["href"] = post.url
        link.content = I18n.t("spoiler_auth.excerpt_spoiler")
        el.inner_html = link.to_html
      end
  end

  # Remove spoilers from topic excerpts
  on(:reduce_excerpt) { |doc, post| doc.css(".spoiler").remove }
end
