import React from "react";

export default function usePaginate() {
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(25);
  const [pages, setPages] = React.useState(0);
  const [canSelectLimit, setCanSelectLimit] = React.useState(false);

  const handleLimit = (limit: number) => {
    setLimit(limit);
  };

  const handlePage = (page: number) => {
    setPage(page);
  };

  const handlePages = React.useCallback((pages: number) => {
    setPages(pages);
  }, []);

  const handleCanSelectLimit = () => {
    setCanSelectLimit((prev) => !prev);
  };

  return {
    page,
    limit,
    pages,
    canSelectLimit,
    handleLimit,
    handlePage,
    handlePages,
    handleCanSelectLimit,
  };
}
