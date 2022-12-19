import type { App } from "obsidian";
import { normalizePath } from "obsidian";

export async function saveFile(
  app: App,
  outputPath: string,
  data: ArrayBuffer
) {
  try {
    const finalPath = normalizePath(outputPath)
    const created = await app.vault.createBinary(finalPath, data);
    return created;
  } catch (error) {
    if (!error.message.contains("File already exists")) {
      throw error;
    }
  }
}