import { useEffect, useState } from "react";
import API from "../services/api";
import { FaCheckCircle } from "react-icons/fa";

const BASE_URL = "http://localhost:5000";

//  fallback image
const FALLBACK = "https://placehold.co/200x300?text=Book";

//  FIXED IMAGE HANDLER
const getImage = (img?: string) => {
  if (!img) return FALLBACK;
  if (img.startsWith("http")) return img;

  return `${BASE_URL}/${img.replace(/\\/g, "/")}`;
};

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/payment/my-orders")
      .then((res) => {
        console.log("ORDERS:", res.data);
        setOrders(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  //  LOADING
  if (loading) {
    return <div className="text-center p-5">Loading your orders...</div>;
  }

  //  EMPTY
  if (!orders.length) {
    return (
      <div className="empty-orders text-center p-5">
        <h3>No orders yet 📦</h3>
        <p className="text-muted">
          Start shopping and your orders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="orders-page container py-5">
      <h2 className="mb-4 fw-bold">My Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="order-card">

          {/* HEADER */}
          <div className="order-header">
            <div>
              <div className="order-id">
                Order #{order._id.slice(-6).toUpperCase()}
              </div>
              <div className="order-date">
                {new Date(order.createdAt).toDateString()}
              </div>
            </div>

            <div className="order-status">
              <FaCheckCircle /> Paid
            </div>
          </div>

          {/* ITEMS */}
          <div className="order-items">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="order-item">

                {/*  IMAGE */}
                <img
                  src={getImage(item.image)}
                  className="order-img"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK;
                  }}
                />

                {/*  DETAILS */}
                <div className="order-info">
                  <h6 className="title">
                    {item.title || "Unknown Book"}
                  </h6>

                  <p className="author">
                    {item.author || "Unknown Author"}
                  </p>

                  <div className="meta-row">
                    <span>Qty: {item.quantity}</span>
                    <span className="price">
                      ₹{item.price || 0}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="order-footer">
            <span>Total</span>
            <span className="total-price">₹{order.totalAmount}</span>
          </div>

        </div>
      ))}
    </div>
  );
}