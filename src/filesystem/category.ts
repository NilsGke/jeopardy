import { categorySchema } from "@/schemas/category";
import { assertPermissions } from "./utils";
import { useQuery } from "@tanstack/react-query";

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
  for await (const [filename] of categoryDir.entries()) ids.push(filename);

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
  const fileHandle = await getCategoryMetaFile(categoryId, rootDirHandle);
  const file = await fileHandle.getFile();
  const contentString = await file.text();
  const contentObject = JSON.parse(contentString);
  const category = categorySchema.parse({ id: categoryId, ...contentObject });
  return category;
};

export const deleteCategory = async (
  categoryId: string,
  rootDirHandle: FileSystemDirectoryHandle,
) => {
  const categoryDir = await getRootCategoryDir(rootDirHandle);
  await categoryDir.removeEntry(categoryId, { recursive: true });
};
