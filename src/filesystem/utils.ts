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

  let resolve: () => void;
  const prom = new Promise<void>((res) => (resolve = res));

  const requestPermission = () => {
    toast(
      `The app needs permission to read this ${handle.kind}. Without, the app cannot function.`,
      {
        action: {
          label: "Request Permission",
          onClick: () =>
            handle
              .requestPermission({ mode })
              .then((rs) => {
                console.log(rs);
                if (rs === "prompt" || rs === "denied")
                  throw Error("Permission required");
              })
              .then(resolve)
              .catch(requestPermission),
        },
        onDismiss: requestPermission,
        duration: 0,
      },
    );
  };

  requestPermission();
  await prom;
}

export async function copyDirectory(
  srcDir: FileSystemDirectoryHandle,
  destDir: FileSystemDirectoryHandle,
) {
  for await (const [name, handle] of srcDir.entries()) {
    if (handle.kind === "file") {
      const file = await handle.getFile();
      const newFileHandle = await destDir.getFileHandle(name, { create: true });
      const writable = await newFileHandle.createWritable();
      await writable.write(file);
      await writable.close();
    } else if (handle.kind === "directory") {
      const newSubDir = await destDir.getDirectoryHandle(name, {
        create: true,
      });
      await copyDirectory(handle, newSubDir);
    }
  }
}
