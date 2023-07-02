import express, { Request, Response, NextFunction } from "express";
// Model
// Service
import imagesService from "../5-services/images-service";
import { UploadedFile } from "express-fileupload";
import ImageModel, { IImageModel } from "../2-models/image-model";

const router = express.Router();

// GET ALL IMAGES IN FOLDER
// GET http://localhost:4000/api/images/:imageFolder
router.get(
  "/:imageFolder",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const imageFolder = request.params.imageFolder;
      const images = await imagesService.getAllImagesPath(imageFolder);
      response.send(images);
    } catch (err: any) {
      next(err);
    }
  }
);
  
// GET ONE IMAGE
// GET http://localhost:4000/api/images/:imageFolder/:imageName
router.get(
  "/:imageFolder/:imageName",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const imageFolder = request.params.imageFolder;
      const imageName = request.params.imageName;
      const image = await imagesService.getImageUrl(imageFolder, imageName);
      response.sendFile(image);
    } catch (err: any) {
      next(err);
    }
  }
);

// ADD IMAGE
// POST http://localhost:4000/api/images/:imageFolder
router.post(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const image: IImageModel = new ImageModel({
        imagesFolder: request.body.imagesFolder,
        imagesUrl: request.body.imagesUrl,
        imagesFile: Array.isArray(request.files["imagesFile[]"])
          ? (request.files["imagesFile[]"] as UploadedFile[])
          : [request.files["imagesFile[]"] as UploadedFile],
      });

      const uploadedImage = await imagesService.addImage(image);
      response.status(201).json(uploadedImage);
    } catch (err: any) {
      next(err);
    }
  }
);

// DELETE IMAGE
// DELETE http://localhost:4000/api/images/deleteImage/
router.delete(
  "/deleteImage",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const imagesUrl = request.body.imagesUrl;
      const imagesFolder = request.body.imagesFolder;
      await imagesService.deleteImage(imagesUrl, imagesFolder);
      response.sendStatus(204);
    } catch (err: any) {
      next(err);
    }
  }
);

// DELETE ALL IMAGES AND FOLDER
// DELETE http://localhost:4000/api/images/delete-all-images/:imageFolder
router.delete(
  "/delete-all-images/:imageFolder",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const imageFolder = request.params.imageFolder;
      await imagesService.deleteImagesFolder(imageFolder);
      response.sendStatus(204);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
