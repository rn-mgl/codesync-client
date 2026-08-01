import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function usePaginate(paginate: { page: number; limit: number }) {
  const [pages, setPages] = React.useState(0);
  const [canSelectLimit, setCanSelectLimit] = React.useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const page = Number.isNaN(paginate.page) ? 0 : paginate.page;
  const limit = Number.isNaN(paginate.limit) ? 25 : paginate.limit;

  const syncPaginateChange = React.useCallback(
    (page: number, limit: number) => {
      const params = new URLSearchParams(window.location.search);

      params.set("page", String(page));
      params.set("limit", String(limit));

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const handleLimit = (limit: number) => {
    syncPaginateChange(page, limit);
  };

  const handlePage = (page: number) => {
    syncPaginateChange(page, limit);
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
