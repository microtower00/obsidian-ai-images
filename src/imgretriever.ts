import AiImages from "main";
import { Configuration, OpenAIApi } from "openai";
import got from "got";

export default class ImgRetriever{
    plugin:AiImages
    openai:OpenAIApi

    constructor(plugin:AiImages){
        this.plugin=plugin
        this.openai = new OpenAIApi(new Configuration({apiKey: this.plugin.settings.API_key}));
    }

    async generate(prompt:string, params: any = this.plugin.settings){
        const response = await this.openai.createImage({
            prompt: prompt,
            n: 1,
            size: this.plugin.settings.img_sz
        });

        if(!response.data.data[0].url){
            throw(response.data.data[0])
        }else{
            return response.data.data[0].url;
        }
    }
    
    async downloadImage(url: string): Promise<ArrayBuffer> {
        const res = await got(url, { responseType: "buffer" });
        return res.body;
    }

}