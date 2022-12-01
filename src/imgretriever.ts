import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: "org-bqPest2ZqUfwOKNcExlNcCct",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.listEngines();

export class ImgRetriever{
    API_key:string


}