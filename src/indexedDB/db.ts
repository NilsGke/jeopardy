import Dexie from "dexie";

class IndexedDB extends Dexie {
  jeopardyDirectories: Dexie.Table<JeopardyDirectory, number>;

  constructor(dbName: string) {
    super(dbName);
    this.version(1).stores({
      jeopardyDirectories: "++id,lastUsed",
    });
    this.jeopardyDirectories = this.table("jeopardyDirectories");
  }
}

interface JeopardyDirectory {
  id: string;
  lastUsed: Date;
  handle: FileSystemDirectoryHandle;
}

export const db = new IndexedDB("jeopardyDB");
