import mongoose from "mongoose";

export interface ICandidate extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  resumeUrl?: string;
  skills: string[];
  experience?: number;
  resumeVector?: number[];
  education: {
    degree: string;
    fieldOfStudy: string;
    institution: string;
    startDate: Date;
    endDate?: Date;
    grade?: string;
  }[];
  experiences: {
    companyName: string;
    role: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    currentlyWorking?: boolean;
  }[];
  location?: string;
}

const CandidateSchema = new mongoose.Schema<ICandidate>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BaseUser",
      required: true,
      unique: true
    },

    resumeUrl: {
      type: String
    },

    skills: {
      type: [String],
      default: []
    },

    experience: {
      type: Number
    },

    resumeVector: {
      type: [Number]
    },

    education: [
      {
        degree: { type: String, required: true },
        fieldOfStudy: { type: String },
        institution: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        grade: { type: String }
      }
    ],

    experiences: [
      {
        companyName: { type: String, required: true },
        role: { type: String, required: true },
        description: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        currentlyWorking: { type: Boolean, default: false }
      }
    ],

    location: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export const CandidateModel = mongoose.model<ICandidate>("candidate",CandidateSchema);