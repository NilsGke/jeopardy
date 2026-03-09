import { flexRender, type HeaderGroup } from "@tanstack/react-table";

export function TableFooterComponent<T>({
  footerGroups,
}: {
  footerGroups: HeaderGroup<T>[];
}) {
  return (
    <div className="col-start-1 -col-end-1 grid grid-cols-subgrid border-t-2 px-6">
      {footerGroups.map((footerGroup) => (
        <div
          key={footerGroup.id}
          className="col-start-1 -col-end-1 grid grid-cols-subgrid"
        >
          {footerGroup.headers.map((header) => (
            <div key={header.id} className="flex items-center">
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.footer,
                    header.getContext(),
                  )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
