import { z } from "zod";
import { countEntries } from "./utils";

export const ROOT_META_FILE_NAME = "jeopardy-meta.json";

export const metaVersionSchema = z
  .string()
  .regex(/\d+\.\d+\.\d+/)
  .transform((version) => {
    const [major, minor, patch] = version.split(".").map((v) => parseInt(v));
    return { major, minor, patch };
  });

const jfRootMetaSchema = z.object({
  version: metaVersionSchema,
});

export type JFRootMeta = z.infer<typeof jfRootMetaSchema>;

export const ROOT_META_DEFAULT_CONTENT = jfRootMetaSchema.parse({
  version: __APP_VERSION__,
} satisfies z.input<typeof jfRootMetaSchema>);

export enum DirectoryState {
  EMPTY,
  NONEMPTY_BUT_NO_META,
  MAJOR_VERSION_MISMATCH,
  INVALID_META,
  VALID,
}

// TODO: contiune writing getRootMeta and use the above enum as return type

export const getRootMetaFileAndState = async (
  rootDirectoryHandle: FileSystemDirectoryHandle,
): Promise<
  | { directoryState: DirectoryState.VALID; data: JFRootMeta }
  | {
      directoryState: DirectoryState.MAJOR_VERSION_MISMATCH;
      dirVersion: z.infer<typeof metaVersionSchema>;
    }
  | {
      directoryState: Exclude<
        DirectoryState,
        DirectoryState.VALID | DirectoryState.MAJOR_VERSION_MISMATCH
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

    const { version: dirVersion } = jfRootMetaSchema
      .pick({ version: true })
      .loose()
      .parse(metaRawJson);

    const { version: appVersion } = jfRootMetaSchema
      .pick({ version: true })
      .parse({ version: __APP_VERSION__ });

    if (appVersion.major !== dirVersion.major)
      return {
        directoryState: DirectoryState.MAJOR_VERSION_MISMATCH,
        dirVersion,
      };

    const data = jfRootMetaSchema.parse(metaRawJson);
    return { directoryState: DirectoryState.VALID, data: data };
  } catch (error) {
    console.error(error);
    return { directoryState: DirectoryState.INVALID_META };
  }
};
