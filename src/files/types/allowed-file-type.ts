export type AllowedFileType = 'image' | 'pdf' | 'excel' | 'zip' | 'dbf';
export type AllowedFolderType = 'user' | 'company' | 'ceo';

export type AllowedFileKey =
  | 'user-profile'
  | 'user-signature'
  | 'company-stamp'
  | 'ceo-signature';

export interface AllowedFileRule {
  folder: AllowedFolderType;
  fileType: AllowedFileType;
}

export const ALLOWED_FILE_RULES: Record<AllowedFileKey, AllowedFileRule> = {
  'user-profile': {
    folder: 'user',
    fileType: 'image',
  },
  'user-signature': {
    folder: 'user',
    fileType: 'image',
  },
  'company-stamp': {
    folder: 'company',
    fileType: 'image',
  },
  'ceo-signature': {
    folder: 'ceo',
    fileType: 'image',
  },
};
