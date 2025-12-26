export type AllowedFileType = 'image' | 'pdf' | 'excel' | 'zip' | 'dbf';
export type AllowedFolderType = 'user';

export type AllowedFileKey = 'user-profile';

export interface AllowedFileRule {
  folder: AllowedFolderType;
  fileType: AllowedFileType;
}

export const ALLOWED_FILE_RULES: Record<AllowedFileKey, AllowedFileRule> = {
  'user-profile': {
    folder: 'user',
    fileType: 'image',
  },
};
