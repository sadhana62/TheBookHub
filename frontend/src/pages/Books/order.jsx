import React, { useEffect, useState } from "react";
import { getImgUrl } from "../../utils/getImgUrl";
import { Link } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5001/api/orders/myorders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setOrders(data.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-10 text-lg">Loading orders...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold mb-8">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl shadow-md border p-6 bg-white"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-medium">Order ID: {order._id}</span>
                <span className="text-xs text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                  {order.status === "Delivered" ? "Arrived" : "On Deliver"}
                </span>
              </div>

              {/* Delivery Info */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <span>📍 {order.shippingAddress?.city}, {order.shippingAddress?.state}</span>
                </div>
                <div className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                  Estimated arrival: {new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}

                </div>
                <div className="flex items-center gap-2">
                  <span>📦 {order.shippingAddress?.address}</span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4 border-t pt-4">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4">
                    <img
                      src={getImgUrl(item.book?.imageLink)}
                      alt={item.book.title}
                      className="w-20 h-24 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{item.book.title}</div>
                      <div className="text-sm text-gray-500">
                        by {item.book.author}
                      </div>
                      <div className="text-sm text-gray-600">
                        Size: M &nbsp;|&nbsp; Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="text-right text-gray-800 font-medium">
                      ₹{parseFloat(item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 flex justify-between items-center border-t pt-4">
                <div className="text-sm text-gray-500">
                  Payment: {order.paymentMethod}
                </div>
                <div className="text-base font-semibold">
                  Total: ₹{order.totalPrice.toFixed(2)}
                </div>
              </div>

              <div className="flex justify-end mt-2">
                {/* <Link
                  to={`/order/${order._id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Details
                </Link> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
