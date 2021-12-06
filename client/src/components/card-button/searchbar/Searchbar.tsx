import React, { useState } from "react";
import "./styles.css";
import search from "../../../../public/images/search.svg";
import { useStore } from "../../../context";

export const Searchbar = () => {
  const store = useStore();
  const [query, setQuery] = useState<string | undefined>();
  return (
    <div id="searchbar_container">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSubmit={() => store.filters.search = query}
        id="searchbar_container__input"
        type="text"
        placeholder="Search"
      />
      <button id="searchbar_container__btn" type="submit" onClick={() => store.filters.search = query}>
        <img src={search} />
      </button>
    </div>
  );
};
