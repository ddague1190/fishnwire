import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/utilities/loader/loader.component";
import Message from "../components/utilities/Message";
import CartItemElement from "../components/checkoutpathway/CartItemElement";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function CartScreen() {
  const [loading, setLoading] = useState(true);
  const productId = useParams().id;
  let navigate = useNavigate();


  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [cartItems]);

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const subtotal = cartItems
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2);

  const shippingprice = subtotal < 100 ? Number(10.0) : 0;
  const taxprice = Number(subtotal * 0.07).toFixed(2);
  const grandtotal = (
    Number(subtotal) +
    Number(taxprice) +
    Number(shippingprice)
  ).toFixed(2);

  return (
    <div className="bg-white">
      {loading ? (
        <Loader />
      ) : cartItems.length === 0 ? (
        <Message>
          Your cart is empty{" "}
          <button className="underline outline-none bg-transparent font-normal" onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </Message>
      ) : (
        <main className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>

          <form onSubmit={(e)=>e.preventDefault()} className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>

              <ul
                role="list"
                className="border-t border-b border-gray-200 divide-y divide-gray-200">
                {cartItems.map((product, index) => (
                  <CartItemElement product={product} key={index} />
                ))}
              </ul>
            </section>

            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900">
                Order summary
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {subtotal}
                  </dd>
                </div>
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="flex items-center text-sm text-gray-600">
                    <span>Shipping estimate</span>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${shippingprice}
                  </dd>
                </div>
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="flex text-sm text-gray-600">
                    <span>Tax estimate</span>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${taxprice}
                  </dd>
                </div>
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">
                    Order total
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    ${grandtotal}
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <button
                  onClick={checkoutHandler}
                  type="submit"
                  className="w-full bg-black border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-500">
                  Checkout
                </button>
              </div>
            </section>
          </form>
        </main>
      )}
    </div>
  );
}
