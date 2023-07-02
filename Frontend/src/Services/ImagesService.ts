import axios from "axios";
import appConfig from "../Utils/AppConfig";
// Models
import ImageModel from "../Models/ImageModel";
// Redux
import { ImagesActionType, imagesStore } from "../Redux/ImagesState";

class ImagesService {
  // ==================== GET all images By Folder ====================
  public async getAllImages(imagesFolder: string): Promise<ImageModel> {
    if (imagesFolder !== null) {
      try {
        // Get images from global state:
        const storeImages = imagesStore.getState().imagesByFolder;

        // Get specific folder images
        let images = storeImages.find((i) => i.imagesFolder === imagesFolder);

        // If we don't have images
        if (!images) {
          // Get from server
          const response = await axios.get<ImageModel>(
            appConfig.imagesUrl + imagesFolder
          );

          // Extract images
          images = {
            imagesFolder: imagesFolder,
            imagesUrl: response.data.imagesUrl,
            imagesFile: response.data.imagesFile,
          };

          // Update global state
          imagesStore.dispatch({
            type: ImagesActionType.FetchImages,
            imagesFolder: images.imagesFolder,
            imagesUrl: images.imagesUrl,
          });
        }

        // Return
        return images;
      } catch (error) {
        console.error(error);
      }
    } else return;
  }

  // ==================== ADD image ====================
  public async addImage(
    imagesFile: FileList[],
    imagesFolder: string
  ): Promise<string[]> {
    // Header for sending image
    const headers = {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    };

    // Creating an array of files from FileList
    const images = [];
    for (let i = 0; i < imagesFile[0].length; i++) {
      images.push(imagesFile[0][i]);
    }

    // creating image object to send
    const imgObj = {
      imagesFolder: imagesFolder,
      imagesFile: images,
    };
    console.log(imgObj);

    // Add images to server
    const response = await axios.post<ImageModel>(appConfig.imagesUrl, imgObj, {
      headers,
    });

    // Update global state
    imagesStore.dispatch({
      type: ImagesActionType.AddImage,
      imagesFolder: response.data.imagesFolder,
      imagesUrl: response.data.imagesUrl,
    });

    return response.data.imagesUrl;
  }

  // ==================== DELETE image ====================
  public async deleteImage(image: ImageModel): Promise<void> {
    // Set delete config params
    const config = {
      data: {
        imagesUrl: image.imagesUrl,
        imagesFolder: image.imagesFolder,
      },
    };

    // Delete images form server
    await axios.delete<ImageModel>(appConfig.imagesUrl + "deleteImage", config);

    // Update global state
    imagesStore.dispatch({
      type: ImagesActionType.DeleteImage,
      imagesFolder: image.imagesFolder,
      imagesUrl: image.imagesUrl,
    });
  }

  // ==================== DELETE all images ====================
  public async deleteAllImage(imagesFolder: string): Promise<void> {
    // Delete images form server
    await axios.delete<ImageModel>(
      appConfig.imagesUrl + "delete-all-images/" + imagesFolder
    );

    // Update global state
    imagesStore.dispatch({
      type: ImagesActionType.DeleteFolder,
      imagesFolder: imagesFolder,
    });
  }
}

const imagesService = new ImagesService();

export default imagesService;
