import React, { useState } from "react";
// import "./SearchForm.css";

/** Search widget.
 *
 * Appears on CompanyList and JobList so that these can be filtered
 * down.
 *
 * This component doesn't *do* the searching, but it renders the search
 * form and calls the `searchFor` function prop that runs in a parent to do the
 * searching.
 *
 * { CompanyList, JobList } -> SearchForm
 */

function SearchForm({ searchFor }) {
  console.debug("SearchForm", "searchFor=", typeof searchFor);

  const [searchTerm, setSearchTerm] = useState("");

  /** Tell parent to filter */
  function handleSubmit(evt) {
    // take care of accidentally trying to search for just spaces
    evt.preventDefault();
    searchFor(searchTerm.trim() || undefined);
    setSearchTerm(searchTerm.trim());
  }

  /** Update form fields */
  function handleChange(evt) {
    setSearchTerm(evt.target.value);
  }

  return (
      <div className="search-form py-2">
        <form className="flex" onSubmit={handleSubmit}>
          <input
              className="p-2 border border-gray-300 rounded-lg flex-grow focus:outline-none focus:border-blue-500"
              name="searchTerm"
              placeholder="Enter search term.."
              value={searchTerm}
              onChange={handleChange}
          />
          <button type="submit" className="ml-2 p-2 bg-purple-600 text-white rounded-lg">
            Submit
          </button>
        </form>
      </div>
  );
}

export default SearchForm;
