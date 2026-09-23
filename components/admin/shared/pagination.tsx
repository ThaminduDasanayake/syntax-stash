"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  className?: string;
  currentPage: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  totalItems?: number;
  totalPages: number;
}

export function Pagination({
  className,
  currentPage,
  itemsPerPage,
  onPageChange,
  showPageNumbers = true,
  totalItems,
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();

  const startItem =
    totalItems !== undefined && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem =
    totalItems !== undefined && itemsPerPage
      ? Math.min(currentPage * itemsPerPage, totalItems)
      : null;

  return (
    <div
      className={cn(
        "border-line bg-surface/40 flex flex-wrap items-center justify-between gap-3 border-t p-3 font-mono text-xs",
        className,
      )}
    >
      <div className="text-muted-foreground text-[11px]">
        {startItem !== null && endItem !== null && totalItems !== undefined ? (
          <>
            Showing{" "}
            <strong className="text-foreground">
              {startItem}–{endItem}
            </strong>{" "}
            of <strong className="text-foreground">{totalItems}</strong> items (Page{" "}
            <strong className="text-foreground">{currentPage}</strong> of{" "}
            <strong className="text-foreground">{totalPages}</strong>)
          </>
        ) : (
          <>
            Page <strong className="text-foreground">{currentPage}</strong> of{" "}
            <strong className="text-foreground">{totalPages}</strong>
            {itemsPerPage ? ` (${itemsPerPage} per page)` : ""}
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="border-line hover:bg-surface h-8 gap-1 px-2.5 text-xs"
          title="Previous Page"
        >
          <CaretLeftIcon className="size-3.5" />
          <span>Prev</span>
        </Button>

        {showPageNumbers && (
          <div className="flex items-center gap-1 px-1">
            {pageNumbers.map((pageNum) => {
              const isActive = currentPage === pageNum;
              return (
                <Button
                  key={pageNum}
                  size="icon-xs"
                  variant={isActive ? "default" : "outline"}
                  onClick={() => onPageChange(pageNum)}
                  className={cn(
                    "text-xs font-bold transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-line bg-surface/50 text-muted-foreground hover:bg-surface hover:text-foreground",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="border-line hover:bg-surface h-8 gap-1 px-2.5 text-xs"
          title="Next Page"
        >
          <span>Next</span>
          <CaretRightIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
