import Dexie, { type Table } from "dexie";
import type { SettingEntry } from "./settings";

class IndexedDB extends Dexie {
  settings: Table<SettingEntry>;

  constructor(dbName: string) {
    super(dbName);
    this.version(1).stores({ settings: "key" });
    this.settings = this.table("settings");
  }
}

export const db = new IndexedDB("jeopardyDB");
