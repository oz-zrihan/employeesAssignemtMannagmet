import mongoose from 'mongoose';

export interface ICredentialsModel extends mongoose.Document {
  email: string;
  password: string;
}

export const credentialsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "missing email"],
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: [true, "missing password"],
    minlength: 4,
    maxlength: 256,
  },
});

 const CredentialsModel = mongoose.model<ICredentialsModel>('Credentials', credentialsSchema);
export default CredentialsModel;
