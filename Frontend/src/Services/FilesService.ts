import axios from "axios";
import appConfig from "../Utils/AppConfig";
// Models
import FileModel from "../Models/fileModel";
// Redux
import { FilesActionType, filesStore } from "../Redux/filesState";

class FilesService {
  // ==================== GET all files By Folder ====================
  public async getAllFiles(filesFolder: string): Promise<FileModel> {
    if (filesFolder !== null) {
      try {
        // Get files from global state:
        const storeFiles = filesStore.getState().filesByFolder;

        // Get specific folder files
        let files = storeFiles.find((f) => f.filesFolder === filesFolder);

        // If we don't have files
        if (!files) {
          // Get from server
          const response = await axios.get<FileModel>(
            appConfig.filesUrl + filesFolder
          );

          // Extract files
          files = {
            filesFolder: filesFolder,
            filesUrl: response.data.filesUrl,
            filesFile: response.data.filesFile,
          };

          // Update global state
          filesStore.dispatch({
            type: FilesActionType.FetchFiles,
            filesFolder: files.filesFolder,
            filesUrl: files.filesUrl,
          });
        }

        // Return
        return files;
      } catch (error) {
        console.error(error);
      }
    } else return;
  }

  // ==================== ADD file ====================
  public async addFile(
    filesFile: FileList[],
    filesFolder: string
  ): Promise<string[]> {
    // Header for sending file
    const headers = {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    };

    // Creating an array of files from FileList
    const files = [];
    for (let i = 0; i < filesFile[0].length; i++) {
      files.push(filesFile[0][i]);
    }

    // creating files object to send
    const fileObj = {
      filesFolder: filesFolder,
      filesFile: files,
    };

    // Add files to server
    const response = await axios.post<FileModel>(appConfig.filesUrl, fileObj, {
      headers,
    });

    // Update global state
    filesStore.dispatch({
      type: FilesActionType.AddFile,
      filesFolder: response.data.filesFolder,
      filesUrl: response.data.filesUrl,
    });

    return response.data.filesUrl;
  }

  // ==================== DELETE file ====================
  public async deleteFile(file: FileModel): Promise<void> {
    // Set delete config params
    const config = {
      data: {
        filesUrl: file.filesUrl,
        filesFolder: file.filesFolder,
      },
    };

    // Delete file form server
    await axios.delete<FileModel>(appConfig.filesUrl + "deleteFile", config);

    // Update global state
    filesStore.dispatch({
      type: FilesActionType.DeleteFile,
      filesFolder: file.filesFolder,
      filesUrl: file.filesUrl,
    });
  }

  // ==================== DELETE all files ====================
  public async deleteAllFiles(filesFolder: string): Promise<void> {
    // Delete files form server
    await axios.delete<FileModel>(
      appConfig.filesUrl + "delete-all-files/" + filesFolder
    );

    // Update global state
    filesStore.dispatch({
      type: FilesActionType.DeleteFolder,
      filesFolder: filesFolder,
    });
  }
}

const filesService = new FilesService();

export default filesService;
