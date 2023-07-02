import { createStore } from "redux";
import FileModel from "../Models/fileModel";

// 1. Files path global State
export class FilesState {
  public filesByFolder: FileModel[] = [];
}

// 2. Files Action Type
export enum FilesActionType {
  FetchFiles,
  AddFile,
  DeleteFile,
  DeleteFolder,
}

// 3. Files Action
export interface FilesAction {
  type: FilesActionType;
  filesFolder: string;
  filesUrl?: string[];
}

// 4. files Reducer
export function filesReducer(
  currentState = new FilesState(),
  action: FilesAction
): FilesState {
  const newState = { ...currentState };

  switch (action.type) {
    case FilesActionType.FetchFiles: // payload is filesFolder and files
      const ifExist = newState.filesByFolder.find(
        (f) => f.filesFolder === action.filesFolder
      );
      if (!ifExist) {
        newState.filesByFolder.push({
          filesFolder: action.filesFolder,
          filesUrl: action.filesUrl,
        });
      }
      break;

    case FilesActionType.AddFile:
      const indexToAdd = newState.filesByFolder.findIndex(
        (f) => f.filesFolder === action.filesFolder
      );
      if (indexToAdd >= 0) {
        for (let i = 0; i < action.filesUrl.length; i++) {
          if (
            !newState.filesByFolder[indexToAdd].filesUrl.includes(
              action.filesUrl[i]
            )
          ) {
            newState.filesByFolder[indexToAdd].filesUrl.push(
              action.filesUrl[i]
            );
          }
        }
      } else {
        newState.filesByFolder.push({
          filesFolder: action.filesFolder,
          filesUrl: action.filesUrl,
        });
      }
      break;

    case FilesActionType.DeleteFile:
      const indexToDelete = newState.filesByFolder.findIndex(
        (f) => f.filesFolder === action.filesFolder
      );
      if (indexToDelete >= 0) {
        const fileUrlIndexToDelete = newState.filesByFolder[
          indexToDelete
        ].filesUrl.findIndex((i) => i === action.filesUrl[0]);
        if (fileUrlIndexToDelete >= 0) {
          newState.filesByFolder[indexToDelete].filesUrl.splice(
            fileUrlIndexToDelete,
            1
          );
        }
      }
      break;

    case FilesActionType.DeleteFolder:
      const folderToDelete = newState.filesByFolder.findIndex(
        (f) => f.filesFolder === action.filesFolder
      );
      if (folderToDelete >= 0) {
        newState.filesByFolder.splice(folderToDelete, 1);
      }
      break;
  }

  return newState;
}

// 5. files Store
export const filesStore = createStore(filesReducer);
