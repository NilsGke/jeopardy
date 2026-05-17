import { toast } from "sonner";
import { assertPermissions } from "./utils";
import { GAMES_JSON_DEFAULT_CONTENT, GAMES_JSON_FILE_NAME } from "./game";
import { versionCodec } from "@/schemas/version";
import { updateRootMetaFileVersion } from "./rootMetaFile";

export type MigrationStatusUpdate = { completion: number; message: string };

export type Migration = {
  newMajorVersion: number;
  run: (
    rootDirectoryHandle: FileSystemDirectoryHandle,
    onStatusUpdate: (update: MigrationStatusUpdate) => void,
  ) => Promise<void>;
};

export const migrations = [
  {
    newMajorVersion: 1,
    async run(rootDirHandle, onStatusUpdate) {
      try {
        await rootDirHandle.removeEntry("games");
      } catch {}
      onStatusUpdate({
        completion: 0.25,
        message: "removed games directory",
      });
      try {
        await rootDirHandle.removeEntry("boards");
      } catch {}
      onStatusUpdate({
        completion: 0.5,
        message: "removed boards directory",
      });
      try {
        const gamesFileHandle = await rootDirHandle.getFileHandle(
          GAMES_JSON_FILE_NAME,
          { create: true },
        );
        onStatusUpdate({
          completion: 0.75,
          message: "created games file",
        });
        const writable = await gamesFileHandle.createWritable();
        await writable.write(JSON.stringify(GAMES_JSON_DEFAULT_CONTENT));
        await writable.close();
      } catch {}
      onStatusUpdate({
        completion: 0.99,
        message: "wrote games file",
      });
    },
  },
] as const satisfies Migration[];

export const runMigration = async (
  migration: Migration,
  rootDirectoryHandle: FileSystemDirectoryHandle,
  onStatusUpdate: (update: MigrationStatusUpdate) => void,
  onCompleted: () => void,
) => {
  assertPermissions(rootDirectoryHandle, "readwrite");

  const migrationPromise = migration.run(rootDirectoryHandle, onStatusUpdate);

  toast.promise(migrationPromise, {
    success: `Migration to version ${migration.newMajorVersion} finished!`,
    loading: `Migrating to version ${migration.newMajorVersion}...`,
    error: `Migration to version ${migration.newMajorVersion} failed!`,
  });

  onStatusUpdate({
    completion: 0,
    message: "starting migration to version " + 1,
  });

  await migrationPromise;

  onStatusUpdate({
    completion: 1,
    message: `Migration to version ${migration.newMajorVersion} done!`,
  });

  updateRootMetaFileVersion(rootDirectoryHandle, migration.newMajorVersion);

  onStatusUpdate({
    completion: 1,
    message: "Updated Version in Meta file",
  });

  onCompleted();
};
