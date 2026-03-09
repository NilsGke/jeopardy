import type { Category } from "@/schemas/category";
import { flexRender, type RowModel } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

const itemSize = 50;

export function TableBodyComponent({
  rows,
}: {
  rows: RowModel<Category>["rows"];
}) {
  // scroll virtualization
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemSize,
    overscan: 10,
    initialRect: {
      width: 0,
      // server-render 20 (+ 10 overscan) items by default to avoid empty table on client
      height: itemSize * 20,
    },
  });

  return (
    <div
      ref={parentRef}
      className="col-start-1 -col-end-1 row-start-2 grid max-h-full grid-cols-subgrid overflow-x-hidden overflow-y-auto"
    >
      <div
        className="col-start-1 -col-end-1 grid grid-cols-subgrid grid-rows-subgrid"
        style={{
          // using padding here since we cannot change the size of a grid element
          // subtracting one element height, since this elements heigth is exactly one elemeht height
          paddingBottom: `${rowVirtualizer.getTotalSize() - itemSize}px`,
        }}
      >
        {rows?.length ? (
          rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const row = rows[virtualItem.index];
            return (
              <div
                key={row.id}
                className="col-start-1 -col-end-1 grid grid-cols-subgrid"
                data-state={row.getIsSelected() && "selected"}
                style={{
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className="flex items-center justify-center border-b px-6"
                    style={{
                      height: `${virtualItem.size}px`,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          })
        ) : (
          <div className="col-start-1 -col-end-1 h-24 text-center">
            No results.
          </div>
        )}
      </div>
    </div>
  );
}
