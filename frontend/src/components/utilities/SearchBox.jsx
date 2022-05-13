import { SearchIcon } from "@heroicons/react/solid";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateKeyword } from "../../redux/actions/routeActions";

export const SearchBox = () => {
  const [keyword, setKeyword] = useState("");

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateKeyword(keyword));
    navigate(`/products/?keyword=${keyword}`);
  };
  return (
    <div className="mt-10">
      <div className="flex justify-center w-full">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="search"
            name="search"
            className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md rounded-r-none leading-5 bg-gray-50 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 sm:text-sm"
            placeholder="Search all products ..."
            type="search"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={submitHandler}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md rounded-l-none text-whitehover:bg-indigo-700 focus:outline-none focus:ring-2 bg-blue-800 text-white focus:ring-offset-2 focus:ring-indigo-500">
        Go
        </button>
      </div>
    </div>
  );
};
