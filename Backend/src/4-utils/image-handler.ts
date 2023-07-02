import path from "path";
import { v4 as uuid } from "uuid";
import fsPromises from "fs/promises";
import { UploadedFile } from "express-fileupload";
import appConfig from "./app-config";
import fs from "fs";
// Model
import { ResourceNotFoundError } from "../2-models/client-errors";
import ImageModel, { IImageModel } from "../2-models/image-model";



// __dirname returns current file (image-handler.ts) directory
const assetsImages = path.join(__dirname, "..", "1-assets", "images");

// ================================ Get specific images folder path in disk:================================
function getFolderPath(imageFolder: string): string {
  return assetsImages + "/" + imageFolder + "/";
}

// ================================ Get image full path ================================
async function getImagePath(imageFolder: string, imageName: string) {
  return getFolderPath(imageFolder) + "/" + imageName;
}

// ================================ Get all images path ================================
async function getAllImagesPath(imageFolder: string): Promise<string[]> {
  // Get folder path
  const folderPath = getFolderPath(imageFolder);

  // Validate folder exist
  if (!fs.existsSync(folderPath)) {
    throw new ResourceNotFoundError(folderPath + " is not found");
  }

  // Get images from folder
  const files = await fs.promises.readdir(folderPath);

  // Filter out files that don't have valid image extensions
  const imagesUrl: string[] = files
    .filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".bmp", ".webp", ".svg"].includes(ext);
    })
    // Add full URL to image name
    .map((f) => {
      return appConfig.getImgUrl(imageFolder) + "/" + f;
    });

  return imagesUrl;
}

// ================================ Save images to disk and return image model: ================================
async function saveImages(
  imageFiles: UploadedFile[],
  imageFolder: string
): Promise<{imagesUrl:string[], imagesFolder:string}> {
console.log(imageFolder);

  // Unique image name holder
  const imagesName: string[] = [];

  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i];

    // Take original extension:
    const extension = imageFile.name.substring(imageFile.name.lastIndexOf("."));

    // Create unique name:
    const uniqueName = uuid() + extension;
    imagesName.push(uniqueName);

    // Get absolute images folder path:
    const folderPath = getFolderPath(imageFolder);
    const absolutePath = getFolderPath(imageFolder) + uniqueName;

    // Create folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Move image to folder
    imageFile.mv(absolutePath);

    if (!imageFiles.length) break;
  }

  // Filter out files that don't have valid image extensions
  const imagesUrl = imagesName
    .filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".bmp", ".webp", ".svg"].includes(ext);
    })

    // Add full URL to image name
    .map((f) => {
      return appConfig.getImgUrl(imageFolder) + "/" + f.toString();
    });

  // Build an image object
  const imageObj = {
    imagesFolder: imageFolder,
    imagesUrl: imagesUrl,
  };


  // Return image folder name:
  return imageObj;
}

// ================================ Delete images from disk: ================================
async function deleteImages(
  imagesUrl: string[],
  imagesFolder: string
): Promise<void> {
  try {
    // If no images sent:
    if (!imagesUrl || imagesUrl.length === 0)
      throw new ResourceNotFoundError("image or folder are not found");

    // Delete image:
    for (let i = 0; i < imagesUrl.length; i++) {
      const fileName = imagesUrl[i].split("/").pop();
      const imageUrl = await getImagePath(imagesFolder, fileName);
      await fsPromises.unlink(imageUrl);
    }
  } catch (err: any) {
    console.error(err.message);
  }
}

// ================================ Delete images Folder from disk: ================================
async function deleteImagesFolder(imagesFolder: string): Promise<void> {
  try {
    // Get folder path:
    const imagesFolderPath = getFolderPath(imagesFolder);
    console.log(imagesFolder);
    console.log(imagesFolderPath);

    // Delete image:
    await fsPromises.rmdir(imagesFolderPath, { recursive: true });
  } catch (err: any) {
    console.error(err.message);
  }
}

export default {
  getFolderPath,
  saveImages,
  deleteImages,
  deleteImagesFolder,
  getAllImagesPath,
  getImagePath,
};
