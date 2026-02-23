import JeopardyDirectoryChooser from "@/components/JeopardyDirectoryChooser";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return <JeopardyDirectoryChooser />;
}
