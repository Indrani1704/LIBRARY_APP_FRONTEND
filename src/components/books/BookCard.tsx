import { FaStar, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  addToCart,
  fetchCart,
} from "../../store/slices/cartSlice";
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "../../store/slices/wishlistSlice";

const BASE_URL = "http://localhost:5000";

const getImage = (img?: string) => {
  if (!img) return "/book-placeholder.png";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}/${img}`;
};

export default function BookCard({ book }: any) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cartItems = useAppSelector((s: any) => s.cart.items || []);
  const wishlistItems = useAppSelector(
    (s: any) => s.wishlist.items || []
  );

  const isLoggedIn = !!localStorage.getItem("token");

  const [loading, setLoading] = useState(false);

 //  FIXED CHECKS
const isInCart = cartItems.some(
  (item: any) =>
    String(item.bookId?._id || item.bookId) === String(book._id)
);

const isInWishlist = wishlistItems.some(
  (item: any) =>
    String(item.bookId?._id || item.bookId) === String(book._id)
);

  //  Wishlist
  const handleWishlist = async () => {
  if (!isLoggedIn) {
    navigate("/login");
    return;
  }

  try {
    //  FIND ITEM IN WISHLIST
    const existing = wishlistItems.find(
      (item: any) =>
        String(item.bookId?._id || item.bookId) === String(book._id)
    );

    if (existing) {
      // REMOVE
      await dispatch(removeFromWishlist(existing._id));
    } else {
      //  ADD
      await dispatch(addToWishlist(book._id));
    }

    dispatch(fetchWishlist()); 
  } catch (err) {
    console.log("Wishlist error:", err);
  }
};

  //  Add to cart
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!isInCart) {
      await dispatch(addToCart(book._id));
      dispatch(fetchCart());
    }
  };

  //  Buy now
  const handleBuy = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setLoading(true);

    if (!isInCart) {
      await dispatch(addToCart(book._id));
    }

    await dispatch(fetchCart());

    setTimeout(() => {
      navigate("/cart");
    }, 200);
  };

 return (
  <div className="book-card">
    
    {/*  Wishlist */}
    <button className="wishlist-btn" onClick={handleWishlist}>
      <FaHeart className={isInWishlist ? "liked" : ""} />
    </button>

    {/*  Image */}
    <div className="book-image">
      <img
        src={getImage(book.image)}
        alt={book.title}
        onError={(e) =>
          ((e.target as HTMLImageElement).src =
            "/book-placeholder.png")
        }
      />
    </div>

    {/*  Content */}
    <div className="book-content">
      
      <h3 className="title">
        {book.title || "Untitled Book"}
      </h3>

      <p className="author">
        {typeof book.author === "object"
          ? book.author?.name
          : "Unknown Author"}
      </p>

      {/*  Rating */}
      <div className="rating">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={
              i < (book.rating || 4)
                ? "star filled"
                : "star"
            }
          />
        ))}
        <span>({book.reviews || 120})</span>
      </div>

      {/*  Price */}
      <p className="price">
        ₹{book.price ?? "N/A"}
      </p>

      {/*  Actions */}
      <div className="actions">

        <button
          className="btn outline"
          onClick={() => navigate(`/review/${book._id}`)}
        >
          View
        </button>

        <button
          className="btn primary"
          onClick={handleAddToCart}
          disabled={isInCart}
        >
          {isInCart ? "Added" : "Add"}
        </button>

        <button
          className="btn buy"
          onClick={handleBuy}
          disabled={loading}
        >
          {loading ? "Processing..." : "Buy"}
        </button>

      </div>
    </div>
  </div>
);
}