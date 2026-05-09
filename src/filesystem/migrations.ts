import { toast } from "sonner";
import { assertPermissions } from "./utils";

export type MigrationStatusUpdate = { completion: number; message: string };

export type Migration = {
  newMajorVersion: number;
  run: (
    rootDirectoryHandle: FileSystemDirectoryHandle,
    onStatusUpdate: (update: MigrationStatusUpdate) => void,
    onComplete: () => void,
  ) => Promise<void>;
};

export const migrations = [] as const satisfies Migration[];

export const runMigration = async (
  migration: Migration,
  rootDirectoryHandle: FileSystemDirectoryHandle,
  onStatusUpdate: (update: MigrationStatusUpdate) => void,
  onCompleted: () => void,
) => {
  assertPermissions(rootDirectoryHandle, "readwrite");

  const migrationPromise = migration.run(
    rootDirectoryHandle,
    onStatusUpdate,
    onCompleted,
  );

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

  onCompleted();
};
