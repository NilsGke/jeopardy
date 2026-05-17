import { z } from "zod";
import { assertPermissions, countEntries } from "./utils";
import {
  versionCodec,
  versionObjectSchema,
  versionStringSchema,
} from "@/schemas/version";

export const ROOT_META_FILE_NAME = "jeopardy-meta.json";

// TODO: DO NOT USE FULL SEMANTIC VERSION IN ROOT META SINCE ONLY MAJOR VERSION IS NEEDED
const jfRootMetaSchema = z.object({
  version: versionStringSchema,
});

export type JFRootMeta = z.infer<typeof jfRootMetaSchema>;

export const ROOT_META_DEFAULT_CONTENT = jfRootMetaSchema.parse({
  version: __APP_VERSION__,
} satisfies z.input<typeof jfRootMetaSchema>);
console.log(ROOT_META_DEFAULT_CONTENT);

export enum DirectoryState {
  EMPTY,
  NONEMPTY_BUT_NO_META,
  MAJOR_VERSION_TOO_OLD,
  MAJOR_VERSION_TOO_NEW,
  INVALID_META,
  VALID,
}

export const getRootMetaFileAndState = async (
  rootDirectoryHandle: FileSystemDirectoryHandle,
): Promise<
  | { directoryState: DirectoryState.VALID; data: JFRootMeta }
  | {
      directoryState:
        | DirectoryState.MAJOR_VERSION_TOO_OLD
        | DirectoryState.MAJOR_VERSION_TOO_NEW;
      dirVersion: z.infer<typeof versionObjectSchema>;
    }
  | {
      directoryState: Exclude<
        DirectoryState,
        DirectoryState.VALID | DirectoryState.MAJOR_VERSION_TOO_OLD
      >;
    }
> => {
  const metaFileHandleRequest = await rootDirectoryHandle
    .getFileHandle(ROOT_META_FILE_NAME, {
      create: false,
    })
    .then((handle) => ({ error: false, handle }) as const)
    .catch((error) => {
      console.error(error);
      return {
        error: true,
      } as const;
    });

  if (metaFileHandleRequest.error) {
    if ((await countEntries(rootDirectoryHandle)) === 0)
      return { directoryState: DirectoryState.EMPTY };
    return { directoryState: DirectoryState.NONEMPTY_BUT_NO_META };
  }

  const metaFile = await metaFileHandleRequest.handle.getFile();
  const metaRawText = await metaFile.text();

  try {
    const metaRawJson = JSON.parse(metaRawText);

    const dirVersion = versionCodec.decode(
      jfRootMetaSchema.pick({ version: true }).loose().parse(metaRawJson)
        .version,
    );

    const appVersion = versionCodec.decode(__APP_VERSION__);

    if (appVersion.major > dirVersion.major)
      return {
        directoryState: DirectoryState.MAJOR_VERSION_TOO_OLD,
        dirVersion,
      };
    if (appVersion.major < dirVersion.major)
      return {
        directoryState: DirectoryState.MAJOR_VERSION_TOO_NEW,
        dirVersion,
      };

    const data = jfRootMetaSchema.parse(metaRawJson);
    return { directoryState: DirectoryState.VALID, data };
  } catch (error) {
    console.error(error);
    return { directoryState: DirectoryState.INVALID_META };
  }
};

/** updates root meta file version */
export const updateRootMetaFileVersion = async (
  rootDirHandle: FileSystemDirectoryHandle,
  newMajorVersion: number,
) => {
  const metaFileHandle = await rootDirHandle.getFileHandle(
    ROOT_META_FILE_NAME,
    { create: false },
  );
  assertPermissions(metaFileHandle, "readwrite");
  const metaFile = await metaFileHandle.getFile();
  const currentText = await metaFile.text();
  const currentJson = JSON.parse(currentText);
  const current = jfRootMetaSchema.parse(currentJson);

  const newContent = jfRootMetaSchema.parse({
    ...current,
    version: versionCodec.encode({
      major: newMajorVersion,
      minor: 0,
      patch: 0,
    }),
  });

  const writable = await metaFileHandle.createWritable();
  await writable.write(JSON.stringify(newContent));
  await writable.close();
};
