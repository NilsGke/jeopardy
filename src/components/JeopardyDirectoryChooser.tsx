import { setSetting } from "@/db/settings";
import { toast } from "sonner";
import { Directory } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Toaster } from "./ui/sonner";

export default function DirectoryChooser() {
  const storeDirectoryInSettings = async () => {
    if (!("showDirectoryPicker" in window))
      return toast.error(
        "Seems like your browser does not support the FilesystemAPI. Please use a browser that has support (eg Chrome / any chromium browser)",
        {
          duration: Infinity,
          className: "bg-red-400! w-120!",
          action: {
            label: "see supported browsers",
            onClick: () =>
              window.open("https://caniuse.com/filesystem", "_blank"),
          },
        },
      );

    const rootDirHandle = await window.showDirectoryPicker().catch(() => null);
    if (!rootDirHandle) return toast.error("No directory selected");

    const prom = setSetting("rootDir", rootDirHandle);

    toast.promise(prom, {
      loading: "Storing Directory",
      error: "Error while storing directory",
      success: "Directory stored",
    });

    window.location.reload();
  };

  return (
    <Card className="w-max">
      <Toaster />
      <CardHeader>
        <h2 className="text-3xl font-bold">Choose your Jeopardy-Directory</h2>
      </CardHeader>
      <CardContent className="space-y-3">
        <p>
          This web app needs stores all data on your device.
          <br />
          Please select a location to store the data in or select previously
          created jeopardy directories.
          <br />
          No data ever leaves your device.
        </p>
        <Button onClick={storeDirectoryInSettings}>
          Select Jeopardy Directory <HugeiconsIcon icon={Directory} />
        </Button>
      </CardContent>
    </Card>
  );
}
