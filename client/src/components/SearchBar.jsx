import { useState, useEffect, useRef } from "react";

function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState("");
  const debounceTimer = useRef(null);

  useEffect(() => {
    // Clear any pending timer before setting a new one
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onSearch(keyword);
    }, 400); // waits 400ms after user stops typing

    // Cleanup on unmount or before next effect run
    return () => clearTimeout(debounceTimer.current);
  }, [keyword, onSearch]);

  return (
    <input
      type="text"
      placeholder="Search products..."
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      className="search-bar"
    />
  );
}

export default SearchBar;