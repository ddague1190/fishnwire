import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/utilities/loader/loader.component";
import Message from "../components/utilities/Message";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails } from "../redux/actions/productActions";
import { ProductDetailsDropdowns } from "../components/productpresentation/ProductDetailsDropdowns";
import { QASectionActionProvider } from "../components/utilities/comments/QASectionActionContext.jsx";
import RelatedProducts from "../components/productpresentation/RelatedProducts";
import FeaturesStrip from "../components/productpresentation/FeaturesStrip";

export default function ProductDetails() {
  const dispatch = useDispatch();
  const { loading, error, product } = useSelector(
    (state) => state.productDetails
  );
  const productId = useParams();
  const {user} = useSelector((state) => state.userDetails);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (productId.id !== product.slug) {
      dispatch(listProductDetails(productId.id));
    }
  }, [dispatch, productId.id, product.slug]);

  return (
    <div className="bg-white">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <>
        <div className="pt-6 ">
          <nav
            aria-label="Breadcrumb"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ol className="flex items-center space-x-2">
              <li key={product.category?.slug}>
                <div className="flex items-center">
                  <Link
                    to={`/products/${product.category?.slug}`}
                    className="mr-4 text-sm font-medium text-gray-900">
                    {product.category?.name}
                  </Link>
                  <svg
                    viewBox="0 0 6 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="h-5 w-auto text-gray-300">
                    <path
                      d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </li>
              <li key={product.subcategory?.slug}>
                <div className="flex items-center">
                  <Link
                    to={`/products/${product.category?.slug}/${product.subcategory?.slug}`}
                    className="mr-4 text-sm font-medium text-gray-900">
                    {product.subcategory?.name}
                  </Link>
                  <svg
                    viewBox="0 0 6 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="h-5 w-auto text-gray-300">
                    <path
                      d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </li>

              <li className="text-sm">
                <div aria-current="page" className="font-medium text-gray-300">
                  You are here
                </div>
              </li>
            </ol>
          </nav>
          <div className="mt-8 max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:auto-rows-min lg:gap-x-8">
              {/* Variant specific selection and display
              
              1. pricing section
              2. image display
              3. variant dropdown selections with description and features
              4. size chart substitute for dropdown when necessary 
              
              */}
              <ProductDetailsDropdowns product={product} />
            </div>
          </div>
          <FeaturesStrip details={product.details} />

          <QASectionActionProvider currentUser={user && { name: user.username, avatarUrl: user.avatarUrl }} _comments={product.comments}
          />
          {product.related_products && 
          <RelatedProducts products={product.related_products}/>}
        </div>
        
        </>
      )}
    </div>
  );
}
