import Changelog from "@/components/Changelog";
import JeopardyDirectoryChooser from "@/components/JeopardyDirectoryChooser";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="flex flex-col gap-6">
      <JeopardyDirectoryChooser />
      <Changelog />
    </div>
  );
}
