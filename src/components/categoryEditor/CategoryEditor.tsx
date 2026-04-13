import { categorySchema, type Category } from "@/schemas/category";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import SavedStateBadge from "./SavedStateBadge";
import { useDebounce } from "@/hooks/useDebounce";
import { renameCategory, updateCategory } from "@/filesystem/category";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import TagSelector from "./TagSelector";

type CategoryWithoutId = Omit<Category, "id">;

export default function CategoryEditor({
  initialCategory,
  rootDir,
}: {
  initialCategory: Category;
  rootDir: FileSystemDirectoryHandle;
}) {
  const navigate = useNavigate();

  const [category, setCategory] = useState<CategoryWithoutId>(initialCategory);
  const [categoryId, setCategoryId] = useState(initialCategory.id);

  const [debouncedId, debouncingId] = useDebounce(categoryId, 1000);
  const [debouncedCategory, debouncingCategory] = useDebounce(category);

  const categoryIdInputRef = useRef<HTMLInputElement>(null);

  const { mutate: rename, status: renameStatus } = useMutation({
    mutationFn: async (newId: string) => {
      await renameCategory({
        oldId: initialCategory.id,
        newId,
        rootDirHandle: rootDir,
      });

      await navigate({
        to: "/categories/$categoryId",
        params: {
          categoryId: newId,
        },
        replace: true,
        reloadDocument: false,
      });

      if (categoryIdInputRef.current) {
        categoryIdInputRef.current.disabled = false;
        categoryIdInputRef.current.focus();
      }
    },
    onError: (error) => {
      toast.error("Failed to rename category: \n" + error.message);
      console.error(error);
    },
  });

  const { mutate: save, status: savingStatus } = useMutation({
    mutationFn: async (newCategory: Category) => {
      await updateCategory(categoryId, newCategory, rootDir);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  // rename category
  const didMount_id = useRef(false);
  useEffect(() => {
    if (!didMount_id.current) {
      didMount_id.current = true;
      return;
    }

    if (debouncedId === initialCategory.id) return;
    if (!categorySchema.shape.id.safeParse(debouncedId).success) return;

    rename(debouncedId);
  }, [debouncedId]);

  // save category
  const didMount_category = useRef(false);
  useEffect(() => {
    if (!didMount_category.current) {
      didMount_category.current = true;
      return;
    }

    save({ ...debouncedCategory, id: categoryId });
  }, [debouncedCategory]);

  /** no more changes shuld be made to category or id while status is busy */
  const busy = renameStatus === "pending" || savingStatus === "pending";

  return (
    <main>
      {/* Saved State */}
      <SavedStateBadge
        savedState={
          busy || debouncingId || debouncingCategory ? "pending" : savingStatus
        }
      />

      <div className="flex gap-4">
        <Input
          disabled={busy}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          aria-invalid={!categorySchema.shape.id.safeParse(categoryId).success}
          className="w-52"
          ref={categoryIdInputRef}
        />
      </div>

      <section className="flex flex-wrap gap-1">
        <TagSelector
          rootDir={rootDir}
          tags={category.tags}
          setTags={(tags) => setCategory((prev) => ({ ...prev, tags }))}
        />
      </section>
    </main>
  );
}
