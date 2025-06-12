import { createContext, useContext, useState } from "react";

const SearchContext = createContext();
export const SearchProvider = ({ children }) => {
  const [searchState, setSearchState] = useState({
    skills: "",
    interests: "",
    users: [],
    error: null,
  });

  return (
    <SearchContext.Provider value={{ searchState, setSearchState }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
