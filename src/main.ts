import ImgRetriever from 'imgretriever';
import { App, MarkdownView, Modal, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { Configuration, OpenAIApi, CreateImageRequestSizeEnum } from "openai";

let configuration: Configuration;

let openai:OpenAIApi;


function configureAIApis(apiKey:string):void{
	configuration = new Configuration({
		apiKey: apiKey//"",
	});
	openai = new OpenAIApi(configuration);
}

interface AiImagesSettings {
	API_key: string;
	img_sz: CreateImageRequestSizeEnum;
}

const DEFAULT_SETTINGS: AiImagesSettings = {
	API_key: '',
	img_sz: '512x512'
}

export default class AiImages extends Plugin {
	settings: AiImagesSettings;
	retriever:ImgRetriever;

	async onload() {
		await this.loadSettings();
		console.log("AI Images: settings loaded")
		this.retriever = new ImgRetriever(this)
		//Command to generate make a request based on text entered on the modal.
		this.addCommand({
			id: 'generate-img-from-modal-text',
			name: 'Generate an image from text',
			callback: async() => {
				console.log("AI Images: running generate-img-from-modal-text")
			
				const image_url = this.retriever.generate("Berlin in 2025 if Germany won ww2 and conquered the world, wolfenstein style")
				console.log(image_url)
				new GenerationModal(this.app).open();
			}
		});

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'generate-img-from-last-sentence',
			name: 'Generate an image from the last sentence you typed',
			editorCheckCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);

				if (markdownView) {
					if (!checking) {
						new GenerationModal(this.app).open();
					}
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new AiImagesSettingsTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class GenerationModal extends Modal {
	input:HTMLElement

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Insert the prompt to generate an image');
		const input = contentEl.createEl('input',{attr: {["type"]:"text",["id"]:"generation-modal-text-input"}})
		const confirm = contentEl.createEl('input',{attr: {	["type"]:"button",
															["id"]:"generation-modal-confirm",
															['value']:'Generate'}})

		confirm?.addEventListener('click', function readInputText(){
			console.log('button pressed, calling generateImg with prompt: '+input.value)
			generateImg(input.value, CreateImageRequestSizeEnum._256x256)
		})
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class AiImagesSettingsTab extends PluginSettingTab {
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
					configureAIApis(value)
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

async function generateImg(promptString: string, image_sz:CreateImageRequestSizeEnum): Promise<string | undefined> {
	const response = await openai.createImage({
		prompt: promptString,
		n: 1,
		size: image_sz
	});
	const image_url = response.data.data[0].url;
	console.log(image_url)
	return image_url
}

