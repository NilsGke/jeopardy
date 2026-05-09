import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import MigrationDialogForm from "./MigrationDialogForm";
import MigrationDialogInfoPanel from "./MigrationDialogInfoPanel";
import {
  runMigration,
  type Migration,
  type MigrationStatusUpdate,
} from "@/filesystem/migrations";

enum Status {
  Before,
  Migrating,
  Error,
  Completed,
}
const titleMap = {
  [Status.Before]: "Are you sure you want to update your Jeopardy directory?",
  [Status.Migrating]: "Updating your jeopardy directory...",
  [Status.Error]: "There was an error!",
  [Status.Completed]: "Update Finished!",
};
const descriptionMap = {
  [Status.Before]: "Caution, please read through the following notice.",
  [Status.Migrating]: "Do not close the browser tab!",
  [Status.Error]:
    "Your jeopardy directory might be broken. Please restore your backup.",
  [Status.Completed]:
    "Please verify that everything is working before deleting your backup.",
};

export default function MigrationDialog({
  migration,
  rootDirectoryHandle,
}: {
  migration: Migration;
  rootDirectoryHandle: FileSystemDirectoryHandle;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(Status.Before);
  const [statusUpdates, setStatusUpdates] = useState<MigrationStatusUpdate[]>(
    [],
  );

  const startMigration = () => {
    setStatus(Status.Migrating);
    runMigration(
      migration,
      rootDirectoryHandle,
      (update) => setStatusUpdates((prev) => [...prev, update]),
      () => setStatus(Status.Completed),
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newState) => {
        if (status === Status.Migrating)
          return toast.warning(
            "You cannot close this window while updating your jeopardy directory",
          );

        setOpen(newState);
      }}
    >
      <DialogTrigger asChild>
        <Button>Upgrade</Button>
      </DialogTrigger>
      <DialogContent
        className="bg-red-500 max-w-2xl! text-white"
        showCloseButton={status !== Status.Migrating}
        style={
          {
            "--primary": "black",
          } as React.CSSProperties
        }
      >
        <DialogHeader>
          <DialogTitle>{titleMap[status]}</DialogTitle>
          <DialogDescription className="text-white">
            {descriptionMap[status]}
          </DialogDescription>
        </DialogHeader>

        {status === Status.Before && (
          <MigrationDialogForm onComplete={() => startMigration()} />
        )}

        {status === Status.Migrating && (
          <MigrationDialogInfoPanel updates={statusUpdates} />
        )}

        {(status === Status.Completed || status === Status.Error) && (
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Ok
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
