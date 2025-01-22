import React, { useState, useEffect } from "react";
import Loader from "../components/utilities/loader/loader.component";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../redux/actions/orderActions";
import { ORDER_CREATE_RESET } from "../redux/constants/orderConstants";
import CheckoutSteps from "../components/utilities/CheckoutSteps";
import { Link } from "react-router-dom";
import AddressBox from "../components/utilities/addressbox/addressbox.component";
import { CheckIcon, ClockIcon } from "@heroicons/react/solid";

const PlaceOrder = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [GroupedCartItems, setGroupedCartItems] = useState({
    inStock: [],
    notInStock: [],
  });

  let { order, error, success } = useSelector((state) => state.orderCreate);
  const cart = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setGroupedCartItems({
      notInStock: cart.cartItems.filter((el) => el.countInStock < el.qty),
      inStock: cart.cartItems.filter((el) => el.countInStock >= el.qty),
    });
  }, [cart]);

  cart.itemsPrice = cart.cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);

  cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2);

  cart.taxPrice = (0.082 * cart.itemsPrice).toFixed(2);

  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.taxPrice) +
    Number(cart.shippingPrice)
  ).toFixed(2);

  useEffect(() => {
    if (!cart.shippingAddress) {
      console.log("noaddress");
      navigate("/shipping/");
    } else if (cart.cartItems.length === 0) {
      navigate("/");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    } else if (success) {
      navigate(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    } else if (error?.includes("token not valid")) {
      dispatch(logout());
      navigate("/login/");
    }
    return () => setShowLoading(false);
  }, [error, success, dispatch, navigate, cart]);

  const submitHandler = () => {
    setShowLoading(true);
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        instructions: instructions,
      })
    );
  };

  return (
    <div className="bg-white mt-6">
      {showLoading && <Loader />}
      <CheckoutSteps step1="complete" step2="complete" step3="current" />
      <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Checkout
        </h1>
        {GroupedCartItems["inStock"].length > 0 && (
          <div className="mt-12">
            <h2 className="sr-only">Items in your shopping cart</h2>
            <div className="mb-10">
              <p className="text-lg font-semibold  text-gray-700">
                The following items are available for shipment immediately:
              </p>
            </div>

            <ul className="relative border-t border-b border-gray-200 divide-y divide-gray-200 bg-green-50">
              <Link
                to="/cart"
                className="absolute -top-6 right-0 text-sm text-blue-800">
                Edit quantities
              </Link>
              {GroupedCartItems["inStock"].map((product, productIdx) => (
                <li key={productIdx} className="flex py-6 sm:py-2">
                  <div className="flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 rounded-lg object-center object-contain sm:w-20 sm:h-12"
                    />
                  </div>

                  <div className="relative ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                    <div>
                      <div className="flex justify-between sm:grid sm:grid-cols-2">
                        <div className="pr-6">
                          <h3 className="text-sm">
                            <Link
                              to={product.slug}
                              className="font-medium text-gray-700 hover:text-gray-800">
                              {product.name}
                            </Link>
                          </h3>

                          {product.variantTitle ? (
                            <p className="mt-1 text-sm text-gray-500">
                              {product.variantTitle}
                            </p>
                          ) : null}
                          {product.type &&
                          product.type !== product.variantTitle ? (
                            <p className="mt-1 text-sm text-gray-500">
                              Type: {product.variantTitle}
                            </p>
                          ) : null}
                          {product.material ? (
                            <p className="mt-1 text-sm text-gray-500">
                              Type: {product.material}
                            </p>
                          ) : null}
                          {product.pack ? (
                            <p className="mt-1 text-sm text-gray-500">
                              Type: {product.pack}
                            </p>
                          ) : null}
                        </div>
                        <div className="mt-4 flex items-center sm:block sm:top-0 sm:mt-0">
                          <div className="text-sm font-medium text-gray-900 text-right">
                            <span className="text-xs font-normal">
                              Per pack:{" "}
                            </span>
                            ${product.price}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center sm:block sm:absolute sm:top-0 sm:left-1/2 sm:mt-0">
                        <div className="flex flex-row gap-2 items-center">
                          <span className="text-xs">Qty in your cart:</span>
                          <span>{product.qty}</span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 flex text-sm text-gray-700 space-x-2">
                      {product.countInStock >= product.qty ? (
                        <CheckIcon
                          className="flex-shrink-0 h-5 w-5 text-green-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <ClockIcon
                          className="flex-shrink-0 h-5 w-5 text-gray-300"
                          aria-hidden="true"
                        />
                      )}

                      <span>
                        {product.countInStock >= product.qty
                          ? "In stock"
                          : `Ships in ${product.leadTime} weeks`}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {GroupedCartItems["notInStock"].length > 0 && (
          <>
            <div className="mt-12">
              <h2 className="sr-only">Items in your shopping cart</h2>
              <div className="mb-10">
                <p className="text-lg font-semibold   text-gray-700">
                  The following items in your cart have a lead time
                </p>
              </div>
              <ul
                className="relative border-t border-b border-gray-200 divide-y divide-gray-200 bg-red-50">
                <Link
                  to="/cart"
                  className="absolute -top-6 right-0 text-sm text-blue-800">
                  Edit quantities
                </Link>
                {GroupedCartItems["notInStock"].map((product, productIdx) => (
                  <li key={productIdx} className="flex py-6 sm:py-2">
                    <div className="flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 rounded-lg object-center object-contain sm:w-20 sm:h-12"
                      />
                    </div>

                    <div className="relative ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                      <div>
                        <div className="flex justify-between sm:grid sm:grid-cols-2">
                          <div className="pr-6">
                            <h3 className="text-sm">
                              <Link
                                to={product.slug}
                                className="font-medium text-gray-700 hover:text-gray-800">
                                {product.name}
                              </Link>
                            </h3>

                            {product.variantTitle ? (
                              <p className="mt-1 text-sm text-gray-500">
                                {product.variantTitle}
                              </p>
                            ) : null}
                            {product.type &&
                            product.type !== product.variantTitle ? (
                              <p className="mt-1 text-sm text-gray-500">
                                Type: {product.variantTitle}
                              </p>
                            ) : null}
                            {product.material ? (
                              <p className="mt-1 text-sm text-gray-500">
                                Type: {product.material}
                              </p>
                            ) : null}
                            {product.pack ? (
                              <p className="mt-1 text-sm text-gray-500">
                                Type: {product.pack}
                              </p>
                            ) : null}
                          </div>

                          <div className="text-sm font-medium text-gray-900 text-right">
                            <span className="text-xs font-normal">
                              Per pack:{" "}
                            </span>
                            ${product.price}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center sm:block sm:absolute sm:top-0 sm:left-1/2 sm:mt-0">
                          <div className="flex gap-0 flex-col items-center">
                            <p>
                              <span className="text-xs">
                                Qty in your cart:{" "}
                              </span>
                              <span className="">{product.qty}</span>
                            </p>
                            <p>
                              <span className="text-xs">
                                Qty in our stock:{" "}
                              </span>
                              {Math.max(product.countInStock, 0)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 flex text-sm text-gray-700 space-cx-2">
                        {product.countInStock >= product.qty ? (
                          <CheckIcon
                            className="flex-shrink-0 h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <ClockIcon
                            className="flex-shrink-0 h-5 w-5 text-gray-300"
                            aria-hidden="true"
                          />
                        )}

                        <span>
                          {product.countInStock >= product.qty
                            ? "In stock"
                            : `Ships in ${product.leadTime} weeks`}
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      <div className="max-w-xl m-6">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700">
          Add any instructions for this order?
        </label>
        <div className="mt-1 border-b border-gray-300 focus-within:border-blue-600">
          <textarea
            type="text"
            name="name"
            id="name"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="p-2 block w-full h-20 border-0 border-b border-transparent bg-gray-50 focus:border-blue-600 focus:ring-0 sm:text-sm"
            placeholder="Please send a sample pack of your swivels!"
          />
        </div>
      </div>

      <section
        aria-labelledby="summary-heading"
        className=" bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
        <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
          Order summary
        </h2>

        <dl className="mt-6 space-y-4">
          <div className="border-t border-gray-200 pt-4 flex flex-col justify-between">
            <dt className="flex w-full  flex-row justify-between items-center text-sm text-gray-600">
              <span>Address</span>
              <Link to="/shipping" className=" text-sm text-blue-800">
                Edit address
              </Link>
            </dt>
            <dd className="ml-6 m-6 bg-green-50 w-max rounded-md p-5 text-gray-900">
              <AddressBox
                className="text-sm"
                input={cart.shippingAddress}
                disabled
              />
            </dd>

            <dt className="flex items-center text-sm text-gray-600">
              <span>Special contact info for this order:</span>
            </dt>
            <dd className="ml-6 m-6 bg-green-50 w-max rounded-md p-5 text-gray-900">
              <dl className="flex flex-col text-sm">
                <div className="flex flex-row gap-2">
                  <dt className="text-gray-500 text-sm inline mr-4">Email:</dt>
                  <dd className="text-gray-500 text-sm inline mr-4 font-light">
                    {cart.shippingAddress.email || "Default"}
                  </dd>
                </div>
                <div className="flex flex-row gap-2">
                  <dt className="text-gray-500 text-sm inline mr-4">Phone:</dt>
                  <dd className="text-gray-500 text-sm inline mr-4 font-light">
                    {cart.shippingAddress.phone || "Default"}
                  </dd>
                </div>
              </dl>
            </dd>
          </div>
          <div className="border-t border-gray-200  pt-4 flex items-center justify-between">
            <dt className="text-sm text-gray-600">Subtotal</dt>
            <dd className="text-sm font-medium text-gray-900">
              ${cart.itemsPrice}
            </dd>
          </div>
          <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
            <dt className="flex items-center text-sm text-gray-600">
              <span>Shipping estimate</span>
            </dt>
            <dd className="text-sm font-medium text-gray-900">
              ${cart.shippingPrice}
            </dd>
          </div>
          <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
            <dt className="flex text-sm text-gray-600">
              <span>Tax estimate</span>
            </dt>
            <dd className="text-sm font-medium text-gray-900">$8.32</dd>
          </div>
          <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
            <dt className="text-base font-medium text-gray-900">Order total</dt>
            <dd className="text-base font-medium text-gray-900">
              ${cart.totalPrice}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <button
            onClick={submitHandler}
            className="w-full bg-blue-800 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-800">
            Place Order
          </button>
        </div>
      </section>
    </div>
  );
};

export default PlaceOrder;
