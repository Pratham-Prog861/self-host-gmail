import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFolder extends Document {
  name: string;
  count: number;
  createdAt: Date;
}

const FolderSchema = new Schema<IFolder>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Folder: Model<IFolder> = mongoose.models.Folder || mongoose.model<IFolder>('Folder', FolderSchema);

export default Folder;
