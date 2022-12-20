import ImgRetriever from 'imgretriever';
import {AiImagesSettings, AiImagesSettingsTab, DEFAULT_SETTINGS }from 'settings'
import { Editor, Plugin } from 'obsidian';
import { saveFile } from 'saveFile';
import { displayNotice} from 'displayError'

export default class AiImages extends Plugin {
	settings: AiImagesSettings;
	retriever:ImgRetriever;

	async onload() {
		await this.loadSettings();
		console.log("AI Images: settings loaded")
		this.retriever = new ImgRetriever(this)

		// Command to get a prompt from the editor and generate an image with dall-e
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

		// This adds a settings tab
		this.addSettingTab(new AiImagesSettingsTab(this.app, this));

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		console.log("AI Images: unloaded")
	}

	//Functions to load and save settings
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	//Utility function to get the image, save it and paste a link to it in the Editor
	async generateImage(prompt:string, editor:Editor){
		console.log('Generating image...')
		displayNotice("Retrieving image...")

		try{
			let res = await this.retriever.generate(prompt)
			let imgUrl=res
			const file = this.app.workspace.getActiveFile();

			if(file){
				const imgPath:string = this.settings.attachments_path+"/"+(Date.now() as unknown as string)+".png"
				this.retriever.downloadImage(imgUrl).then((bytes:any)=>{
					saveFile(this.app,imgPath,bytes)
					displayNotice("Image saved!")
				})
				const imgObsidianUrl = "![|"+this.settings.img_sz.substring(0,3)+"]("+imgPath+")";
				if(!this.settings.keep_prompt)
					editor.replaceSelection(imgObsidianUrl)
				else
					editor.replaceSelection(prompt+"\n"+imgObsidianUrl)
			}
		}catch(e){
			displayNotice(e)
		}
	}
}