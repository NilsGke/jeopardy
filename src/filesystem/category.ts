import {
  categoryFileSchema,
  categorySchema,
  type Category,
  type CategoryFile,
} from "@/schemas/category";
import { assertPermissions, copyDirectory } from "./utils";
import { IGNORE_FILES } from "./ignoreFiles";
import type z from "zod";

const CATEGORY_DIR_NAME = "categories";
const CATEGORY_META_FILE_NAME = "category-meta.json";

export const getRootCategoryDir = (rootDirHandle: FileSystemDirectoryHandle) =>
  rootDirHandle.getDirectoryHandle(CATEGORY_DIR_NAME);

export const getAllCategoryIds = async (
  rootDirHandle: FileSystemDirectoryHandle,
) => {
  const categoryDir = await getRootCategoryDir(rootDirHandle);
  await assertPermissions(categoryDir, "read");

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
  mode: FileSystemPermissionMode = "read",
) => {
  const categoryDir = await getCategoryDirectory(categoryId, rootDirHandle);
  const metaFile = await categoryDir
    .getFileHandle(CATEGORY_META_FILE_NAME)
    .catch((error) => {
      console.error(error);
      return null;
    });
  if (!metaFile) throw Error("File not found");
  await assertPermissions(metaFile, mode);
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

export const updateCategory = async (
  categoryId: string,
  data: CategoryFile,
  rootDirHandle: FileSystemDirectoryHandle,
) => {
  const parseResult = categoryFileSchema
    .strip()
    .safeParse(data satisfies CategoryFile);
  if (!parseResult.success) throw Error(parseResult.error.message);

  const newJson = JSON.stringify(parseResult.data);

  const metaFile = await getCategoryMetaFile(
    categoryId,
    rootDirHandle,
    "readwrite",
  );
  const writable = await metaFile.createWritable();
  const writer = writable.getWriter();
  await writer.write(newJson);
  await writer.close();
};

export const deleteCategory = async (
  categoryId: string,
  rootDirHandle: FileSystemDirectoryHandle,
) => {
  const categoryDir = await getRootCategoryDir(rootDirHandle);
  await categoryDir.removeEntry(categoryId, { recursive: true });
};

export const renameCategory = async ({
  oldId,
  newId,
  rootDirHandle,
}: {
  oldId: string;
  newId: string;
  rootDirHandle: FileSystemDirectoryHandle;
}) => {
  const rootCategoryDir = await getRootCategoryDir(rootDirHandle);
  const categoryDirectory = await getCategoryDirectory(oldId, rootDirHandle);

  const existingNewCategoryDirectory = await rootCategoryDir
    .getDirectoryHandle(newId)
    .catch(() => null);

  if (existingNewCategoryDirectory)
    throw Error(`Category with id "${newId}" already exists`);

  const newCategoryDirectory = await rootCategoryDir.getDirectoryHandle(newId, {
    create: true,
  });

  await copyDirectory(categoryDirectory, newCategoryDirectory);

  const newCategory = await getCategory(newId, rootDirHandle)
    .then((newCategory) => ({ ...newCategory, error: null }))
    .catch((error) => ({ error }));

  if (newCategory.error) {
    // category copy failed -> cleanup
    rootCategoryDir.removeEntry(newId, { recursive: true });
    throw Error("Category creation failed");
  }

  // remove old dir
  await rootCategoryDir.removeEntry(oldId, { recursive: true });
};
