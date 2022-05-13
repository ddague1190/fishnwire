import React from "react";
import Loader from "../../components/utilities/loader/loader.component";
import Message from "../../components/utilities/Message";
import { useNavigate } from "react-router-dom";
import { listMyOrders } from "../../redux/actions/orderActions";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

export const ProfileOrders = () => {
  const { loading, error, orders } = useSelector((state) => state.orderListMy);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(!orders || orders.length===0) {
    dispatch(listMyOrders());
    }
  }, [dispatch, orders])
  return (
    <>
      {error && <Message>{error}</Message>}

      {loading && <Loader />}
      <div className=" mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="hidden sm:block py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                Ref no.
              </th>
              <th
                scope="col"
                className=" px-3 py-3.5 text-center text-sm font-semibold text-gray-900 sm:table-cell">
                Date
              </th>
              <th
                scope="col"
                className=" px-3 py-3.5 text-center text-sm font-semibold text-gray-900 lg:table-cell">
                Order Price
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders?.map((order, index) => (
              <tr className="cursor-pointer  hover:bg-blue-100" key={index} onClick={()=>navigate(`/order/${order._id}`)}>
                <td className="hidden sm:block whitespace-nowrap text-center py-4 mt-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {order._id}
                </td>
                <td className=" whitespace-nowrap  text-center px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  {order.createdAt.substring(0, 10)}
                </td>
                <td className=" whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500 lg:table-cell">
                  ${order.readyAndNotReadyTotalPrice}
                </td>
                <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    {order.status.payNow ? (
                      <p className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Pay now to ship!
                      </p>
                    ) : (
                      <dl>
                        {order.status.delivered > 0 && (
                          <div className="flex flex-row flex-wrap gap-2 justify-center">
                            <dt>Delivered</dt>{" "}
                            <dd className="text-xs">
                              ({order.status.delivered} items)
                            </dd>
                          </div>
                        )}
                        {order.status.shipped > 0 && (
                          <div className="flex flex-row flex-wrap justify-center gap-1 md:items-center">
                            <dt className="text-yellow-800">Shipped</dt>{" "}
                            <dd className="text-xs">({order.status.shipped} items)</dd>
                          </div>
                        )}
                        {order.status.waitingOnItem > 0 && (
                          <div className="flex flex-row flex-wrap justify-center gap-1 md:items-center">
                            <dt className="text-red-500">Preparing for sale</dt>{" "}
                            <dd className="text-xs">
                              ({order.status.waitingOnItem} items)
                            </dd>
                          </div>
                        )}
                        {order.status.gettingReady > 0 && (
                          <div className="flex flex-row flex-wrap justify-center gap-1 md:items-center">
                            <dt className="text-purple-500">
                              Paid, packing it up!
                            </dt>{" "}
                            <dd className="text-xs">
                              ({order.status.gettingReady} items)
                            </dd>
                          </div>
                        )}
                      </dl>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
