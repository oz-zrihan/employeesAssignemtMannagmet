import { createStore } from "redux";
import ImageModel from "../Models/ImageModel";

// 1. Images path global State
export class ImagesState {
  public imagesByFolder: ImageModel[] = [];
}

// 2. Images Action Type
export enum ImagesActionType {
  FetchImages,
  AddImage,
  DeleteImage,
  DeleteFolder,
}

// 3. Images Action
export interface ImagesAction {
  type: ImagesActionType;
  imagesFolder: string;
  imagesUrl?: string[];
}

// 4. Images Reducer
export function imagesReducer(
  currentState = new ImagesState(),
  action: ImagesAction
): ImagesState {
  const newState = { ...currentState };

  switch (action.type) {
    case ImagesActionType.FetchImages: // payload is imageFolder and images
      const ifExist = newState.imagesByFolder.find(
        (i) => i.imagesFolder === action.imagesFolder
      );
      if (!ifExist) {
        newState.imagesByFolder.push({
          imagesFolder: action.imagesFolder,
          imagesUrl: action.imagesUrl,
        });
      }
      break;

    case ImagesActionType.AddImage:
      const indexToAdd = newState.imagesByFolder.findIndex(
        (i) => i.imagesFolder === action.imagesFolder
      );
      if (indexToAdd >= 0) {
        for (let i = 0; i < action.imagesUrl.length; i++) {
          if (
            !newState.imagesByFolder[indexToAdd].imagesUrl.includes(
              action.imagesUrl[i]
            )
          ) {
            newState.imagesByFolder[indexToAdd].imagesUrl.push(
              action.imagesUrl[i]
            );
          }
        }
      } else {
        newState.imagesByFolder.push({
          imagesFolder: action.imagesFolder,
          imagesUrl: action.imagesUrl,
        });
      }
      break;

    case ImagesActionType.DeleteImage:
      const indexToDelete = newState.imagesByFolder.findIndex(
        (i) => i.imagesFolder === action.imagesFolder
      );
      if (indexToDelete >= 0) {
        const imageUrlIndexToDelete = newState.imagesByFolder[
          indexToDelete
        ].imagesUrl.findIndex((i) => i === action.imagesUrl[0]);
        if (imageUrlIndexToDelete >= 0) {
          newState.imagesByFolder[indexToDelete].imagesUrl.splice(
            imageUrlIndexToDelete,
            1
          );
        }
      }
      break;

    case ImagesActionType.DeleteFolder:
      const folderToDelete = newState.imagesByFolder.findIndex(
        (i) => i.imagesFolder === action.imagesFolder
      );
      if (folderToDelete >= 0) {
        newState.imagesByFolder.splice(folderToDelete, 1);
      }
      break;
  }

  return newState;
}

// 5. Images Store
export const imagesStore = createStore(imagesReducer);
