# discourse-spoiler-alert-auth

https://meta.discourse.org/t/discourse-spoiler-alert-auth/12650/

Spoiler plugin for [Discourse](http://discourse.org) that requires users to be logged in to reveal content. Highly inspired by the [spoiler-alert](http://joshbuddy.github.io/spoiler-alert/) jQuery plugin.

## Usage

In your posts, surround text or images with `[spoiler-auth]` ... `[/spoiler-auth]`.
For example:

```
I watched the murder mystery on TV last night. [spoiler-auth]The butler did it[/spoiler-auth].
```

## Installation

- Add the plugin's repo url to your container's `app.yml` file

```yml
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - mkdir -p plugins
          - git clone https://github.com/discourse/docker_manager.git
          - git clone https://github.com/discourse/discourse-spoiler-alert-auth.git
```

- Rebuild the container

```
cd /var/discourse
./launcher rebuild app
```

## License

MIT 