import type { App } from "obsidian";

export async function saveFile(
  app: App,
  outputPath: string,
  data: ArrayBuffer
) {
  try {
    const created = await app.vault.createBinary(outputPath, data);
    return created;
  } catch (error) {
    if (!error.message.contains("File already exists")) {
      throw error;
    }
  }
}