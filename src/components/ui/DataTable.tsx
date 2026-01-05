import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (row: T) => string;
  stickyHeader?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T extends object>({
  data,
  columns,
  keyField,
  isLoading = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  onRowClick,
  emptyMessage = 'No data available',
  className = '',
  rowClassName,
  stickyHeader = false,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value = row[col.key as keyof T];
          return String(value).toLowerCase().includes(query);
        })
      );
    }

    // Sort
    if (sortKey && sortDirection) {
      result.sort((a, b) => {
        const aVal = a[sortKey as keyof T];
        const bVal = b[sortKey as keyof T];

        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, columns, searchQuery, sortKey, sortDirection]);

  const getNestedValue = (obj: T, path: string): unknown => {
    return path.split('.').reduce((acc: unknown, part) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj as unknown);
  };

  return (
    <div className={`overflow-hidden rounded-xl border border-cherry-ripe/20 ${className}`}>
      {/* Search */}
      {searchable && (
        <div className="p-4 border-b border-cherry-ripe/10 bg-bark-dark/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-bark-medium border border-cherry-ripe/20 rounded-lg text-sm focus:border-cherry-ripe/50 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full cherry-table">
          <thead className={stickyHeader ? 'sticky top-0 z-10' : ''}>
            <tr className="bg-bark-medium/80 backdrop-blur-sm">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  style={{ width: col.width }}
                  className={`
                    ${col.sortable ? 'cursor-pointer select-none hover:bg-cherry-ripe/10' : ''}
                    ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                  `}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-2">
                    <span>{col.header}</span>
                    {col.sortable && sortKey === String(col.key) && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        {sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4 text-cherry-light" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-cherry-light" />
                        )}
                      </motion.span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12">
                  <LoadingSpinner variant="cherry" size="md" text="Loading data..." />
                </td>
              </tr>
            ) : filteredAndSortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-white/50">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredAndSortedData.map((row, index) => (
                <motion.tr
                  key={String(row[keyField])}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${rowClassName?.(row) || ''}
                  `}
                  onClick={() => onRowClick?.(row)}
                  whileHover={onRowClick ? { backgroundColor: 'rgba(196,30,58,0.05)' } : undefined}
                >
                  {columns.map((col) => {
                    const value = getNestedValue(row, String(col.key));
                    return (
                      <td
                        key={String(col.key)}
                        className={`
                          ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                        `}
                      >
                        {col.render ? col.render(value, row) : String(value ?? '')}
                      </td>
                    );
                  })}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
