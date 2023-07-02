import path from "path";
import { v4 as uuid } from "uuid";
import fsPromises from "fs/promises";
import { UploadedFile } from "express-fileupload";
import fs from "fs";

// Model
import { ResourceNotFoundError } from "../2-models/client-errors";
import appConfig from "./app-config";


// __dirname returns current file (image-handler.ts) directory
const assetsFolder = path.join(__dirname, "..", "1-assets", "files");

// ================================ Get specific folder path in disk:================================
function getFolderPath(folder: string): string {
  return path.join(assetsFolder, folder);
}

// ================================ Get file path ================================
async function getFilePath(folder: string, fileName: string) {
  return path.join(getFolderPath(folder), fileName);
}

// ================================ Get all file paths ================================
async function getAllFilePaths(folder: string): Promise<string[]> {
  // Get folder path
  const folderPath = getFolderPath(folder);

  // Validate folder exists
  if (!fs.existsSync(folderPath)) {
    throw new ResourceNotFoundError(`${folderPath} is not found`);
  }

  // Get files from folder
  const files = await fsPromises.readdir(folderPath);

  // Build file paths
  const filePaths = files.map((file) => {
    return path.join(folder, file);
  });

  return filePaths;
}

// ================================ Save files to disk and return file names: ================================
async function saveFiles(
  files: UploadedFile[],
  folder: string
): Promise<{filesUrl:string[], filesFolder:string}> {
  const fileNames: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Create unique name:
    // const uniqueName = uuid() + file.name+ path.extname(file.name);
    const uniqueName = uuid() + "|"+ file.name
    fileNames.push(uniqueName);

    // Get absolute folder path:
    const folderPath = getFolderPath(folder);
    const absolutePath = path.join(folderPath, uniqueName);

    // Create folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Move file to folder
    await file.mv(absolutePath);

    if (!files.length) break;
  }

    // Filter out files that don't have valid image extensions
    const filesUrl = fileNames
    // Add full URL to image name
    .map((f) => {
      return appConfig.getFileUrl(folder) + "/" + f.toString();
    });
  // Build an files object
  const filesObj = {
    filesFolder: folder,
    filesUrl: filesUrl,
  };

  return filesObj;
}

// ================================ Delete files from disk: ================================
async function deleteFiles(fileNames: string[], folder: string): Promise<void> {
  try {
    // If no files sent:
    if (!fileNames || fileNames.length === 0)
      throw new ResourceNotFoundError("No files specified for deletion");

    // Delete files:
    for (let i = 0; i < fileNames.length; i++) {
      const fileName = fileNames[i];
      const filePath = await getFilePath(folder, fileName);
      await fsPromises.unlink(filePath);
    }
  } catch (err: any) {
    console.error(err.message);
  }
}

// ================================ Delete folder from disk: ================================
async function deleteFolder(folder: string): Promise<void> {
  try {
    // Get folder path:
    const folderPath = getFolderPath(folder);

    // Delete folder and its contents:
    await fsPromises.rm(folderPath, { recursive: true });
  } catch (err: any) {
    console.error(err.message);
  }
}

export default {
  getFolderPath,
  getFilePath,
  getAllFilePaths,
  saveFiles,
  deleteFiles,
  deleteFolder,
};
