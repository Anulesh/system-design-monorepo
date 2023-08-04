import { useState } from "react";
import { FolderListProps } from "../types/PropTypes";

export const FolderComponent: React.FC<FolderListProps> = ({
  folder,
  file,
  folderName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenFolder = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div onClick={handleOpenFolder}>{folderName}</div>
      {isOpen && (
        <ul>
          {file.map((fileItem) => (
            <li key={fileItem.name}>
              <a href={fileItem.url}>{fileItem.name}</a>
            </li>
          ))}
          {folder.map((subfolder, index) => (
            <li key={index}>
              <FolderComponent {...subfolder} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
