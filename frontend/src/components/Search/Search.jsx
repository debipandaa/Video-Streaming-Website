import searchsvg from "../../assets/search_icon.svg";
import { createPortal } from "react-dom";
import { useState } from "react";
import "./Search.css";

const Search = ({ onclick }) => {
  const [input, setinput] = useState("");
  const fetchsearch = (value) => {
    fetch("http://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
      });
  };
  const handlechange = (value) => {
    setinput(value);
    fetchsearch(value);
  };
  return createPortal(
    <div className="search-container" onClick={onclick}>
      <div onClick={(e) => e.stopPropagation()}>
        <img src={searchsvg} alt="Search Icon" />
        <input
          placeholder="Search"
          value={input}
          onChange={(e) => handlechange(e.target.value)}
          type="text"
        />
      </div>
    </div>,
    document.getElementById("search-overlay")
  );
};

export default Search;
