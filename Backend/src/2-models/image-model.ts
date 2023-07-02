import mongoose, { Schema, Document } from 'mongoose';
import path from 'path';
import { UploadedFile } from 'express-fileupload';

export interface IImageModel extends Document {
  imagesFolder: string;
  imagesUrl?: string[];
  imagesFile: UploadedFile[];
}

const imageSchema: Schema = new Schema({
  imagesFolder: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  imagesUrl: {
    type: [String],
  },
  imagesFile: {
    type: [mongoose.Schema.Types.Mixed],
    validate: {
      validator: function (value: UploadedFile[]): boolean {
        for (const file of value) {
          const fileExtension = path.extname(file.name).toLowerCase();
          if (!['.jpg', '.jpeg', '.png', '.bmp', '.webp', '.svg'].includes(fileExtension)) {
            return false;
          }
        }
        return true;
      },
      message:
        'Invalid file format. Only JPG, JPEG, PNG, BMP, WEBP, and SVG files are allowed.',
    },
  },
});

const ImageModel = mongoose.model<IImageModel>('Image', imageSchema);

export default ImageModel;
