import { App, PluginSettingTab, Setting } from "obsidian";
import AiImages from "main";
import { CreateImageRequestSizeEnum } from "openai";

export default class AiImagesSettingsTab extends PluginSettingTab {
	plugin: AiImages;

	constructor(app: App, plugin: AiImages) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'DALLE Generation Settings'});

		new Setting(containerEl)
			.setName('OpenAI API key')
			.setDesc('If you dont\'t have one get it at https://beta.openai.com/account/api-keys')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.API_key)
				.onChange(async (value) => {
					// console.log('Secret: ' + value);
					this.plugin.settings.API_key = value;
					await this.plugin.saveSettings();
				}));

		// Image size setting
		// da fare meglio, usando .addOptions e una lista ma ero pigro e volevo buttare su features
		new Setting(containerEl)
			.setName('Generated image size')
			.setDesc('Size of the image generated using DALLE-2')
			// Sistema sta merda bro
			.addDropdown(DropdownComponent => DropdownComponent
				.addOption("1024x1024","1024x1024")
				.addOption("512x512","512x512")
				.addOption("256x256","256x256")
				.setValue(this.plugin.settings.img_sz)
				.onChange(async(value)=>{
					console.log("AI Images: image generation size changed to "+value);
					this.plugin.settings.img_sz=value as CreateImageRequestSizeEnum;
					await this.plugin.saveSettings();
				}))
				
	}
}