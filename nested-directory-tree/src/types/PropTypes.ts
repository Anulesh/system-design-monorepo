export type FileType = {
  name: string;
  url: string;
};
export type FolderListProps = {
  folder: NestedFolderListArray | [];
  file: Array<FileType> | [];
  folderName: string;
};
interface NestedFolderListArray extends Array<FolderListProps> {}
export type PartialFolderListProps = Partial<Array<FolderListProps>>