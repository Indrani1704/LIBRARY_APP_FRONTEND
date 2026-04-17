import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { fetchBooks } from "../store/slices/bookSlice";



/* IMAGE */
const getImage = (img?: string) => { // ✅ FIX
  if (!img) return "https://via.placeholder.com/150x220?text=Book";
  if (img.startsWith("http")) return img;
  return `${import.meta.env.VITE_API_URL}/${img.replace(/\\/g, "/")}`;
};

/* TYPES */
interface Review {
  id: number;
  bookId?: string;
  rating: number;
  comment: string;
  date: string;
}

/* STORAGE */
const KEY = "book_reviews";

const getAll = (): Record<string, Review[]> =>
  JSON.parse(localStorage.getItem(KEY) || "{}");

const getReviews = (id?: string): Review[] => // ✅ FIX
  (id && getAll()[id]) || [];

const saveReview = (review: Review) => { // ✅ FIX
  const all = getAll();
  if (!all[review.bookId!]) all[review.bookId!] = [];
  all[review.bookId!].push(review);
  localStorage.setItem(KEY, JSON.stringify(all));
};

export default function ReviewPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { books = [], loading } = useAppSelector((s: any) => s.books || {});

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!books.length) dispatch(fetchBooks());
  }, [dispatch]);

  useEffect(() => {
    if (id) setReviews(getReviews(id));
  }, [id]);

  const book = books.find((b: any) => String(b._id) === String(id));

  if (loading || !books.length) {
    return <div className="review-loading">Loading book...</div>;
  }

  if (!book) {
    return <div className="review-loading">Book not found</div>;
  }

  // ✅ FIX (keep number)
  const avg =
    reviews.length > 0
      ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
      : 0;

  const submitReview = () => {
    if (!rating || !comment || !id) return;

    const newReview: Review = {
      id: Date.now(),
      bookId: id,
      rating,
      comment,
      date: new Date().toLocaleDateString(),
    };

    saveReview(newReview);
    setReviews((prev) => [newReview, ...prev]);

    setRating(0);
    setComment("");
  };

  return (
    <div className="review-page">

      {/* HERO */}
      <div className="review-hero">
        <img src={getImage(book.image)} alt={book.title} />

        <div className="hero-content">
          <h1>{book.title}</h1>
          <p className="author">
            {book.author?.name || "Unknown Author"}
          </p>

          <div className="avg">
            <strong>{avg.toFixed(1)}</strong>

            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.round(avg) ? "filled" : ""} // ✅ FIX
              />
            ))}

            <span>{reviews.length} reviews</span>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="review-layout">

        {/* REVIEWS */}
        <div className="reviews">
          <h2>User Reviews</h2>

          {reviews.length === 0 && (
            <p className="empty">No reviews yet</p>
          )}

          {reviews.map((r) => (
            <div key={r.id} className="review-card">

              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < r.rating ? "filled" : ""}
                  />
                ))}
              </div>

              <p className="comment">{r.comment}</p>
              <span className="date">{r.date}</span>

            </div>
          ))}
        </div>

        {/* FORM */}
        <div className="review-form">
          <h3>Write a Review</h3>

          <div className="stars-input">
            {[...Array(5)].map((_, i) => {
              const val = i + 1;
              return (
                <FaStar
                  key={i}
                  className={val <= (hover || rating) ? "filled" : ""}
                  onClick={() => setRating(val)}
                  onMouseEnter={() => setHover(val)}
                  onMouseLeave={() => setHover(0)}
                />
              );
            })}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this book..."
          />

          <button onClick={submitReview}>
            Submit Review
          </button>
        </div>

      </div>
    </div>
  );
}