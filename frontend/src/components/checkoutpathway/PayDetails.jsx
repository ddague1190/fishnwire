import React from "react";
import ProductListElement from "./ProductListElement";

const PayDetails = ({ order, index }) => {
  const payment = order.payments[index];

  return (
    <section className="bg-blue-800 p-2 rounded-md my-5 md:grid md:grid-cols-2 auto-rows-auto gap-2">
      <div className="md:col-span-1">
        <h1 className="text-xl font-semibold  text-blue-50">Payment details</h1>
        <dl className="ml-10 my-6 leading-6 bg-white w-max p-2 rounded-md">
          <div className="flex flex-row items-center">
            <dt className="font-semibold text-sm w-32 text-gray-500">
              Payment made:
            </dt>{" "}
            <dd className="">{payment.createdAt} </dd>
          </div>
        </dl>
        <dl className="ml-10 my-6 leading-6 bg-white w-max p-2 rounded-md">
          <div className="flex flex-row items-center">
            <dt className="font-semibold text-sm w-32 text-gray-500">
              Items Price:
            </dt>{" "}
            <dd className="">${payment.itemsPrice} </dd>
          </div>
          <div className="flex flex-row items-center">
            <dt className="font-semibold text-sm w-32 text-gray-500">
              Tax Price:
            </dt>{" "}
            <dd className="">${payment.taxPrice} </dd>
          </div>
          <div className="flex flex-row items-center">
            <dt className="font-semibold text-sm w-32 text-gray-500">
              Shipping Price:
            </dt>{" "}
            <dd className=""> ${payment.shippingPrice} </dd>
          </div>
          <div className="flex flex-row items-center">
            <dt className="font-semibold text-sm w-32 text-gray-500">
              Total Price:
            </dt>{" "}
            <dd className=""> ${payment.totalPrice} </dd>
          </div>
        </dl>
      </div>
      <div className="md:col-span-1">
        <h1 className="text-xl font-semibold  text-blue-50">
          Shipment details
        </h1>
        {payment.shipment ? (
          <dl className="ml-10 my-6 leading-6 bg-white w-max p-2 rounded-md">
            <div className="flex flex-row items-center">
              <dt className="font-semibold text-sm w-32 text-gray-500">
                Ship date:
              </dt>
              <dd className="">{payment.shipment.createdAt}</dd>
            </div>
            <div className="flex flex-row items-center">
              <dt className="font-semibold text-sm w-32 text-gray-500">
                Tracking number:
              </dt>
              <dd className="">{payment.shipment.trackingNumber}</dd>
            </div>
          </dl>
        ) : (
          <p className="italic ml-10 my-6 leading-6 bg-blue-50 w-max p-2 text-grey-200 font-semibold rounded-md">
            Still preparing the shipment
          </p>
        )}
      </div>
      <div className="md:col-span-2">
        <h1 className="text-xl font-semibold  text-blue-50">Items paid for</h1>
        <ul className="my-8 bg-white rounded-md">
          {payment.paidItems.map((product, index) => (
            <ProductListElement product={product} key={index} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PayDetails;
