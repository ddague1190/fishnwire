import React from "react";

const PayShipBox = ({
  createdAt,
  index,
  setShowDetails,
  shipped,
  delivered,
}) => {
  return (
    <div className="text-center flex flex-col  cursor-pointer hover:scale-[1.02]" onClick={setShowDetails.bind(null, index)}>
      <div
        type="button"
        className=" rounded-t-md w-full  py-1.5 border border-transparent text-xs font-medium text-blue-700 bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        Paid on {createdAt}
      </div>
      <div className=" font-semibold rounded-b-md border-b-2 bg-gray-20 px-2 p-1 text-xs text-gray-500">
        Shipment status: {' '}
        {!shipped
          ? "Getting it ready!"
          : !delivered
          ? "Shipped!"
          : "Delivered!"}
      </div>
    </div>
  );
};

export default PayShipBox;
