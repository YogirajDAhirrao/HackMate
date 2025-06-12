// src/pages/Explore.js

import { getUsers } from "../api/user";
import { useSearch } from "../context/SearchContext";
import ProfileCard from "../ui/ProfileCard";
import "./Explore.css";

const Explore = () => {
  const { searchState, setSearchState } = useSearch();

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchState({ ...searchState, error: null });

    try {
      const query = new URLSearchParams();
      if (searchState.skills) query.append("skills", searchState.skills);
      if (searchState.interests)
        query.append("interests", searchState.interests);

      const data = await getUsers(query);
      setSearchState({ ...searchState, users: data });
    } catch (err) {
      setSearchState({ ...searchState, error: err.message, users: [] });
    }
  };

  return (
    <div className="explore-page">
      <h1>Explore Users</h1>
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <label htmlFor="skills">Skills (comma-separated):</label>
          <input
            type="text"
            id="skills"
            value={searchState.skills}
            onChange={(e) =>
              setSearchState({ ...searchState, skills: e.target.value })
            }
            placeholder="e.g., nodejs, typescript"
          />
        </div>
        <div className="form-group">
          <label htmlFor="interests">Interests (comma-separated):</label>
          <input
            type="text"
            id="interests"
            value={searchState.interests}
            onChange={(e) =>
              setSearchState({ ...searchState, interests: e.target.value })
            }
            placeholder="e.g., ai, web development"
          />
        </div>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {searchState.error && (
        <p className="error-message">{searchState.error}</p>
      )}

      <div className="users-list">
        {searchState.users.length > 0 ? (
          searchState.users.map((user) => (
            <ProfileCard user={user} key={user.id} />
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Explore;
