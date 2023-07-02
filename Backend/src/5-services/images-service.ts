// Model
import { ResourceNotFoundError } from "../2-models/client-errors";
// Utils
import imageHandler from "../4-utils/image-handler";
import dal from "../4-utils/dal";
import { IImageModel } from "../2-models/image-model";
import AssignmentModel from "../2-models/assignment-model";

//  ====================== Get all images path from specific folder ======================
async function getAllImagesPath(imageFolder: string): Promise<string[]> {
  // Get images path from folder
  const images = await imageHandler.getAllImagesPath(imageFolder);

  return images;
}

//  ====================== Get specific image ======================
async function getImageUrl(
  imageFolder: string,
  imageName: string
): Promise<string> {
  // Get images file from folder
  const image = await imageHandler.getImagePath(imageFolder, imageName);

  // Error if not exist
  if (!image) {
    throw new ResourceNotFoundError(imageName);
  }

  return image;
}
//  ====================== Add images file from specific folder ======================
async function addImage(images: IImageModel): Promise<{imagesUrl:string[], imagesFolder:string}> {
  // Image validation
  const errors = images.validateSync();


  // Save image to local folder
  const UploadedImages = await imageHandler.saveImages(
    images.imagesFile,
    images.imagesFolder
  );

  return UploadedImages;
}

//  ====================== Delete images file from specific folder ======================
async function deleteImage(imagesUrl: string[], imagesFolder: string): Promise<void> {
  // Delete images from server
  await imageHandler.deleteImages(imagesUrl, imagesFolder);

  // Update documents in the database
  await AssignmentModel.updateMany(
    { 'images.imagesUrl': { $in: imagesUrl } },
    { $pull: { images: { imagesUrl: { $in: imagesUrl } } } }
  );
}
//  ====================== Delete images folder ======================
async function deleteImagesFolder(imagesFolder: string): Promise<void> {
  // Delete all images folder from server
  await imageHandler.deleteImagesFolder(imagesFolder);

  // Update documents in the database
  await AssignmentModel.updateMany(
    { 'images.imagesFolder': imagesFolder },
    { $unset: { images: 1 } }
  );
}

export default {
  getAllImagesPath,
  getImageUrl,
  addImage,
  deleteImage,
  deleteImagesFolder,
};
