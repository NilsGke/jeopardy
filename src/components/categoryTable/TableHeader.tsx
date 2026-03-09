import { flexRender, type HeaderGroup } from "@tanstack/react-table";

export function TableHeaderComponent<T>({
  headerGroups,
}: {
  headerGroups: HeaderGroup<T>[];
}) {
  return (
    <div className="col-start-1 -col-end-1 grid grid-cols-subgrid border-b-2 p-2 backdrop-blur-md">
      {headerGroups.map((headerGroup) => (
        <div
          key={headerGroup.id}
          className="col-start-1 -col-end-1 grid grid-cols-subgrid"
        >
          {headerGroup.headers.map((header) => (
            <div key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
