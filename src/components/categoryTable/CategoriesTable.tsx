import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { TableBodyComponent } from "./TableBody";
import { TableHeaderComponent } from "./TableHeader";
import { TableFooterComponent } from "./TableFooter";

interface CategoriesTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function CategoriesTable<TData, TValue>({
  columns,
  data,
}: CategoriesTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="h-full max-h-[inherit] min-h-0 max-w-dvw">
      <div className="relative flex h-full flex-wrap-reverse items-end xl:justify-start justify-center gap-x-5 gap-y-2">
        <div className="grid h-full max-w-full grid-cols-[1fr_repeat(5,auto)] grid-rows-[auto_1fr_auto] overflow-x-auto rounded-md border lg:max-w-[80%]">
          <TableHeaderComponent headerGroups={table.getHeaderGroups()} />
          <TableBodyComponent rows={table.getRowModel().rows} />
          <TableFooterComponent footerGroups={table.getFooterGroups()} />
        </div>
      </div>
    </div>
  );
}
