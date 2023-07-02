import express, { Request, Response, NextFunction } from "express";
// Model
// Service
import { UploadedFile } from "express-fileupload";
import ImageModel, { IImageModel } from "../2-models/image-model";
import filesService from "../5-services/files-service";
import FileModel, { IFileModel } from "../2-models/File-model";

const router = express.Router();

// GET ALL FILES IN FOLDER
// GET http://localhost:4000/api/files/:filesFolder
router.get(
  "/:filesFolder",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const filesFolder = request.params.filesFolder;
      const files = await filesService.getAllFilesPath(filesFolder);
      response.send(files);
    } catch (err: any) {
      next(err);
    }
  }
);
  
// GET ONE FILE
// GET http://localhost:4000/api/files/:filesFolder/:fileName
router.get(
  "/:filesFolder/:fileName",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const filesFolder = request.params.filesFolder;
      const fileName = request.params.fileName;
      const file = await filesService.getFileUrl(filesFolder, fileName);
      response.sendFile(file);
    } catch (err: any) {
      next(err);
    }
  }
);

// ADD FILE
// POST http://localhost:4000/api/files/:filesFolder
router.post(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      
      const file: IFileModel = new FileModel({
        filesFolder: request.body.filesFolder,
        
        uploadedFiles: Array.isArray(request.files["filesFile[]"])
          ? (request.files["filesFile[]"] as UploadedFile[])
          : [request.files["filesFile[]"] as UploadedFile],
      });

      console.log(file);
      
      const uploadedFile = await filesService.addFiles(file);
      response.status(201).json(uploadedFile);
    } catch (err: any) {
      next(err);
    }
  }
);

// DELETE FILE
// DELETE http://localhost:4000/api/images/deleteFile/
router.delete(
  "/deleteFile",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const filesUrl = request.body.filesUrl;
      const filesFolder = request.body.filesFolder;
      await filesService.deleteFiles(filesUrl, filesFolder);
      response.sendStatus(204);
    } catch (err: any) {
      next(err);
    }
  }
);

// DELETE ALL FILES AND FOLDER
// DELETE http://localhost:4000/api/images/delete-all-files/:fileFolder
router.delete(
  "/delete-all-files/:fileFolder",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const filesFolder = request.params.imageFolder;
      await filesService.deleteFilesFolder(filesFolder);
      response.sendStatus(204);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
