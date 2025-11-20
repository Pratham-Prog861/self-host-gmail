import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmail extends Document {
  messageId?: string;
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
    messageId: {
      type: String,
      unique: true,
      sparse: true,
    },
    from: {
      type: String,
      required: true,
      index: true,
    },
    to: {
      type: String,
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    htmlBody: {
      type: String,
    },
    folder: {
      type: String,
      default: 'inbox',
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    isStarred: {
      type: Boolean,
      default: false,
      index: true,
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

// Create compound indexes for common queries
EmailSchema.index({ folder: 1, createdAt: -1 });
EmailSchema.index({ folder: 1, isRead: 1, createdAt: -1 });

const Email: Model<IEmail> = mongoose.models.Email || mongoose.model<IEmail>('Email', EmailSchema);

export default Email;
