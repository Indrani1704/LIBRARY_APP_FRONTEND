import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchBooks } from "../store/slices/bookSlice";
import { addToCart } from "../store/slices/cartSlice";
import { addToWishlist } from "../store/slices/wishlistSlice";
import { FaHeart } from "react-icons/fa";
import { toast } from "sonner";



const getImage = (img: string) => {
  if (!img) return "https://via.placeholder.com/150x220?text=Book";
  if (img.startsWith("http")) return img;
  return `${import.meta.env.VITE_API_URL}/${img.replace(/\\/g, "/")}`;
};

export default function AllBooks() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const books = useAppSelector((s: any) => s.books?.books || []);
  const user = useAppSelector((s: any) => s.auth?.user);

  const [displayBooks, setDisplayBooks] = useState<any[]>([]);

  const [filters, setFilters] = useState({
    search: "",
    genre: "all",
    publisher: "all",
    language: "all",
    category: "all",
    author: "",
    minPrice: "",
    maxPrice: "",
  });

  const genre = params.get("genre") || "";
  const publisher = params.get("publisher") || "";
  const language = params.get("language") || "";

  useEffect(() => {
    const query = new URLSearchParams();

    if (genre) query.append("genre", genre);
    if (publisher) query.append("publisher", publisher);
    if (language) query.append("language", language);

    dispatch(fetchBooks(query.toString()));
  }, [genre, publisher, language, dispatch]);

  useEffect(() => {
    setDisplayBooks(books);
  }, [books]);

  const genres = [...new Set(books.map((b: any) => b.genre).filter(Boolean))];
  const publishers = [
    ...new Set(books.map((b: any) => b.publisher?.name).filter(Boolean)),
  ];
  const languages = [
    ...new Set(books.map((b: any) => b.bookLanguage).filter(Boolean)),
  ];
  const categories = [
    ...new Set(books.map((b: any) => b.category?.name).filter(Boolean)),
  ];

  const filteredBooks = displayBooks.filter((b: any) => {
    const title = (b.title || "").toLowerCase();
    const authorName = (b.author?.name || "").toLowerCase();

    return (
      title.includes(filters.search.toLowerCase()) &&
      (filters.genre === "all" ||
        (b.genre || "").toLowerCase().includes(filters.genre.toLowerCase())) &&
      (filters.publisher === "all" ||
        (b.publisher?.name || "")
          .toLowerCase()
          .includes(filters.publisher.toLowerCase())) &&
      (filters.language === "all" ||
        (b.bookLanguage || "")
          .toLowerCase()
          .includes(filters.language.toLowerCase())) &&
      (filters.category === "all" ||
        (b.category?.name || "")
          .toLowerCase()
          .includes(filters.category.toLowerCase())) &&
      authorName.includes(filters.author.toLowerCase()) &&
      (!filters.minPrice || b.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || b.price <= Number(filters.maxPrice))
    );
  });

  return (
    <div className="allbooks-page">

      {/* SIDEBAR */}
      <div className="filter-sidebar">
        <h4>Filters</h4>

        <input placeholder="Search books..."
          onChange={(e) => setFilters({ ...filters, search: e.target.value })} />

        <select onChange={(e) => setFilters({ ...filters, genre: e.target.value })}>
          <option value="all">All Genres</option>
          {genres.map((g: any) => <option key={g}>{g}</option>)}
        </select>

        <select onChange={(e) => setFilters({ ...filters, publisher: e.target.value })}>
          <option value="all">All Publishers</option>
          {publishers.map((p: any) => <option key={p}>{p}</option>)}
        </select>

        <select onChange={(e) => setFilters({ ...filters, language: e.target.value })}>
          <option value="all">All Languages</option>
          {languages.map((l: any) => <option key={l}>{l}</option>)}
        </select>

        <select onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="all">All Categories</option>
          {categories.map((c: any) => <option key={c}>{c}</option>)}
        </select>

        <input placeholder="Search author..."
          onChange={(e) => setFilters({ ...filters, author: e.target.value })} />

        <div className="price-range">
          <input type="number" placeholder="Min ₹"
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
          <input type="number" placeholder="Max ₹"
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
        </div>
      </div>

      {/* GRID */}
      <div className="book-grid-pro">
        {filteredBooks.map((book: any) => (
          <div key={book._id} className="book-card-pro">

            <div className="book-img-wrap">
              <img src={getImage(book.image)} />

              <button
                className="wishlist-btn-pro"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!user) return navigate("/login");

                  dispatch(addToWishlist(book));
                  toast.success("Added to wishlist");
                }}
              >
                <FaHeart />
              </button>
            </div>

            <div className="book-info">
              <h4>
                {book.title.length > 28
                  ? book.title.slice(0, 28) + "..."
                  : book.title}
              </h4>

              <p>{book.author?.name}</p>

              <div className="price">₹{book.price}</div>

              <div className="book-actions">
                <button
                  className="btn-view"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/review/${book._id}`);
                  }}
                >
                  View
                </button>

                <button
                  className="btn-buy"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) return navigate("/login");

                    dispatch(addToCart(book));
                    navigate("/cart");
                  }}
                >
                  Shop Now
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}