import AiImages from "main";
import { Configuration, OpenAIApi } from "openai";

export default class ImgRetriever{
    plugin:AiImages
    openai:OpenAIApi

    constructor(plugin:AiImages){
        this.plugin=plugin
        this.openai = new OpenAIApi(new Configuration({apiKey: this.plugin.settings.API_key}));
    }

    async generate(prompt:string, params: any = this.plugin.settings){
        try{
            const response = await this.openai.createImage({
                prompt: prompt,
                n: 1,
                size: this.plugin.settings.img_sz
            });

            return response.data.data[0].url;

        } catch(error){
            if(error.response){
                console.log(error.response.status);
                console.log(error.response.data);
            } else {
                console.log(error.message);
            }
        }
    }

    async download(prompt:string, params: any = this.plugin.settings, filepath:string){
        const img_url = this.generate(prompt,params)
        
    }

}