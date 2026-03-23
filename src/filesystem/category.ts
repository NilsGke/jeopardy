import { categorySchema } from "@/schemas/category";
import { assertPermissions } from "./utils";
import { IGNORE_FILES } from "./ignoreFiles";

const CATEGORY_DIR_NAME = "categories";
const CATEGORY_META_FILE_NAME = "category-meta.json";

export const getRootCategoryDir = (rootDirHandle: FileSystemDirectoryHandle) =>
  rootDirHandle.getDirectoryHandle(CATEGORY_DIR_NAME);

export const getAllCategoryIds = async (
  rootDirHandle: FileSystemDirectoryHandle,
) => {
  const categoryDir = await getRootCategoryDir(rootDirHandle);
  await assertPermissions(categoryDir, "readwrite");

  const ids: string[] = [];
  for await (const [filename] of categoryDir.entries())
    if (!IGNORE_FILES.has(filename)) ids.push(filename);

  return ids;
};

export const getCategoryDirectory = async (
  categoryId: string,
  rootDirHandle: FileSystemDirectoryHandle,
) => {
  const categoryDir = await getRootCategoryDir(rootDirHandle);
  const categoryDirHandle = await categoryDir.getDirectoryHandle(categoryId);
  await assertPermissions(categoryDirHandle, "read");
  return categoryDirHandle;
};

export const getCategoryMetaFile = async (
  categoryId: string,
  rootDirHandle: FileSystemDirectoryHandle,
) => {
  const categoryDir = await getCategoryDirectory(categoryId, rootDirHandle);
  const metaFile = await categoryDir
    .getFileHandle(CATEGORY_META_FILE_NAME)
    .catch((error) => {
      console.error(error);
      return null;
    });
  if (!metaFile) throw Error("File not found");
  await assertPermissions(metaFile, "read");
  return metaFile;
};

export const getCategory = async (
  categoryId: string,
  rootDirHandle: FileSystemDirectoryHandle,
) => {
  try {
    const fileHandle = await getCategoryMetaFile(categoryId, rootDirHandle);
    const file = await fileHandle.getFile();
    const contentString = await file.text();
    const contentObject = JSON.parse(contentString);
    const category = categorySchema.parse({ id: categoryId, ...contentObject });
    return category;
  } catch (error) {
    throw Error(`Error for category with id: "${categoryId}":\n${error}`);
  }
};

export const deleteCategory = async (
  categoryId: string,
  rootDirHandle: FileSystemDirectoryHandle,
) => {
  const categoryDir = await getRootCategoryDir(rootDirHandle);
  await categoryDir.removeEntry(categoryId, { recursive: true });
};
