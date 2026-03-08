import { assertPermissions } from "./utils";

const CATEGORY_DIR_NAME = "categories";

export const getCategoryDirectory = (
  rootDirHandle: FileSystemDirectoryHandle,
) => rootDirHandle.getDirectoryHandle(CATEGORY_DIR_NAME);

export const getCategoryFile = async (
  categoryId: string,
  rootDirHandle: FileSystemDirectoryHandle,
) => {
  const categoryDir = await getCategoryDirectory(rootDirHandle);
  const categoryDirHandle = await categoryDir.getDirectoryHandle(categoryId);
  await assertPermissions(categoryDirHandle, "read");
  return categoryDirHandle;
};
