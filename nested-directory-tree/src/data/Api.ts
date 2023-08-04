import { FolderListProps } from "../types/PropTypes";

export const folderList: Array<FolderListProps> = [
  {
    folder: [],
    file: [
      { name: "test", url: "test" },
      { name: "test1", url: "test1" },
      { name: "test2", url: "test2" },
      { name: "test3", url: "test3" },
    ],
    folderName: "root",
  },
  {
    folder: [
      {
        folder: [],
        file: [
          { name: "test", url: "test" },
          { name: "test1", url: "test1" },
          { name: "test2", url: "test2" },
          { name: "test3", url: "test3" },
        ],
        folderName: "insideFirst",
      },
    ],
    file: [],
    folderName: "first",
  },
];
