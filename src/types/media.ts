export type MediaVisibility = "public" | "private" | "pending";

export interface MediaAssetDTO {
  publicId: string;
  secureUrl: string;
  resourceType: "image" | "video" | "raw";
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  alt?: string;
  caption?: string;
  visibility: MediaVisibility;
}

export interface MediaRef {
  url: string;
  alt?: string;
  publicId?: string;
  focalX?: number;
  focalY?: number;
  objectFit?: "cover" | "contain";
}
