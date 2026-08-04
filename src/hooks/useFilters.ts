import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "./useDebounce";

export function useFilters<T extends Record<string, string>>(initial: T) {
  const [search, setSearch] = useState("");
  const [values, setValues] = useState<T>(initial);
  const debouncedSearch = useDebounce(search);

  const setFilter = useCallback((key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }) as T);
  }, []);

  const reset = useCallback(() => {
    setSearch("");
    setValues(initial);
  }, [initial]);

  const isFiltering = useMemo(
    () => Boolean(debouncedSearch) || Object.entries(values).some(([key, value]) => value !== initial[key]),
    [debouncedSearch, values, initial],
  );

  return { search, setSearch, debouncedSearch, values, setFilter, reset, isFiltering };
}
