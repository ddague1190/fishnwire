import React from "react";
import { Link } from "react-router-dom";

const ProductListElement = ({ product, index }) => {
  return (
    <li key={index} className="flex py-6 sm:py-2 rounded-md">
      <div className="flex-shrink-0">
        <img
          src={product.variantInfo.image || product.productInfo.image.image}
          alt={product.productInfo.name}
          className="w-24 h-24 rounded-lg object-center object-contain sm:w-20 sm:h-12"
        />
      </div>

      <div className="relative ml-4 flex-1 flex flex-col justify-between sm:ml-6">
        <div>
          <div className="flex justify-between sm:grid sm:grid-cols-2">
            <dl className="pr-6">
              <dt className="text-sm">
                <Link
                  to={`/product/${product.productInfo.slug}`}
                  className="font-medium text-gray-700 hover:text-gray-800">
                  {product.productInfo.name}
                </Link>
              </dt>

              {product.variantInfo.title ? (
                <dd className="mt-1 text-sm text-gray-500">
                  {product.variantInfo.title}
                </dd>
              ) : null}
              {product.variantInfo.type &&
              product.variantInfo.type != product.variantInfo.title ? (
                <dd className="mt-1 text-sm text-gray-500">
                  Type: {product.variantInfo.title}
                </dd>
              ) : null}
              {product.variantInfo.material ? (
                <dd className="mt-1 text-sm text-gray-500">
                  Type: {product.variantInfo.material}
                </dd>
              ) : null}
              {product.variantInfo.pack ? (
                <dd className="mt-1 text-sm text-gray-500">
                  Type: {product.variantInfo.pack}
                </dd>
              ) : null}
            </dl>
            <div className="mt-4 flex items-center sm:block sm:top-0 sm:mt-0">
              <div className="text-sm font-medium text-gray-900 text-right">
                <span className="text-xs font-normal">Per pack: </span>$
                {product.variantInfo.discountPrice}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center sm:block sm:absolute sm:top-0 sm:left-1/2 sm:mt-0">
            <div className="flex flex-row gap-2 items-center">
              <span className="text-xs">Qty ordered:</span>
              <span>{product.qty}</span>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ProductListElement;
