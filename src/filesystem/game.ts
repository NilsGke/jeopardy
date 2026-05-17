import { gameSchema } from "@/schemas/game";
import z from "zod";
import { assertPermissions } from "./utils";

export const GAMES_JSON_FILE_NAME = "games.json";

export const gamesJsonFileSchema = z.object({
  games: z.array(gameSchema),
});

export const GAMES_JSON_DEFAULT_CONTENT = gamesJsonFileSchema.parse({
  games: [],
} satisfies z.infer<typeof gamesJsonFileSchema>);

export const getGamesJsonFile = (rootDirHandle: FileSystemDirectoryHandle) =>
  rootDirHandle.getFileHandle(GAMES_JSON_FILE_NAME);

export const getAllGames = async (rootDirHandle: FileSystemDirectoryHandle) => {
  const handle = await getGamesJsonFile(rootDirHandle);
  await assertPermissions(handle, "read");
  const file = await handle.getFile();
  const textContent = await file.text();
  const jsonContent = JSON.parse(textContent);
  const { games } = gamesJsonFileSchema.parse(jsonContent);
  return games;
};
