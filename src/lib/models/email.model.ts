import mongoose, { Schema, Document } from 'mongoose';

export interface IEmail extends Document {
  userId: string;
  messageId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  htmlBody?: string;
  folder: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EmailSchema = new Schema<IEmail>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    messageId: {
      type: String,
      required: true,
      unique: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: '',
    },
    body: {
      type: String,
      default: '',
    },
    htmlBody: {
      type: String,
    },
    folder: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    hasAttachments: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user-specific queries
EmailSchema.index({ userId: 1, folder: 1, createdAt: -1 });
EmailSchema.index({ userId: 1, isStarred: 1 });

export default mongoose.models.Email || mongoose.model<IEmail>('Email', EmailSchema);
