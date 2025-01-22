import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/utilities/Message";
import Loader from "../components/utilities/loader/loader.component";
import { useNavigate, useParams } from "react-router-dom";
import {
  getOrderDetails,
  payOrder,
  getPayments,
} from "../redux/actions/orderActions";
import { PayPalButton } from "react-paypal-button-v2";
import { ORDER_PAY_RESET } from "../redux/constants/orderConstants";
import AddressBox from "../components/utilities/addressbox/addressbox.component";
import { motion, useMotionValue } from "framer-motion";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import PayShipBox from "../components/checkoutpathway/PayShipBox";
import PayDetails from "../components/checkoutpathway/PayDetails";
import ProductListElement from "../components/checkoutpathway/ProductListElement";

const OrderScreen = () => {
  const [intervalId, setIntervalId] = useState([]);
  const count = useMotionValue(0);
  const [showDetails, setShowDetails] = useState(-1);
  const [prevNumPayments, setPrevNumPayments] = useState();
  const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  const [errorPayPal, setErrorPayPal] = useState("");
  const ref = useRef();
  const [postPay, setPostPay] = useState(false);
  const [prePay, setPrePay] = useState(true);
  const [openPay, setOpenPay] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [orderItems, setOrderItems] = useState({ ready: [], notReady: [] });
  const orderId = useParams().id;
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const { numPayments } = useSelector((state) => state.numPayments);
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const {
    loading: loadingPay,
    success: successPay,
    error: errorPay,
  } = useSelector((state) => state.orderPay);

  useEffect(() => {
    if (numPayments > prevNumPayments) {
      dispatch(getOrderDetails(orderId));
      setPostPay(true);
      intervalId.forEach((id) => {
        clearInterval(id);
      });
      count.set(0);
    }

    return () => {
      if (count.get() > 60) {
        intervalId.forEach((id) => {
          clearInterval(id);
        });
      }
    };
  }, [numPayments]);

  useEffect(() => {
    if (order) {
      categorizeByReady();
      setPrevNumPayments(order.payments.length);
    }
    if (!order || successPay || order._id !== Number(orderId)) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }

    if (error?.includes("token")) {
      navigate(`/login?redirect=/order/${orderId}`);
    }
  }, [dispatch, order, orderId, error, successPay, navigate]);

  const categorizeByReady = () => {
    const ready = [];
    const notReady = [];
    order.orderItems.map((item) => {
      if (item.readyToShip && !item.UNVERIFIED_PAID) {
        ready.push(item);
      } else if (!item.readyToShip) {
        notReady.push(item);
      }
    });

    setOrderItems({ ready: ready, notReady: notReady });
  };

  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  const awaitPaymentDetails = () => {
    dispatch(getPayments(orderId));
  };

  const countUpWhilstAwaitingPaymentDetails = () => {
    count.set(count.get() + 1);
    if (ref) ref.current.innerHTML = count.get();
  };

  const successPaymentHandler = (paymentResult) => {
    setPrePay(false);
    dispatch(payOrder(orderId, paymentResult));
    const id1 = setInterval(awaitPaymentDetails, 5000);
    const id2 = setInterval(countUpWhilstAwaitingPaymentDetails, 1000);
    setIntervalId([id1, id2]);
  };
  return loading ? (
    <Loader />
  ) : error ? (
    <Message>{error}</Message>
  ) : (
    <div className="bg-white">
      <div className=" max-w-4xl mx-auto py-5 px-4 sm:py-5 sm:px-6 lg:px-8">
        <h1 className="text-3xl mb-5 font-extrabold tracking-tight text-gray-900">
          Your Order
        </h1>
        <dl>
          <div className="flex flex-row items-center">
            <dt className="font-semibold text-sm w-40 text-gray-500">
              Date created:
            </dt>
            <dd>{order.createdAt}</dd>
          </div>
          <div className="flex flex-row w-max">
            <dt className="font-semibold text-sm w-40 text-gray-500">
              Shipping Address:
            </dt>{" "}
            <dd>
              <AddressBox input={order.shippingAddress} />
            </dd>
          </div>
          {order.instructions && (
            <div className="flex flex-row w-max">
              <dt className="font-semibold text-sm w-40 text-gray-500">
                Instructions
              </dt>{" "}
              <dd>
                {order.instructions}
              </dd>
            </div>
          )}
        </dl>

        <section className="my-10 relative w-full  border-2 p-2 border-dashed rounded-md">
          <h1 className="absolute top-1/2 -translate-y-1/2 -z-1 text-center text-5xl font-semibold  text-gray-100">
            Payments
          </h1>
          {count.get() > 0 && (
            <span
              ref={ref}
              className="text-2xl absolute t-1/2 left-1/2 font-semibold text-blue-800"></span>
          )}
          <div className="flex flex-col items-center justify-center py-8 ">
            {prevNumPayments > 0 &&
              order.payments.map((payment, index) => (
                <PayShipBox
                  createdAt={payment.createdAt}
                  shipped={payment.shipment ? true : false}
                  setShowDetails={setShowDetails}
                  key={index}
                  index={index}
                />
              ))}
          </div>
        </section>

        {showDetails >= 0 ? (
          <PayDetails order={order} index={showDetails} />
        ) : (
          ""
        )}

        {prePay ? (
          orderItems["ready"].length > 0 && (
            <section className="mt-12">
              <h2 className="sr-only">Items in your shopping cart</h2>
              <p className="mb-10 text-lg font-semibold  text-gray-700">
                We have the following items ready for shipment.
              </p>

              <ul
                role="list"
                className="relative border-t border-b border-gray-200 divide-y divide-gray-200 bg-green-50">
                {orderItems["ready"].map((product, index) => (
                  <ProductListElement key={index} product={product} index={index} />
                ))}
              </ul>
              {!openPay ? (
                <button
                  onClick={setOpenPay.bind(null, true)}
                  className="w-full my-3 bg-[#FF5656] border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-[#FF8989] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-800">
                  Pay to ship{" "}
                  <i
                    className="fa fa-asterisk -translate-y-1.5 text-xs"
                    aria-hidden="true"></i>
                </button>
              ) : (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-blue-50 rounded-b-md w-full  flex flex-col md:flex-row gap-2 py-6 px-2 items-center">
                  <section aria-labelledby="summary-heading" className="w-full">
                    <h2
                      id="summary-heading"
                      className="text-lg font-medium text-gray-900">
                      Order summary
                    </h2>

                    <dl className="mt-6 space-y-4">
                      <div className="border-t border-gray-200  pt-4 flex items-center justify-between">
                        <dt className="text-sm text-gray-600">Subtotal</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          ${order.totalPrice}
                        </dd>
                      </div>
                      <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                        <dt className="flex items-center text-sm text-gray-600">
                          <span>Shipping estimate</span>
                          <a
                            href="#"
                            className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
                            <span className="sr-only">
                              Learn more about how shipping is calculated
                            </span>
                            <QuestionMarkCircleIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </a>
                        </dt>
                        <dd className="text-sm font-medium text-gray-900">
                          ${order.totalPrice > 100 ? 0 : 10}
                        </dd>
                      </div>
                      <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                        <dt className="flex text-sm text-gray-600">
                          <span>Tax estimate</span>
                          <a
                            href="#"
                            className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
                            <span className="sr-only">
                              Learn more about how tax is calculated
                            </span>
                            <QuestionMarkCircleIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </a>
                        </dt>
                        <dd className="text-sm font-medium text-gray-900">
                          ${(order.totalPrice * 0.07).toFixed(2)}
                        </dd>
                      </div>
                      <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                        <dt className="text-base font-medium text-gray-900">
                          Order total
                        </dt>
                        <dd className="text-base font-medium text-gray-900">
                          $
                          {Number(order.totalPrice) +
                            Number((order.totalPrice * 0.07).toFixed(2)) +
                            Number(order.totalPrice > 100 ? 0 : 10)}
                        </dd>
                      </div>
                    </dl>
                  </section>
                  <div className="w-3/4 md:w-full ">
                    <div className="paypal px-6 pt-6 md:pt-0">
                      {loadingPay && <Loader />}
                      {errorPay && (
                        <Message variant="danger">{errorPay}</Message>
                      )}
                      {errorPayPal && (
                        <Message variant="danger">{errorPayPal}</Message>
                      )}

                      {!sdkReady ? (
                        <Loader />
                      ) : (
                        <PayPalButton
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    currency_code: "USD",
                                    value: order.finalPrice,
                                  },
                                  custom_id: orderId,
                                  shipping: {
                                    name: {
                                      full_name:
                                        order.shippingAddress.firstName +
                                        order.shippingAddress.lastName,
                                    },
                                    address: {
                                      address_line_1:
                                        order.shippingAddress.streetAddress,
                                      address_line_2:
                                        order.shippingAddress.apartment,
                                      admin_area_2: order.shippingAddress.city,
                                      admin_area_1: order.shippingAddress.state,
                                      postal_code:
                                        order.shippingAddress.postalCode,
                                      country_code: "US",
                                    },
                                  },
                                },
                              ],
                              application_context: {
                                locale: "us-US",
                                shipping_preference: "SET_PROVIDED_ADDRESS",
                              },
                            });
                          }}
                          onSuccess={successPaymentHandler}
                          onError={(err) => setErrorPayPal(err)}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </section>
          )
        ) : !postPay ? (
          <h1>
            Your payment information will be reflected above momentarily (it
            could take a minute)...
          </h1>
        ) : (
          ""
        )}

        {orderItems["notReady"].length > 0 && (
          <section className="mt-12">
            <h2 className="sr-only">Items in your shopping cart</h2>
            <div className="mb-10">
              <p className="text-lg font-semibold  text-gray-700">
                The following special order or custom items are still in
                process:
              </p>
            </div>

            <ul
              role="list"
              className="relative border-t border-b border-gray-200 divide-y divide-gray-200 bg-red-50">
              {orderItems["notReady"].map((product, index) => (
                <ProductListElement product={product} index={index} key={index} />
              ))}
            </ul>
          </section>
        )}
        {orderItems["notReady"].length > 0 && (
          <p className=" max-w-4xl mx-auto bottom-0 px-4 sm:px-6 lg:px-8 text-xs text-gray-500 sm:px-5 py-6">
            <i
              className="fa fa-asterisk -translate-y-1.5 text-xs"
              aria-hidden="true"></i>{" "}
            It is currently our policy to only accept payment for items after
            they are ready to ship. If you have items which are custom or
            special order, you have the option of waiting and shipping all items
            together or paying for items as they become ready to ship.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderScreen;
