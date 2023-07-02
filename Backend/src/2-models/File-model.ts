import mongoose, { Schema, Document } from 'mongoose';
import { UploadedFile } from 'express-fileupload';

export interface IFileModel extends Document {
  filesFolder: string;
  filesUrls?: string[];
  uploadedFiles: UploadedFile[];
}

const fileSchema: Schema = new Schema({
  filesFolder: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  filesUrls: {
    type: [String],
  },
  uploadedFiles: {
    type: [mongoose.Schema.Types.Mixed],
    validate: {
      validator: function (value: UploadedFile[]): boolean {
        return Array.isArray(value) && value.length > 0;
      },
      message: 'At least one file must be provided.',
    },
  },
});

const FileModel = mongoose.model<IFileModel>('File', fileSchema);

export default FileModel;
