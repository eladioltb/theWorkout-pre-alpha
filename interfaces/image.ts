import { UploadApiOptions } from "cloudinary";

export interface ImageCloudinary {
  path: string;
  options: CloudinaryOptions;
}

export type CloudinaryOptions = UploadApiOptions;