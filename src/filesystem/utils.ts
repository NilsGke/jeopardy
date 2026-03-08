import { toast } from "sonner";

export async function countEntries(directoryHandle: FileSystemDirectoryHandle) {
  let count = 0;
  for await (const _entry of directoryHandle.values()) count++;
  return count;
}

export async function countAllFilesRecursive(
  directoryHandle: FileSystemDirectoryHandle,
) {
  let count = 0;
  for await (const entry of directoryHandle.values()) {
    if (entry.kind === "file") count++;
    else if (entry.kind === "directory")
      count += await countAllFilesRecursive(entry);
  }
  return count;
}

export async function assertPermissions(
  handle: FileSystemHandle,
  mode: FileSystemPermissionMode,
) {
  const perms = await handle.queryPermission({ mode });
  if (perms === "granted") return;

  const prom = handle.requestPermission({ mode });
  toast.promise(prom, {
    loading: "the app needs permission to read this file, please approve",
    error: "without approval the app cannot function",
    success: "Permission approved!",
  });
  await prom;
}
