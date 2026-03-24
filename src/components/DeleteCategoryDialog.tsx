import { HugeiconsIcon } from "@hugeicons/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { deleteCategory } from "@/filesystem/category";
import { useRootDir } from "@/providers/RootProvider";
import WaitButton from "./WaitButton";

interface Props {
  categoryId: string;
  trigger?: ReactNode;
}

interface ControlledProps {
  open: boolean;
  onOpenChange: (newOpenState: boolean) => void;
}

type Uncontrolled = Props;
type Controlled = Props & ControlledProps;

const isControlled = (obj: Uncontrolled | Controlled): obj is Controlled =>
  (obj as Controlled).open !== undefined;

export default function DeleteCategoryDialog(props: Controlled | Uncontrolled) {
  const { categoryId, trigger } = props;
  const controlled = isControlled(props);
  const ownState = useState(controlled ? props.open : false);
  const [open, setOpen] = controlled
    ? [props.open, props.onOpenChange]
    : ownState;

  const rootDir = useRootDir();

  const del = useCallback(() => {
    if (rootDir === null) return toast.error("root directory not loaded yet");
    const prom = deleteCategory(categoryId, rootDir);
    toast.promise(prom, {
      loading: `Deleting Category "${categoryId}"`,
      success: "Category Deleted",
      error: "Error deleting category",
    });
    prom.then(() => setOpen(false));
  }, [rootDir, categoryId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger !== undefined ? (
          trigger
        ) : (
          <Button variant="destructive">
            <HugeiconsIcon icon={Delete02Icon} /> Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            <b>You are about to delete "{categoryId}"!</b>
            <br />
            Deleting a category can not be undone. <br />
            This action will remove the category and its asociated files from
            your filesystem
          </DialogDescription>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <WaitButton
              variant="destructive"
              className="[&.ready]:text-white [&.ready]:bg-red-400"
              callback={del}
              idleText="Delete"
              readyText="Delete forever!"
            />
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
