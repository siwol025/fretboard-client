import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange, generatePageNumbers }) {
  // 페이지가 없거나 1페이지만 있는 경우 페이지네이션 표시하지 않음
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-1 mt-8">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">이전 페이지</span>
      </Button>

      {generatePageNumbers(currentPage + 1, totalPages).map((page, idx) => (
        <Button
          key={idx}
          variant="outline"
          size="sm"
          className={`w-9 h-9 ${
            page === currentPage + 1
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : page === "..."
                ? "pointer-events-none"
                : ""
          }`}
          onClick={() => typeof page === "number" && onPageChange(page - 1)}
          disabled={page === "..."}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">다음 페이지</span>
      </Button>
    </div>
  );
}