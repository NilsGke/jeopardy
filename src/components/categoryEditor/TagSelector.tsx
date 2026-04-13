import { Button } from "../ui/button";
import { tagSchema, type Category, type Tag } from "@/schemas/category";
import { useState } from "react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "../ui/combobox";
import { useQuery } from "@tanstack/react-query";
import { getAllCategoryIds, getCategory } from "@/filesystem/category";
import { toast } from "sonner";

export default function TagSelector({
  tags,
  setTags,
  rootDir,
}: {
  tags: Tag[];
  setTags: (newTags: Tag[]) => void;
  rootDir: FileSystemDirectoryHandle;
}) {
  const [searchValue, setSearchValue] = useState("");
  const anchor = useComboboxAnchor();

  const {
    data: existingTags,
    refetch: loadTags,
    isLoading,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const ids = await getAllCategoryIds(rootDir);
      const categories = await Promise.allSettled(
        ids.map((id) => getCategory(id, rootDir)),
      );
      const validCategories: Category[] = [];
      const invalidCategories: any[] = [];
      categories.forEach((promise) => {
        if (promise.status === "fulfilled") validCategories.push(promise.value);
        else invalidCategories.push(promise.reason);
      });

      if (invalidCategories.length > 0) {
        console.error("invalid categories:");
        invalidCategories.forEach((error) => console.error(error));
      }

      const tags = new Set<string>();
      validCategories.forEach((category) =>
        category.tags.forEach((tag) => tags.add(tag)),
      );
      return [...tags.keys()].toSorted();
    },
    throwOnError: true,
    enabled: false,
    retry: false,
  });

  const createTag = () => {
    const res = tagSchema.safeParse(searchValue);
    if (!res.success)
      return toast.error("Invalid Tag value: " + res.error.message);

    setTags([...tags, res.data]);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Combobox
        multiple
        autoHighlight
        items={existingTags}
        value={tags}
        inputValue={searchValue}
        onInputValueChange={(value) => setSearchValue(value)}
        onValueChange={(tags) => setTags(tags)}
        onOpenChange={(open) => open && loadTags()}
      >
        <ComboboxChips
          ref={anchor}
          className="w-full rounded-md max-w-xs"
          onKeyDown={(event) => event.key === "Enter" && createTag()}
        >
          <ComboboxValue>
            {(values) => (
              <>
                {values.map((value: string) => (
                  <ComboboxChip
                    className="bg-tag text-white [&>button]:bg-tag! [&>button>svg]:text-white!"
                    key={value}
                  >
                    {value}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>
            {isLoading
              ? "Loading Tags..."
              : searchValue.trim().length > 1 && (
                  <Button variant="outline" onClick={createTag}>
                    Create tag{" "}
                    <span className="bg-tag py-0.5 px-2 rounded-full text-white">
                      {searchValue}
                    </span>
                  </Button>
                )}
          </ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem
                key={item}
                value={item}
                className="data-highlighted:bg-zinc-100! data-highlighted:text-black! data-highlighted:[&>span>svg>path]:text-zinc-500!"
              >
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
