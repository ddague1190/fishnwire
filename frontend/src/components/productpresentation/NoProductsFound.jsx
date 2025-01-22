import { SearchBox } from "../utilities/SearchBox";

import { BrowseCategories } from "../promotional/BrowseCategories";
export default function NoProductsFound() {
  return (
    <div className="text-center mt-28">
      <p className="mt-2 text-xl font-medium text-gray-900">
        Sorry, no products found
      </p>
      <SearchBox />
      <BrowseCategories />
    </div>
  );
}
