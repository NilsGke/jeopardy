import { db } from "./db";

interface SettingValues {
  rootDir: FileSystemDirectoryHandle;
}
export type SettingEntry<K extends keyof SettingValues = keyof SettingValues> =
  {
    key: K;
    value: SettingValues[K];
  };

export const getSetting = async <K extends keyof SettingValues>(
  key: K,
): Promise<SettingValues[K] | undefined> => {
  const entry = await db.settings.get(key);
  return entry?.value as SettingValues[K] | undefined;
};

export const setSetting = <K extends keyof SettingValues>(
  key: K,
  value: SettingValues[K],
) => db.settings.put({ key, value });

export const deleteSetting = <K extends keyof SettingValues>(key: K) =>
  db.settings.delete(key);
