import { FolderComponent } from "../components/FolderComponent";
import { FolderListProps } from "../types/PropTypes";

export const FolderListingComponent: React.FC<Array<FolderListProps>> = (
  folderList
) => {
  return (
    <>
      <div>Folder List</div>
      {Object.entries(folderList).map(([_, value]) => (
        <FolderComponent key={_} {...value} />
      ))}
    </>
  );
};
