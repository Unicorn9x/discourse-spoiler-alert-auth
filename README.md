# Discourse Spoiler Auth Plugin

This plugin extends Discourse's built-in Spoiler-Alert functionality to only allow logged-in users to reveal spoiler content.

## Features

- Requires users to be logged in to reveal spoiler content
- Shows a login prompt for non-logged-in users
- Maintains the original spoiler functionality for logged-in users
- Works with both inline and block spoilers
- Properly handles topic excerpts

## Installation

1. Add the plugin's repo url to your container's `app.yml` file:

```yaml
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - git clone https://github.com/your-username/discourse-spoiler-alert-auth.git
```

2. Rebuild the container:

```bash
cd /var/discourse
./launcher rebuild app
```

3. Enable the plugin in your admin settings (Admin > Settings > Plugins > Spoiler Auth)

## Usage

Use the spoiler syntax as normal:

```
[spoiler]This is hidden content[/spoiler]
```

- Logged-in users will see the blurred content and can click to reveal it
- Non-logged-in users will see a login prompt instead of the spoiler content

## License

MIT 