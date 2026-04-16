import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  removeFromWishlist,
  fetchWishlist,
} from "../store/slices/wishlistSlice";
import { addToCart, fetchCart } from "../store/slices/cartSlice";
import {
  FaHeartBroken,
  FaShoppingCart,
  FaEye,
  FaTrash,
} from "react-icons/fa"; // ✅ FIX removed FaHeart

const BASE_URL = "http://localhost:5000";

const getImage = (img?: string) => {
  if (!img) return "https://via.placeholder.com/150";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}/${img}`;
};

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const wishlistItems = useAppSelector(
    (s: any) => s.wishlist?.items || []
  );

  const user = useAppSelector((s: any) => s.auth.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [user, dispatch]); // ✅ FIX

  if (!wishlistItems.length) {
    return (
      <div className="wishlist-empty text-center">
        <div className="empty-box">
          <FaHeartBroken className="empty-icon" />

          <h2>Your Wishlist is Empty</h2>

          <p>
            Save your favorite books here ❤️ <br />
            Discover amazing reads and add them now
          </p>

          <button onClick={() => navigate("/books")}>
            Explore Books →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="container py-4">

        <div className="wishlist-header mb-4">
          <h3>My Wishlist</h3>
          <span>{wishlistItems.length} items</span>
        </div>

        <div className="row">
          {wishlistItems.map((item: any) => (
            <div
              className="col-lg-3 col-md-4 col-sm-6 mb-4"
              key={item._id}
            >

              <div className="wishlist-card">

                <div
                  className="wishlist-img-box"
                  onClick={() =>
                    navigate(`/review/${item.bookId?._id}`)
                  }
                >
                  <img
                    src={getImage(item.bookId?.image)}
                    alt={item.bookId?.title}
                  />

                  <button
                    className="remove-icon"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await dispatch(removeFromWishlist(item._id));
                      dispatch(fetchWishlist());
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="wishlist-info">

                  <h6>{item.bookId?.title}</h6>

                  <p className="author">
                    {item.bookId?.author?.name || "Unknown Author"}
                  </p>

                  <h5>₹{item.bookId?.price}</h5>

                  <div className="wishlist-actions">

                    <button
                      className="btn-view"
                      onClick={() =>
                        navigate(`/review/${item.bookId?._id}`)
                      }
                    >
                      <FaEye /> View
                    </button>

                    <button
                      className="btn-cart"
                      onClick={async () => {
                        if (!item.bookId?._id) return; // ✅ SAFETY

                        await dispatch(addToCart(item.bookId._id));
                        await dispatch(removeFromWishlist(item._id));

                        dispatch(fetchWishlist());
                        dispatch(fetchCart());
                      }}
                    >
                      <FaShoppingCart /> Move to Cart
                    </button>

                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}