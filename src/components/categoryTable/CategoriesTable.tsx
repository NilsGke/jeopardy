import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { TableBodyComponent } from "./TableBody";
import { TableHeaderComponent } from "./TableHeader";
import { TableFooterComponent } from "./TableFooter";
import { searchAndTagFilter, type FilterValue } from "./filter";
import { useMemo, useState } from "react";
import DeleteCategoryDialog from "../DeleteCategoryDialog";

interface CategoriesTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchTerm: string;
  selectedTags: string[];
  refreshRows: () => void;
}
export interface CategoriesTableMeta {
  showDeleteCategoryPopover: (categoryId: string) => void;
}

export function CategoriesTable<TData, TValue>({
  columns,
  data,
  searchTerm,
  selectedTags,
  refreshRows,
}: CategoriesTableProps<TData, TValue>) {
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  const globalFilter = useMemo(
    () => ({ searchTerm, selectedTags }) satisfies FilterValue,
    [searchTerm, selectedTags],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: searchAndTagFilter,
    state: { globalFilter },
    meta: {
      showDeleteCategoryPopover: (categoryId) =>
        setDeleteCategoryId(categoryId),
    } satisfies CategoriesTableMeta,
  });

  return (
    <div className="h-full max-h-[inherit] min-h-0 max-w-dvw">
      <div className="relative flex h-full flex-wrap-reverse items-end xl:justify-start justify-center gap-x-5 gap-y-2">
        <div
          className="grid h-full max-w-full grid-rows-[auto_1fr_auto] overflow-x-auto rounded-md border lg:min-w-3xl"
          style={{ gridTemplateColumns: `repeat(${columns.length}, auto)` }}
        >
          <TableHeaderComponent headerGroups={table.getHeaderGroups()} />
          <TableBodyComponent rows={table.getRowModel().rows} />
          <TableFooterComponent footerGroups={table.getFooterGroups()} />
        </div>
      </div>

      {deleteCategoryId !== null && (
        <DeleteCategoryDialog
          categoryId={deleteCategoryId}
          trigger={null}
          open={true}
          onOpenChange={() => {
            refreshRows();
            setDeleteCategoryId(null);
          }}
        />
      )}
    </div>
  );
}
