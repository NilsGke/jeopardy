import Changelog from "@/components/Changelog";
import JeopardyDirectoryChooser from "@/components/JeopardyDirectoryChooser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { deleteSetting } from "@/db/settings";
import { useRootDir } from "@/providers/RootProvider";
import { Directory, GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const rootDir = useRootDir();

  return (
    <div className="flex gap-6 flex-col justify-center items-center size-full">
      {rootDir && (
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <div>
              <Link to="/">Categories</Link>
              <Link to="/">Boards</Link>
              <Link to="/">Games</Link>
            </div>
          </CardContent>
        </Card>
      )}

      {!rootDir && <JeopardyDirectoryChooser />}

      <Changelog />

      <Card>
        <CardContent className="flex gap-4 flex-wrap">
          <Button
            variant="outline"
            onClick={() =>
              deleteSetting("rootDir").then(() => window.location.reload())
            }
          >
            <HugeiconsIcon icon={Directory} /> Change Jeopardy Directory
          </Button>

          <Button variant="outline" asChild>
            <a href="https://github.com/NilsGke/jeopardy" target="_blank">
              <HugeiconsIcon strokeWidth={2} icon={GithubIcon} />
              GitHub
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
