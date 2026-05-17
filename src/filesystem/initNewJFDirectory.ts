import { GAMES_JSON_DEFAULT_CONTENT, GAMES_JSON_FILE_NAME } from "./game";
import { ROOT_META_DEFAULT_CONTENT, ROOT_META_FILE_NAME } from "./rootMetaFile";
import { countEntries } from "./utils";
import { toast } from "sonner";

export async function initNewJFDirectory(
  directoryHandle: FileSystemDirectoryHandle,
) {
  if ((await countEntries(directoryHandle)) !== 0)
    throw Error("directory is not empty");

  // create files and directories
  const [metaHandle, gamesHandle] = await Promise.all([
    directoryHandle.getFileHandle(ROOT_META_FILE_NAME, { create: true }),
    directoryHandle.getFileHandle(GAMES_JSON_FILE_NAME, { create: true }),
    directoryHandle.getDirectoryHandle("categories", { create: true }),
  ]).catch(async (reason) => {
    // cleanup directory
    await Promise.allSettled([
      directoryHandle.removeEntry(ROOT_META_FILE_NAME),
      directoryHandle.removeEntry(GAMES_JSON_FILE_NAME),
      directoryHandle.removeEntry("categories"),
    ]);

    console.error(reason);
    throw Error("Could not initialize jeopardy directory");
  });

  await Promise.all([
    // write meta file
    (async () => {
      const metaWritable = await metaHandle.createWritable();
      await metaWritable.write(JSON.stringify(ROOT_META_DEFAULT_CONTENT));
      await metaWritable.close();
    })(),

    // write games json file
    (async () => {
      const gamesWritable = await gamesHandle.createWritable();
      await gamesWritable.write(JSON.stringify(GAMES_JSON_DEFAULT_CONTENT));
      await gamesWritable.close();
    })(),
  ]);

  toast.success("Successfully initialized Jeopardy Directory");
}
