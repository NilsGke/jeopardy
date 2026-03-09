import type { FilterFn } from "@tanstack/react-table";

export type FilterValue = {
  searchTerm?: string;
  selectedTags?: string[];
};

export const searchAndTagFilter: FilterFn<any> = (
  row,
  _columnId,
  value: FilterValue,
) => {
  const { id, tags } = row.original;

  const search = value?.searchTerm?.toLowerCase().trim() ?? "";
  const selectedTags = value?.selectedTags ?? [];

  const matchesSearch = !search || id.toLowerCase().includes(search);

  const matchesTags =
    selectedTags.length === 0 ||
    selectedTags.every((tag) => tags.includes(tag));

  return matchesSearch && matchesTags;
};
