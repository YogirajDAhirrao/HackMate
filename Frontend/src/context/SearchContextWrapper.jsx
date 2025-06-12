// src/context/SearchContextWrapper.js
import { SearchProvider } from "./SearchContext";
import { Outlet } from "react-router-dom"; // Import Outlet

const SearchContextWrapper = () => {
  return (
    <SearchProvider>
      <Outlet /> {/* Render child routes */}
    </SearchProvider>
  );
};

export default SearchContextWrapper;
