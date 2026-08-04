import { FilterX } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchInput } from "./SearchInput";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDefinition {
  key: string;
  label: string;
  options: FilterOption[];
}

interface FilterBarProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterDefinition[];
  values?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onReset?: () => void;
  children?: ReactNode;
}

export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder,
  filters = [],
  values = {},
  onFilterChange,
  onReset,
  children,
}: FilterBarProps) {
  const hasActive = Boolean(search) || filters.some((f) => values[f.key] && values[f.key] !== "all");

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-3 md:flex-row md:items-center">
      {onSearchChange && (
        <SearchInput
          value={search ?? ""}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          className="md:max-w-xs"
        />
      )}

      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={values[filter.key] ?? "all"}
          onValueChange={(value) => onFilterChange?.(filter.key, value)}
        >
          <SelectTrigger className="rounded-xl md:w-[180px]" aria-label={filter.label}>
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">{filter.label}: todos</SelectItem>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {children}

      {hasActive && onReset && (
        <Button variant="ghost" className="rounded-xl md:ml-auto" onClick={onReset}>
          <FilterX className="mr-2 h-4 w-4" /> Limpar filtros
        </Button>
      )}
    </div>
  );
}
