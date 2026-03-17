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
  PencilEditIcon,
  MoreIcon,
  MoreHorizontalIcon,
  Delete02Icon,
  TestTube01Icon,
  Edit02Icon,
  Edit03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "../ui/badge";
import { searchAndTagFilter } from "./filter";
import { ButtonGroup } from "../ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const columnHelper = createColumnHelper<Category>();

function generateSortedHeader(
  colName: string,
): IdentifiedColumnDef<Category, number | string | string[] | null>["header"] {
  return ({ column, header }) => {
    const sorted = header.column.getIsSorted();
    return (
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {colName}
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
    header: generateSortedHeader("Tags"),
    cell: (info) => (
      <div className="flex gap-x-2 gap-y-px flex-wrap size-full items-center">
        {info.getValue().map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    ),
  }),

  columnHelper.display({
    id: "actions",
    cell: () => (
      <ButtonGroup>
        <Button size="icon" variant="outline" title="Edit">
          <HugeiconsIcon icon={Edit03Icon} />
        </Button>

        <Button size="icon" variant="outline" title="Test">
          <HugeiconsIcon icon={TestTube01Icon} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" aria-label="More Options">
              <HugeiconsIcon icon={MoreHorizontalIcon} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-40">
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <HugeiconsIcon icon={Delete02Icon} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    ),
  }),
];
