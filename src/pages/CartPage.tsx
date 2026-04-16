import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  decreaseQty,
  removeFromCart,
  fetchCart,
  addToCart,
} from "../store/slices/cartSlice";
import { addToWishlist } from "../store/slices/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaHeart, FaStar } from "react-icons/fa";
import API from "../services/api";

const BASE_URL = "http://localhost:5000";

const getImage = (img?: string) => {
  if (!img) return "/book-placeholder.png";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}/${img}`;
};

export default function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cartItems = useAppSelector((s: any) => s.cart.items || []);
  const user = useAppSelector((s: any) => s.auth.user);

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [user, dispatch]);

  const subtotal = cartItems.reduce(
    (sum: number, item: any) =>
      sum + (item.bookId?.price || 0) * item.quantity,
    0
  );

  const delivery = subtotal < 500 ? 60 : 0;

  const applyCoupon = () => {
    if (coupon === "BOOK10") {
      setDiscount(subtotal * 0.1);
    } else if (coupon === "SAVE50") {
      setDiscount(50);
    } else {
      setDiscount(0);
      alert("Invalid coupon");
    }
  };

  const total = subtotal + delivery - discount;

  const getDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toDateString();
  };

  // ================= PAYMENT =================
  const handlePayment = async () => {
    if (!user) return navigate("/login");

    try {
      const { data: order } = await API.post("/payment/create-order", {
        amount: total,
      });

      const rzp = new (window as any).Razorpay({
        key: "rzp_test_Sb4mvfRgT35BRM",
        amount: order.amount,
        currency: "INR",
        order_id: order.id,

        // ✅ FIX TYPE
        handler: async (res: any) => {
          try {
            await API.post("/payment/verify", res);
            await API.post("/payment/create");

            dispatch(fetchCart());

            alert("Payment Successful  Order Placed!");
            navigate("/orders");

          } catch (err: any) { // ✅ FIX
            console.error(err?.response?.data || err);
            alert(err?.response?.data?.msg || "Order failed");
          }
        },
      });

      rzp.open();
    } catch (err: any) { // ✅ FIX
      console.error(err);
      alert("Payment failed");
    }
  };

  // ================= EMPTY =================
  if (!cartItems.length) {
    return (
      <div className="empty-cart">
        <div className="empty-card text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="empty"
          />
          <h2>Your Cart is Empty</h2>
          <p>
            Looks like you haven’t added anything yet.
            Start exploring books now!
          </p>
          <button onClick={() => navigate("/books")}>
            Browse Books →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-wrapper">
      <div className="container py-4">

        <div className="cart-header">
          <h3>Shopping Cart</h3>
          <span>{cartItems.length} items</span>
        </div>

        <div className="row">

          {/* LEFT */}
          <div className="col-lg-8">
            {cartItems.map((item: any) => (
              <div key={item._id} className="cart-card premium">

                <img
                  src={getImage(item.bookId?.image)}
                  className="cart-img"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src =
                      "/book-placeholder.png")
                  }
                />

                <div className="cart-info">

                  <h5>{item.bookId?.title}</h5>
                  <p>{item.bookId?.author?.name}</p>

                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < (item.bookId?.rating || 4)
                            ? "filled"
                            : ""
                        }
                      />
                    ))}
                  </div>

                  <h4>₹{item.bookId?.price}</h4>

                  <p>
                    Delivery by <strong>{getDeliveryDate()}</strong>
                  </p>

                  <div className="qty-box">
                    <button onClick={() => dispatch(decreaseQty(item._id))}>
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        dispatch(addToCart(item.bookId._id))
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-actions">
                    <button onClick={() => dispatch(removeFromCart(item._id))}>
                      <FaTrash /> Remove
                    </button>

                    <button
                      onClick={() => {
                        if (!user) return navigate("/login");
                        dispatch(addToWishlist(item.bookId._id));
                      }}
                    >
                      <FaHeart /> Save
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="col-lg-4">
            <div className="summary-box premium sticky-top">

              <h5>Order Summary</h5>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <span>{delivery === 0 ? "FREE" : "₹60"}</span>
              </div>

              <div className="coupon-box">
                <input
                  placeholder="Apply coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <button onClick={applyCoupon}>Apply</button>
              </div>

              <div className="summary-row discount">
                <span>Discount</span>
                <span>- ₹{discount}</span>
              </div>

              <hr />

              <div className="summary-total">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button className="checkout-btn" onClick={handlePayment}>
                Secure Checkout →
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}