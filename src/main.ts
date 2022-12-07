import ImgRetriever from 'imgretriever';
import AiImagesSettingsTab from 'settings'
import { Editor, Plugin } from 'obsidian';
import { CreateImageRequestSizeEnum } from "openai";
import { saveFile } from 'saveFile';

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

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'generate-img-from-selection',
			name: 'Generate an image from your text selection',
			editorCheckCallback: (checking: boolean, editor:Editor) => {
				//Check that you are in an editor and that you have text selected.

				if (editor.somethingSelected()) {
					const prompt = editor.getSelection()
					if (!checking) {
						let img_url:string
						img_url= "https://oaidalleapiprodscus.blob.core.windows.net/private/org-IxOR6hSxs1Uwrn4FY65FBTCP/user-83eYatBh1On06MEY3KFQQIKO/img-qlbVoG17hjEOWqrDb5SAzSOz.png?st=2022-12-07T16%3A07%3A12Z&se=2022-12-07T18%3A07%3A12Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-12-07T17%3A05%3A49Z&ske=2022-12-08T17%3A05%3A49Z&sks=b&skv=2021-08-06&sig=mRnUBbWw4QpWTFFjb6nuEHRHcuPwQoT1EI8mUJDc%2Blo%3D"
							
						this.retriever.generate(prompt).then((ret)=>{
							img_url=ret as string
							const file = this.app.workspace.getActiveFile();
							if(file){
								const imgPath:string = (Date.now() as string)+".png"

								this.retriever.downloadImage(img_url).then((ret)=>{
									console.log("tutto bene")
									saveFile(this.app,imgPath,ret)
								})
								editor.replaceSelection("![|"+this.settings.img_sz.substring(0,3)+"]("+imgPath+")")
							}
							
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
// class GenerationModal extends Modal {
// 	input:HTMLElement

// 	constructor(app: App) {
// 		super(app);
// 	}

// 	onOpen() {
// 		const {contentEl} = this;
// 		contentEl.setText('Insert the prompt to generate an image');
// 		const input = contentEl.createEl('input',{attr: {["type"]:"text",["id"]:"generation-modal-text-input"}})
// 		const confirm = contentEl.createEl('input',{attr: {	["type"]:"button",
// 															["id"]:"generation-modal-confirm",
// 															['value']:'Generate'}})

// 		confirm?.addEventListener('click', function readInputText(){
// 			console.log('Button pressed')
// 		})
// 	}

// 	onClose() {
// 		const {contentEl} = this;
// 		contentEl.empty();
// 	}
// }