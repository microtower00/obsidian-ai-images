import { App, PluginSettingTab, Setting, TextAreaComponent, ToggleComponent } from "obsidian";
import AiImages from "main";
import { CreateImageRequestSizeEnum } from "openai";

export default class AiImagesSettingsTab extends PluginSettingTab {
	plugin: AiImages;

	constructor(app: App, plugin: AiImages) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		console.log('Showing settings tab')
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
				}));
		
				new Setting(containerEl)
					.setName('Keep prompt after generation')
					.setDesc('Select this if you want the generation prompt to be kept in the editor after the generation, otherwise it will disappear')
					.addToggle(ToggleComponent => ToggleComponent
						.setValue(this.plugin.settings.keep_prompt)
						.onChange(async(value)=>{
							console.log("AI Images: keep prompt in editor after generation changed to "+value);
							this.plugin.settings.keep_prompt=value
							await this.plugin.saveSettings();
						}))
				
				new Setting(containerEl)
					.setName('Generated image folder')
					.setDesc('If you wish to store the genereated images in a subfolder you can select it here.')
					.addTextArea(TextAreaComponent => TextAreaComponent
						.setValue(this.plugin.settings.attachments_path)
						.onChange(async(value)=>{
							console.log("AI Images: attachments folder changed to "+value);
							this.plugin.settings.attachments_path=value
							await this.plugin.saveSettings();
						}))
						
				
	}
}