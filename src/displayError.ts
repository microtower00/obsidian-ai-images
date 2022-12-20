import { Notice } from "obsidian";

export function displayNotice(error: Error | string): void {
    new Notice(error.toString());
    console.error(`AI Images: error: ${error}`);
}