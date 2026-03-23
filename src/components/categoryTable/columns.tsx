import type { Category } from "@/schemas/category";
import {
  createColumnHelper,
  type IdentifiedColumnDef,
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUpDownIcon,
  Delete02Icon,
  TestTube01Icon,
  Edit03Icon,
  TagIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "../ui/badge";
import { ButtonGroup } from "../ui/button-group";
import { Link } from "@tanstack/react-router";
import type { CategoriesTableMeta } from "./CategoriesTable";
import type { ReactNode } from "react";

const columnHelper = createColumnHelper<Category>();

function generateSortedHeader(
  title: ReactNode,
): IdentifiedColumnDef<Category, number | string | string[] | null>["header"] {
  return ({ column, header }) => {
    const sorted = header.column.getIsSorted();
    return (
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {title}
        <div className="size-4">
          {sorted === "desc" && (
            <HugeiconsIcon icon={ArrowUpIcon} className="size-full" />
          )}
          {sorted === "asc" && (
            <HugeiconsIcon icon={ArrowDownIcon} className="size-full" />
          )}
          {!sorted && (
            <HugeiconsIcon
              icon={ArrowUpDownIcon}
              className="size-full text-zinc-300 dark:text-zinc-600"
            />
          )}
        </div>
      </Button>
    );
  };
}

export const columns = [
  columnHelper.accessor("id", {
    header: generateSortedHeader("Name"),
    cell: (info) => <div className="whitespace-nowrap">{info.getValue()}</div>,
  }),
  columnHelper.accessor("tags", {
    header: generateSortedHeader(
      <div>
        <HugeiconsIcon icon={TagIcon} className="inline mr-1" />
        Tags
      </div>,
    ),
    cell: (info) => (
      <div className="flex gap-x-2 gap-y-px flex-wrap size-full items-center">
        {info.getValue().map((tag) => (
          <Badge variant="tag" key={tag}>
            {tag}
          </Badge>
        ))}
      </div>
    ),
  }),

  columnHelper.display({
    id: "actions",
    cell: (info) => {
      const categoryId = info.row
        .getAllCells()
        .find((c) => c.column.id === "id")
        ?.getValue() as Category["id"] | undefined;

      if (categoryId === undefined) {
        console.warn("categoryId is undefined, this should never happen");
        return "?";
      }

      return (
        <ButtonGroup>
          <Button size="icon" variant="outline" title="Edit" asChild>
            <Link to="/categories/$categoryId" params={{ categoryId }}>
              <HugeiconsIcon icon={Edit03Icon} />
            </Link>
          </Button>

          <Button size="icon" variant="outline" title="Test">
            <HugeiconsIcon icon={TestTube01Icon} />
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="hover:text-red-500 hover:bg-red-50"
            onClick={() =>
              (
                info.table.options.meta as CategoriesTableMeta
              ).showDeleteCategoryPopover(categoryId)
            }
          >
            <HugeiconsIcon icon={Delete02Icon} />
          </Button>
        </ButtonGroup>
      );
    },
  }),
];
