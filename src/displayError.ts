import { Notice } from "obsidian";

export function displayError(error: Error | string): void {
    new Notice(error.toString());
    console.error(`AI Images: error: ${error}`);
}