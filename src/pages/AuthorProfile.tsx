import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchBooks } from "../store/slices/bookSlice";
import BookCard from "../components/books/BookCard";
import "../../style.css";

const BASE_URL = "http://localhost:5000";

const getImage = (img?: string) => {
  if (!img) return "https://via.placeholder.com/150x220?text=No+Image";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}/${img}`;
};

export default function AuthorProfile() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { books = [], loading } = useAppSelector(
    (s: any) => s.books || {}
  );

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const authorBooks = books.filter((b: any) => {
    if (!b.author) return false;

    const authorId =
      typeof b.author === "string"
        ? b.author
        : b.author?._id;

    return String(authorId) === String(id);
  });

  const author =
    typeof authorBooks[0]?.author === "object"
      ? authorBooks[0]?.author
      : null;

  if (loading) {
    return <div className="empty-author">Loading author...</div>;
  }

  if (!books || books.length === 0) {
    return <div className="empty-author">No books found</div>;
  }

  if (authorBooks.length === 0) {
    return <div className="empty-author">No books for this author</div>;
  }

  return (
    <div className="author-page">
      <div className="author-hero">
        <div className="author-hero-inner">
          <img
            src={getImage(author?.image)}
            alt={author?.name}
            className="author-img"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/150x220?text=Author";
            }}
          />

          <div>
            <h1 className="author-name">{author?.name}</h1>
            <p className="author-tag">
              Our Selected Authors from StoryTeller's Best Picks
            </p>
          </div>
        </div>
      </div>

      <div className="author-books">
        <div className="author-books-header">
          <h2>Books by {author?.name}</h2>
        </div>

        <div className="author-grid">
          {authorBooks.map((book: any) => (  // ✅ FIX (removed i)
            <div key={book._id} className="author-book-card">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}