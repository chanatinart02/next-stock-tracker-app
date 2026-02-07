"use client";

import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchCommand({
  renderAs = "button",
  label = "Add stock",
  initialStocks,
}: SearchCommandProps) {
  const [open, setOpen] = useState(false); // Controls dialog open or closed
  const [searchTerm, setSearchTerm] = useState(""); // User's search input
  const [loading, setLoading] = useState(false); // Loading state during fetching results
  // The list of stocks currently shown in the UI
  // Starts with initialStocks (e.g. popular stocks)
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode = !!searchTerm.trim(); // If the user typed something (non-empty string), we are in "search mode"
  // If not searching, only show first 10 stocks (e.g. popular list)
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  // Keyboard shortcut: Cmd+K (Mac) or Ctrl+K (Windows/Linux) to open/close dialog
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    // Cleanup listener when component unmounts
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSearch = async () => {
    // If input is empty → reset to initial stocks
    if (!isSearchMode) return setStocks(initialStocks);

    setLoading(true);
    try {
      // Call server action to search stocks by keyword
      const results = await searchStocks(searchTerm.trim());
      setStocks(results);
    } catch {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce the search function so we don't call API on every keystroke
  // It waits 300ms after user stops typing
  const debouncedSearch = useDebounce(handleSearch, 300);

  // Whenever searchTerm changes, trigger the debounced search
  useEffect(() => {
    debouncedSearch();
  }, [searchTerm]);

  // When user clicks a stock:
  // - close dialog
  // - reset search input
  // - reset stock list back to initial
  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  };

  return (
    <>
      {/* Render either as text link or button */}
      {renderAs === "text" ? (
        <span onClick={() => setOpen(true)} className="search-text">
          {label}
        </span>
      ) : (
        <Button onClick={() => setOpen(true)} className="search-btn">
          {label}
        </Button>
      )}
      {/* Dialog (modal) */}
      <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
        <div className="search-field">
          {/* Search input */}
          <CommandInput
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Search stocks..."
            className="search-input"
          />
          {/* Show spinner while loading */}
          {loading && <Loader2 className="search-loader" />}
        </div>
        {/* Search results */}
        <CommandList className="search-list">
          {loading ? (
            <CommandEmpty className="search-list-empty">Loading stocks...</CommandEmpty>
          ) : displayStocks?.length === 0 ? (
            <div className="search-list-indicator">
              {isSearchMode ? "No results found" : "No stocks available"}
            </div>
          ) : (
            <ul>
              {/* Show "Search results" or "Popular stocks" */}
              <div className="search-count">
                {isSearchMode ? "Search results" : "Popular stocks"}
                {` `}({displayStocks?.length || 0})
              </div>
              {/* Show list of stocks */}
              {displayStocks?.map((stock, i) => (
                <li key={stock.symbol} className="search-item">
                  <Link
                    href={`/stocks/${stock.symbol}`}
                    onClick={handleSelectStock}
                    className="search-item-link">
                    {/* icon */}
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    {/* stock info */}
                    <div className="flex-1">
                      <div className="search-item-name">{stock.name}</div>
                      <div className="text-sm text-gray-500">
                        {stock.symbol} | {stock.exchange} | {stock.type}
                      </div>
                    </div>
                    {/*<Star />*/}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
