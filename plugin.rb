# name: spoiler-alert-auth
# about: Extends Discourse Spoiler-Alert to only allow logged-in users to reveal hidden text
# version: 1.0.0
# authors: Your Name

enabled_site_setting :spoiler_alert_auth_enabled

register_asset "javascripts/discourse/templates/components/spoiler-alert-auth.js"
register_asset "stylesheets/spoiler-alert-auth.scss"

after_initialize do
  # Add any initialization code here if needed
end 