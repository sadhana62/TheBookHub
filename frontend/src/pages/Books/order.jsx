import React, { useEffect, useState } from "react";
import { getImgUrl } from '../../utils/getImgUrl'

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
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        console.log("Fetched orders:", data);

        // ✅ Use 'data.data' because your backend wraps orders inside `data`
        setOrders(data.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id} style={{ marginBottom: "2rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
              <p><strong>Shipping Address:</strong> {`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.zipcode}, ${order.shippingAddress.country}`}</p>
              <p><strong>Items:</strong></p>
              <ul>
                {order.orderItems.map((item) => (
                  <li key={item._id}>
                     <img
                            src={`${getImgUrl(item.book?.imageLink)}`}
                            alt=""
                            style={{ width: "100px", marginRight: "50px" }}
                            className="w-full bg-cover p-2 rounded-md cursor-pointer hover:scale-105 transition-all duration-200"
                        />
                    {item.book.title} by {item.book.author} — Quantity: {item.quantity}, Price: ₹{item.price}
                  </li>
                ))}
              </ul>
              <p><strong>Total Price:</strong> ₹{order.totalPrice.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
