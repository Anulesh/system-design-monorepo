export type FileType = {
  name: string;
  url: string;
};
export type FolderListProps = {
  folder: Array<FolderListProps> | [];
  file: Array<FileType> | [];
  folderName: string;
};
export type PartialFolderListProps = Partial<Array<FolderListProps>>