# Obsidian AI Images
This plugin aims to seamlessly integrate the generation of AI images inside of your Obsidian interface.

---
## Installation
At the moment, the plugin is still not published on the obsidian plugin markateplace, so you are going to need to install it yourself.
Inside your vault, create a folder ```.obsidian/plugins/obsidian-ai-images```. Paste the release files inside the folder and you are good to go!

## Configuration
To use this plugin you need OpenAI API keys. You can generate them [here](https://beta.openai.com/account/api-keys) if you don't already have them.
Insert your API key in the plugin settings and you will be ready to generate images.

## Features
While typing in editor mode, select some text you wish to use as a prompt for the generation of an image. You can then use the provided command by pressing ``` Ctrl+Shift+G``` or alternatively ```Cmd+Shift+G```. Also works by pressing ```Ctrl/Cmd+P``` and searching for 'Generate an image from your text selection'.

The image will be downloaded and linked in the editor.

## Development
This plugin was developed as a personal project and was made for fun. I will upgrading as time and creativity allow me. In the meantime if you have any suggestion, hit me up, open issues, or contribute to the project.

## Disclaimer
This plugin requires an active internet connection to work.
The API key inserted in the plugn settings NEVER leaves your machine and is stored inside of the ```data.json``` file in the plugin subfolder.

---
This plugin works by requesting image generations to the [DALL-E APIs](https://beta.openai.com/docs/introduction)
