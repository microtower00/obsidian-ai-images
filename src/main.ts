import ImgRetriever from 'imgretriever';
import AiImagesSettingsTab from 'settings'
import { Editor, Plugin } from 'obsidian';
import { CreateImageRequestSizeEnum } from "openai";
import { saveFile } from 'saveFile';
import { displayError} from 'displayError'

interface AiImagesSettings {
	API_key: string;
	img_sz: CreateImageRequestSizeEnum;
	keep_prompt:boolean;
	attachments_path: string;
}

const DEFAULT_SETTINGS: AiImagesSettings = {
	API_key: '',
	img_sz: '512x512',
	keep_prompt: false,
	attachments_path: ""
}

export default class AiImages extends Plugin {
	settings: AiImagesSettings;
	retriever:ImgRetriever;

	async onload() {
		await this.loadSettings();
		console.log("AI Images: settings loaded")
		this.retriever = new ImgRetriever(this)

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'generate-img-from-selection',
			name: 'Generate an image from your text selection',
			hotkeys: [
				{
					modifiers: ['Mod', 'Shift'],
					key: 'G',
				},
			],
			editorCheckCallback: (checking: boolean, editor:Editor) => {
				//Check that you are in an editor and that you have text selected.

				if (editor.somethingSelected()) {
					const prompt = editor.getSelection()
					if (!checking) {
						this.generateImage(prompt,editor)
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
	async generateImage(prompt:string, editor:Editor){
		console.log('Generating image...')
		try{
			let res = await this.retriever.generate(prompt)
			let imgUrl=res
			const file = this.app.workspace.getActiveFile();

			if(file){
				const imgPath:string = this.settings.attachments_path+"/"+(Date.now() as string)+".png"
				this.retriever.downloadImage(imgUrl).then((bytes:any)=>{
					saveFile(this.app,imgPath,bytes)
				})
				const imgObsidianUrl = "![|"+this.settings.img_sz.substring(0,3)+"]("+imgPath+")";
				if(!this.settings.keep_prompt)
					editor.replaceSelection(imgObsidianUrl)
				else
					editor.replaceSelection(prompt+"\n"+imgObsidianUrl)
			}
		}catch(e){
			displayError(e)
		}
	}
}