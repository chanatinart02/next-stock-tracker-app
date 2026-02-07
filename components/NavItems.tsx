"use client";

import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchCommand from "./SearchCommand";

const NavItems = ({ initialStocks }: { initialStocks: StockWithWatchlistStatus[] }) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";

    return pathname.startsWith(path);
  };
  return (
    <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
      {NAV_ITEMS.map(({ href, label }) => {
        // Check if the label is "Search" to render the SearchCommand component
        if (label === "Search")
          return (
            <li key="search-trigger">
              <SearchCommand renderAs="text" label="Search" initialStocks={initialStocks} />
            </li>
          );

        // Otherwise, render a standard navigation link
        return (
          <li key={href}>
            <Link
              href={href}
              className={`hover:text-yellow-500 transition-colors ${
                isActive(href) ? "text-gray-100" : ""
              }`}>
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
export default NavItems;
