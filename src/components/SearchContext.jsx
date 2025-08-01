import React from "react";
import { createContext, useEffect, useState } from "react";

export const SearchContext = createContext();

export default function ContextSearchProvider({ children }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {}, []);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedCategories,
        setSelectedCategories,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
