// File validation utilities
const MAX_FILE_SIZE = 1.5 * 1024 * 1024; // 1.5 MB in bytes

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  sizeInMB?: number;
}

/**
 * Validates file size (max 1.5 MB)
 * @param file - The file to validate
 * @returns Validation result with error message if invalid
 */
export function validateFileSize(file: File): FileValidationResult {
  const sizeInMB = file.size / (1024 * 1024);

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size (${sizeInMB.toFixed(2)} MB) exceeds the 1.5 MB limit. Please use an image compressor tool to reduce the file size.`,
      sizeInMB,
    };
  }

  return {
    isValid: true,
    sizeInMB,
  };
}

/**
 * Validates file type is an image
 * @param file - The file to validate
 * @returns true if file is an image, false otherwise
 */
export function validateImageType(file: File): boolean {
  const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  return imageTypes.includes(file.type);
}

/**
 * Gets human-readable file size
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function getFormattedFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
