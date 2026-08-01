import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function usePaginate(initialLimit?: number) {
  const [pages, setPages] = React.useState(0);
  const [canSelectLimit, setCanSelectLimit] = React.useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlPage = searchParams?.get("page");
  const urlLimit = searchParams?.get("limit");

  const page = urlPage ? Number(urlPage) : 0;

  const limit = urlLimit ? Number(urlLimit) : (initialLimit ?? 25);

  const syncPaginateChange = React.useCallback(
    (page: number, limit: number) => {
      const params = new URLSearchParams(searchParams?.toString());

      params.set("page", String(page));
      params.set("limit", String(limit));

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
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
