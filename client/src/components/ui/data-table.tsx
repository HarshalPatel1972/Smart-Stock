import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  keyAccessor: keyof T;
  emptyMessage?: string;
  pagination?: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    onPageChange: (pageIndex: number) => void;
  };
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  keyAccessor,
  emptyMessage = "No data available",
  pagination,
}: DataTableProps<T>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={String(item[keyAccessor])}>
                {columns.map((column, columnIndex) => (
                  <TableCell key={columnIndex}>
                    {column.cell
                      ? column.cell(item)
                      : typeof column.accessor === 'function'
                        ? column.accessor(item)
                        : String(item[column.accessor])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
              disabled={pagination.pageIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
              disabled={pagination.pageIndex === pagination.pageCount - 1}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {pagination.pageIndex * pagination.pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(
                    (pagination.pageIndex + 1) * pagination.pageSize,
                    data.length
                  )}
                </span>{' '}
                of <span className="font-medium">{data.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-l-md"
                  onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
                  disabled={pagination.pageIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-r-md ml-2"
                  onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
                  disabled={pagination.pageIndex === pagination.pageCount - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
