import { db } from "../indexedDB/db.ts";
import { useQuery } from "@tanstack/react-query";

export default function DirectoryChooser() {
  const { data: recentDirectories } = useQuery({
    queryKey: [],
    queryFn: async () => await db.jeopardyDirectories.toArray(),
  });

  return (
    <div>
      <h2>Recent Directories</h2>
      {recentDirectories && recentDirectories.map((entry) => entry.id)}
      <button>Select new</button>
    </div>
  );
}
