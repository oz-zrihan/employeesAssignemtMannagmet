// Model
import { ResourceNotFoundError } from "../2-models/client-errors";
// Utils
import fileHandler from "../4-utils/file-handler";
import dal from "../4-utils/dal";
import AssignmentModel from "../2-models/assignment-model";
import { IFileModel } from "../2-models/File-model";

//  ====================== Get all files path from specific folder ======================
async function getAllFilesPath(filesFolder: string): Promise<string[]> {
  // Get files path from folder
  const files = await fileHandler.getAllFilePaths(filesFolder);

  return files;
}

//  ====================== Get specific file ======================
async function getFileUrl(
  filesFolder: string,
  fileName: string
): Promise<string> {
  // Get file file from folder
  const file = await fileHandler.getFilePath(filesFolder, fileName);

  // Error if not exist
  if (!file) {
    throw new ResourceNotFoundError(fileName);
  }

  return file;
}
//  ====================== Add files file from specific folder ======================
async function addFiles(files: IFileModel): Promise<{filesUrl:string[], filesFolder:string}> {
  // Image validation
  const errors = files.validateSync();
console.log(files);

  // Save files to local folder
  const UploadedFiles = await fileHandler.saveFiles(
    files.uploadedFiles,
    files.filesFolder
  );

  return UploadedFiles;
}

//  ====================== Delete files file from specific folder ======================
async function deleteFiles(filesUrl: string[], filesFolder: string): Promise<void> {
  // Delete files from server
  await fileHandler.deleteFiles(filesUrl, filesFolder);

  // Update documents in the database
  await AssignmentModel.updateMany(
    { 'files.filesUrl': { $in: filesUrl } },
    { $pull: { files: { filesUrl: { $in: filesUrl } } } }
  );
}
//  ====================== Delete files folder ======================
async function deleteFilesFolder(filesFolder: string): Promise<void> {
  // Delete all files folder from server
  await fileHandler.deleteFolder(filesFolder);

  // Update documents in the database
  await AssignmentModel.updateMany(
    { 'files.filesFolder': filesFolder },
    { $unset: { files: 1 } }
  );
}

export default {
  getAllFilesPath,
  getFileUrl,
  addFiles,
  deleteFiles,
  deleteFilesFolder,
};
