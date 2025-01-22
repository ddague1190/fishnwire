import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listProducts,
  listCategorizedProducts,
  listProductsByBrand,
} from "../redux/actions/productActions";
import Loader from "../components/utilities/loader/loader.component";
import Message from "../components/utilities/Message";
import Paginate from "../components/utilities/paginate/paginate.component";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import NoProductsFound from "../components/productpresentation/NoProductsFound";

export default function ProductList({ target, ...otherProps }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { error, loading, products, page, pages } = productList;
  let { search } = useLocation();
  let { url_cat, url_subcat, url_brand } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!url_cat && !url_brand && search) {
      dispatch(listProducts(search));
    } else if (url_cat) {
      dispatch(listCategorizedProducts(url_cat, url_subcat, search));
    } else if (url_brand) {
      dispatch(listProductsByBrand(url_brand, search));
    }
  }, [search, url_cat, url_subcat, url_brand]);
  return (
    <div className="bg-white">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : products && products.length > 0 ? (
        <div className="max-w-7xl mx-auto overflow-hidden sm:px-6 lg:px-8">
          <h2 className="sr-only">Products</h2>

          <div className="-mx-px border-l border-gray-200 grid grid-cols-2 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
              <div
                key={index}
                onClick={() => navigate(`/product/${product.slug}`)}
                className="group relative p-4 border-r border-b border-gray-200 sm:p-6 cursor-pointer">
                <div className="rounded-lg overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1 group-hover:opacity-75">
                  <img
                    src={product.image.image}
                    alt={product.name}
                    className="w-full h-full object-center object-cover"
                  />
                </div>
                <div className="pt-10 pb-4 text-center">
                  <h3 className="text-sm font-medium text-gray-900">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                  </h3>
                  <p className="mt-4 text-base text-xs text-blue-800 tracking-widest">
                    {product.variantFacts.numVariants} options from ${product.variantFacts.bottomPrice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <NoProductsFound />
      )}
      <Paginate page={page} pages={pages} />
    </div>
  );
}
