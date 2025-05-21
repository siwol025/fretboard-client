export function generatePageNumbers(current, total) {
  const maxButtons = 9;
  const pages = [];

  if (total <= maxButtons) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  const showLeftDots = current > 4;
  const showRightDots = current < total - 3;

  if (!showLeftDots && showRightDots) {
    for (let i = 1; i <= 7; i++) pages.push(i);
    pages.push("...");
    pages.push(total);
  } else if (showLeftDots && !showRightDots) {
    pages.push(1);
    pages.push("...");
    for (let i = total - 6; i <= total; i++) pages.push(i);
  } else if (showLeftDots && showRightDots) {
    pages.push(1);
    pages.push("...");
    for (let i = current - 2; i <= current + 2; i++) pages.push(i);
    pages.push("...");
    pages.push(total);
  }

  return pages;
}
