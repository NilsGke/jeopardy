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
