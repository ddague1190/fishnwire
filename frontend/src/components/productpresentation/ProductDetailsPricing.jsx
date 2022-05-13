import React from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProductDetailsPricing = ({ currVariant, name }) => {
  const navigate = useNavigate();
  const productId = useParams();
  const { userInfo } = useSelector((state) => state.userDetails);
  const loginAndComeBack = () => {
    navigate(`/login?redirect=/product/${productId.id}`);
  };
  return (
    <section className="lg:col-start-8 lg:col-span-5">
      <div className="flex justify-between">
        <div className="flex flex-col w-full gap-3">
          <h1 className="text-center w-full text-3xl text-gray-900 font-extrabold">{name}</h1>
          {currVariant && (
            <dl className="flex flex-row items-center gap-2  ">
              <dt className="text-xs text-gray-500">ID:</dt>
              <dd className="text-sm font-semibold ">{currVariant.identifier}</dd>
            </dl>
          )}
        </div>
        {currVariant && (
          <div className="flex flex-col justify-between items-center h-20 bg-blue-50 p-2 rounded-md">
            <p
              className={`${
                userInfo ? "line-through text-sm" : "text-xl"
              } font-medium text-grey-500`}>
              ${currVariant.price}
            </p>

            <p className="text-center">
              {userInfo ? (
                <span className="text-xl font-medium text-grey-800">
                  ${currVariant.discountPrice}
                </span>
              ) : (
                <span
                  onClick={loginAndComeBack}
                  className={`${
                    !currVariant ? "hidden" : "block"
                  } font-xs w-24 leading-none text-blue-600 text-xs cursor-pointer`}>
                  Login to see your price
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetailsPricing;
