import ImgRetriever from 'imgretriever';
import AiImagesSettingsTab from 'settings'
import { App, Editor, MarkdownView, Modal, Plugin, PluginSettingTab, Setting } from 'obsidian';
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

		console.log('mo addo comando')
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'generate-img-from-selection',
			name: 'Generate an image from your text selection',
			editorCheckCallback: (checking: boolean, editor:Editor) => {
				//Check that you are in an editor and that you have text selected.
				const prompt = editor.getSelection()

				if (editor.somethingSelected()) {
					if (!checking) {
						let img_url:string = ""

						this.retriever.generate(prompt).then((ret)=>{
							img_url=ret as string

							console.log(img_url)
							editor.replaceSelection("![|"+this.settings.img_sz.substring(0,3)+"]("+img_url+")")
						});
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
			console.log('Button pressed')
		})
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}