import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { logoutUser } from "../store/slices/authSlice";
import { fetchBooks } from "../store/slices/bookSlice";
import { fetchAuthors } from "../store/slices/authorSlice";
import { fetchCart } from "../store/slices/cartSlice";
import { fetchWishlist } from "../store/slices/wishlistSlice";
import { clearCart } from "../store/slices/cartSlice";
import { clearWishlist } from "../store/slices/wishlistSlice";
import { addToCart } from "../store/slices/cartSlice";
import { addToWishlist } from "../store/slices/wishlistSlice";
import { FaSearch, FaHeart, FaShoppingCart } from "react-icons/fa";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import {
  FaUserShield,
  FaTag,
  FaLock,
  FaCopyright,
  FaFileContract,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/normalize.css";
import "../../css/vendor.css";
import "../../style.css";



const getImage = (img) => {
  if (!img) return "/placeholder.png";
  if (img.startsWith("http")) return img;
  return `${import.meta.env.VITE_API_URL}/${img}`;
};

export default function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { books = [] } = useAppSelector((s: any) => s.books);
  const { authors = [] } = useAppSelector((s: any) => s.authors);

  const [search, setSearch] = useState("");
  const [authorFilter, setAuthorFilter] = useState("classic");

  const [slide, setSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedPublisher, setSelectedPublisher] = useState("all");
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

void authorFilter;
void slide;
void selectedAuthor;
void setSelectedAuthor;
void setAuthorFilter;

  const applyFilterAndScroll = (type: string, value: string) => {
    if (type === "genre") {
      setSelectedGenre(value);
    }

    if (type === "publisher") {
      setSelectedPublisher(value);
    }

    if (type === "search") {
      setSearch(value);
    }

    setActiveTab("all"); // reset tab
    scrollTo("popular"); // 👈 your Browse Categories section id
  };

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchAuthors());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");

            // ✅ STOP OBSERVING AFTER FIRST ANIMATION
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());

    dispatch(clearCart());
    dispatch(clearWishlist());

    navigate("/");
  };

  // 🔥 DB DATA
  const genres = [...new Set(books.map((b: any) => b.genre).filter(Boolean))];
  const publishers = [
    ...new Set(books.map((b: any) => b.publisher?.name).filter(Boolean)),
  ];
  const languages = [
    ...new Set(books.map((b: any) => b.bookLanguage?.trim()).filter(Boolean)),
  ];
  // ✅ FIXED FILTER (CLEAN)
  // 🔥 ONLY CHANGE FILTER PART + AUTHOR CLICK

  // ✅ FIXED FILTER (separate genre + category + publisher + author)
  const filteredBooks = (books || [])
    .filter((b: any) =>
      (b.title || "")
        .toLowerCase()

        .includes(search.toLowerCase()),
    )
    .filter((b: any) => {
      if (selectedLanguage === "all") return true;

      return (
        (b.bookLanguage || "").toLowerCase().trim() ===
        selectedLanguage.toLowerCase().trim()
      );
    })
    // 🔥 GENRE FILTER (INDEPENDENT)
    .filter((b: any) => {
      if (selectedGenre === "all") return true;
      return (b.genre || "")
        .toLowerCase()
        .toLowerCase()
        .trim()
        .includes(selectedGenre.toLowerCase().trim());
    })
    // 🔥 PUBLISHER FIX (DEYS WORKING)
    .filter((b: any) => {
      if (selectedPublisher === "all") return true;

      const pub = (b.publisher?.name || "").toLowerCase().trim();
      const sel = selectedPublisher.toLowerCase().trim();

      return pub && pub.includes(sel);
    })
    // 🔥 AUTHOR FILTER
    .filter((b: any) => {
      if (selectedAuthor === "all") return true;

      const id = typeof b.author === "object" ? b.author?._id : b.author;

      return String(id) === String(selectedAuthor);
    });

  const bestSeller = books.find((b: any) => b.isBestSeller);

  const classicAuthors = authors.filter((a: any) => a.isClassic);
  const popularAuthors = authors.filter((a: any) => !a.isClassic);
  const cartItems = useAppSelector((s: any) => s.cart?.items || []);
  const wishlistItems = useAppSelector((s: any) => s.wishlist?.items || []);
  const { user } = useAppSelector((s: any) => s.auth || {});
  const isInWishlist = (id: string) => {
    return wishlistItems.some((item: any) => String(item._id) === String(id));
  };
  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [user, dispatch]); // ✅ FIX
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  if (!books || books.length === 0) {
    return <div className="text-center p-5">Loading...</div>;
  }

  const handleScrollNav = (id: string) => {
    // ✅ FIX => {
    if (window.location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 350); // smooth delay after navigation
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  const articles = [
    {
      title: "How Reading Builds Deep Focus in a Distracted World",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
      category: "Mindset",
      date: "Apr 1, 2026",
    },
    {
      title: "Why Classic Literature Still Matters Today",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
      category: "Literature",
      date: "Mar 28, 2026",
    },
    {
      title: "Creating a Daily Reading Habit That Actually Sticks",
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
      category: "Lifestyle",
      date: "Mar 20, 2026",
    },
  ];

  return (
    <>
      {/* PREMIUM HEADER */}
      <header className="premium-header">
        <div className="container header-inner">
          {/* LOGO */}
          <h2 className="logo">StoryTeller</h2>
          {/* NAV */}
          <nav className="nav-center">
            <span onClick={() => scrollTo("featured")}>Featured</span>

            {/* GENRES */}
            <div className="dropdown-hover">
              Genres ▾
              <div className="dropdown-menu-custom">
                {/* ✅ ALL OPTION */}
                <div
                  className="dropdown-all"
                  onClick={() => applyFilterAndScroll("genre", "all")}
                >
                  All Genres
                </div>

                {genres.map((g: any) => (
                  <div key={g} onClick={() => applyFilterAndScroll("genre", g)}>
                    {g}
                  </div>
                ))}
              </div>
            </div>

            {/* PUBLISHERS */}
            <div className="dropdown-hover">
              Publishers ▾
              <div className="dropdown-menu-custom">
                {/* ✅ ALL OPTION */}
                <div
                  className="dropdown-all"
                  onClick={() => applyFilterAndScroll("publisher", "all")}
                >
                  All Publishers
                </div>

                {publishers.map((p: any) => (
                  <div
                    key={p}
                    onClick={() => applyFilterAndScroll("publisher", p)}
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <div className="dropdown-hover">
              Languages ▾
              <div className="dropdown-menu-custom">
                <div onClick={() => setSelectedLanguage("all")}>
                  All Languages
                </div>

                {(languages as string[]).map((lang) => (
                  <div
                    key={lang}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      scrollTo("popular");
                    }}
                  >
                    {lang}
                  </div>
                ))}
              </div>
            </div>

            <span onClick={() => scrollTo("authorsSection")}>Authors</span>
            <span onClick={() => scrollTo("latest-blog")}>Articles</span>
          </nav>

          {/* RIGHT SIDE */}

          <div className="nav-actions">
            <div className="search-bar">
              <input
                className="search-input-pro"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  scrollTo("popular");
                }}
              />

              <button
                className="search-btn"
                onClick={() => scrollTo("popular")}
              >
                <FaSearch />
              </button>
            </div>

            {/*  AUTH LOGIC */}
            {!user ? (
              //  NOT LOGGED IN
              <button className="btn-login" onClick={() => navigate("/login")}>
                Login
              </button>
            ) : (
              //  LOGGED IN
              <>
                <div className="nav-icons">
                  {/* ❤️ WISHLIST */}
                  <div
                    onClick={() => navigate("/wishlist")}
                    className="icon-wrapper"
                  >
                    <FaHeart />
                    {wishlistItems.length > 0 && (
                      <span className="badge">{wishlistItems.length}</span>
                    )}
                  </div>

                  {/*  CART */}
                  <div
                    onClick={() => navigate("/cart")}
                    className="icon-wrapper"
                  >
                    <FaShoppingCart />
                    {cartItems.length > 0 && (
                      <span className="badge">{cartItems.length}</span>
                    )}
                  </div>
                </div>

                {/*  PROFILE */}
                <div className="profile-dropdown">
                  <button className="btn-login">{user.name} ▾</button>

                  <div className="profile-menu">
                    <div onClick={() => navigate("/profile")}>My Profile</div>
                    <div onClick={() => navigate("/orders")}>My Orders</div>
                    <div onClick={() => navigate("/wishlist")}>Wishlist</div>
                    <div onClick={handleLogout}>Logout</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      {/* HERO / BILLBOARD */}

      <section className="hero-billboard">
        <div className="container">
          <div className="row align-items-center">
            {/* LEFT CONTENT */}
            <div className="col-md-6">
              <div className="hero-text reveal-delay-1">
                <h1 className="hero-title">Explore Stories</h1>

                <p className="hero-desc">
                  Discover handpicked books, timeless classics, and modern
                  stories that inspire your journey.
                </p>

                <div className="hero-buttons">
                  <button className="btn-outline-accent">Read More →</button>

                  <button
                    className="btn-main ms-3"
                    onClick={() => scrollTo("featured")}
                  >
                    Browse Books
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE STACK */}
            <div className="col-md-6">
              <div className="hero-books reveal-delay-2">
                {books.slice(0, 4).map((b: any, i: number) => (
                  <img
                    key={b._id}
                    src={getImage(b.image)}
                    className="hero-book-img"
                    style={{
                      transform: `rotate(${i % 2 === 0 ? "-8deg" : "8deg"}) translateY(${i * 10}px)`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section id="featured" className="py-5 my-5">
        <div className="container">
          <div className="section-header text-center mb-5">
            <div className="title">
              <span>Some quality items</span>
            </div>
            <h2 className="section-title">Featured Books</h2>
          </div>

          <div className="row">
            {books.slice(0, 8).map((book: any) => (
              <div className="col-md-3 mb-4" key={book._id}>
                <div className="product-item">
                  <figure
                    className="product-style"
                    style={{ position: "relative" }}
                  >
                    {/* ❤️ WISHLIST ICON */}
                    <div
                      className={`wishlist-btn ${
                        isInWishlist(book._id) ? "active" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();

                        if (!user) return navigate("/login");

                        dispatch(addToWishlist(book._id));
                      }}
                    >
                      ❤️
                    </div>
                    <img
                      src={getImage(book?.image)}
                      alt={book.title}
                      className="product-img"
                    />

                    {/* EXACT TEMPLATE BUTTON */}
                    <button
                      className="add-to-cart"
                      onClick={() => {
                        if (!user) return navigate("/login");
                        dispatch(addToCart(book._id));
                      }}
                    >
                      Add to Cart
                    </button>
                  </figure>

                  <figcaption className="text-center mt-3">
                    <h6 className="mb-1">{book.title}</h6>
                    <span className="text-muted small">
                      {book.author?.name}
                    </span>
                    <div className="item-price mt-1">₹ {book.price}</div>
                  </figcaption>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* BEST SELLER */}
      <section className="py-5" style={{ background: "#fdf6ec" }}>
        <div className="container">
          {bestSeller && (
            <div className="row align-items-center justify-content-center">
              <div className="col-md-5 text-center">
                <img
                  src={getImage(bestSeller.image)}
                  style={{
                    maxHeight: "380px",
                    objectFit: "contain",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    borderRadius: "10px",
                  }}
                />
              </div>

              <div className="col-md-5">
                <h2 className="mb-3" style={{ fontFamily: "serif" }}>
                  Best Selling Book
                </h2>

                <p className="text-muted">By {bestSeller.author?.name}</p>

                <h3 className="fw-bold">{bestSeller.title}</h3>

                <p className="text-muted">
                  A must-read book loved by readers. Discover why this book is
                  trending among readers.
                </p>

                <h4 className="fw-bold mb-3">₹{bestSeller.price}</h4>

                <button
                  onClick={() => {
                    if (!user) return navigate("/login");

                    dispatch(addToCart(bestSeller._id)); // ✅ FIX
                    navigate("/books");
                  }}
                  className="btn-main"
                >
                  Shop Now →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* QUOTE OF THE DAY */}
      <section id="quotation" className="text-center py-5">
        <h2 className="mb-4">Quote of the Day</h2>

        <blockquote style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p style={{ fontSize: "1.2rem", fontStyle: "italic" }}>
            “The more that you read, the more things you will know. The more
            that you learn, the more places you’ll go.”
          </p>
          <div className="fw-bold mt-2">— Dr. Seuss</div>
        </blockquote>
      </section>
      {/* POPULAR / CATEGORY (BOOKSAW STYLE) */}
      <section id="popular" className="bookshelf py-5 my-5">
        <div className="container">
          {/* HEADER */}
          <div className="section-header text-center mb-5">
            <div className="title">
              <span>Some quality items</span>
            </div>
            <h2 className="section-title">Browse Categories</h2>
          </div>

          {/* TABS */}
          <ul className="custom-tabs">
            {[
              "all",
              "Literature",
              "Classic",
              "Adventure",
              "Modern",
              "Horror",
              "Mystery",
              "Philosophy",
            ].map((tab) => (
              <li
                key={tab}
                className={`tab-item ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>

          {/* BOOK GRID */}
          <section id="categoriesSection"></section>
          <div className="row mt-4">
            {filteredBooks
              .filter((b: any) => {
                if (activeTab === "all") return true;
                return b.category?.name
                  ?.toLowerCase()
                  .includes(activeTab.toLowerCase());
              })
              .slice(0, 8)
              .map((book: any, i: number) => (
                <div className="col-md-3 mb-4" key={book._id}>
                  <div
                    className="product-item reveal-up"
                    style={{ transitionDelay: `${i * 0.1}s` }}
                  >
                    <figure
                      className="product-style"
                      style={{ position: "relative" }}
                    >
                      {/* ❤️ WISHLIST ICON */}
                      <div
                        className={`wishlist-btn ${
                          isInWishlist(book._id) ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (!user) return navigate("/login");
                          dispatch(addToWishlist(book._id));
                        }}
                      >
                        ❤️
                      </div>
                      <img
                        src={getImage(book?.image)}
                        className="product-img"
                      />

                      <button
                        className="add-to-cart"
                        onClick={() => {
                          if (!user) return navigate("/login");

                          dispatch(addToCart(book._id));
                        }}
                      >
                        Add to Cart
                      </button>
                    </figure>

                    <figcaption className="text-center mt-3">
                      <h6>{book.title}</h6>
                      <span className="text-muted small">
                        {book.author?.name}
                      </span>
                      <div className="item-price">₹ {book.price}</div>
                    </figcaption>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* CLASSIC AUTHORS */}
      <section id="authorsSection">
        <div className="container text-center">
          <h2 className="mb-5 text-center">Classic Authors</h2>

          <div className="row justify-content-center text-center">
            {classicAuthors.map((a: any, i: number) => (
              <div
                className="col-md-2 col-6 mb-4 d-flex justify-content-center"
                key={a._id}
                onClick={() => navigate(`/author/${a._id}`)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="author-circle reveal-up text-center"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <img src={getImage(a?.image)} alt={a.name} />
                  <p className="mt-2">{a.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR AUTHORS */}
      <section className="py-5 text-center" style={{ background: "#fdf6ec" }}>
        <div className="container">
          <h2 className="mb-5">Popular Authors</h2>

          <div className="row justify-content-center">
            {popularAuthors.map((a: any, i: number) => (
              <div
                className="col-md-2 col-6 mb-4"
                key={a._id}
                onClick={() => navigate(`/author/${a._id}`)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="author-circle reveal-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <img src={getImage(a?.image)} />
                  <p>{a.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section className="py-5" style={{ background: "#fff3e6" }}>
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-5">
              <h2 className="section-title">Subscribe to our newsletter</h2>
            </div>

            <div className="col-md-5">
              <p className="text-muted">
                Latest book updates, offers and reading tips directly in your
                inbox. Get in touch with our StoryTeller Support Team→
              </p>

              <button onClick={() => navigate("/support")} className="btn-main">
                Send your Email→
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST ARTICLES (BOOKSAW STYLE) */}
      <section id="latest-blog" className="py-5 my-5">
        <div className="container">
          <div className="section-header text-center mb-5">
            <div className="title">
              <span>Read our articles</span>
            </div>
            <h2 className="section-title">Latest Articles</h2>
          </div>

          <div className="row">
            {articles.map((post, i) => (
              <div className="col-md-4 mb-4" key={i}>
                <article
                  className="post-card reveal-up"
                  style={{ transitionDelay: `${i * 0.2}s` }}
                >
                  {/* IMAGE */}
                  <div className="post-img-wrapper">
                    <img src={post.image} className="post-image" />
                  </div>

                  {/* CONTENT */}
                  <div className="post-content">
                    <div className="meta-date">{post.date}</div>

                    <h5 className="post-title">{post.title}</h5>

                    <div className="post-footer">
                      <span className="category">{post.category}</span>

                      <div className="social-icons">
                        <i className="icon icon-facebook"></i>
                        <i className="icon icon-twitter"></i>
                        <i className="icon icon-behance-square"></i>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <button className="btn-outline-accent">Read All Articles →</button>
          </div>
        </div>
      </section>
      {/* VISION SECTION */}
      <section id="vision" className="py-5" style={{ background: "#fff" }}>
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="section-title">Our Vision</h2>
          </div>

          <div className="row align-items-center">
            {/* IMAGE */}
            <div className="col-md-6 mb-4">
              <img
                src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d"
                className="w-100"
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
                }}
              />
            </div>

            {/* TEXT */}
            <div className="col-md-6">
              <h3 className="mb-3">Inspiring Readers Everywhere</h3>

              <p className="text-muted" style={{ lineHeight: "1.8" }}>
                At <strong>StoryTeller</strong>, our vision is to create a
                platform where reading becomes a daily habit and knowledge is
                accessible to everyone.
              </p>

              <p className="text-muted" style={{ lineHeight: "1.8" }}>
                We bring together timeless classics and modern literature to
                inspire creativity, curiosity, and personal growth.
              </p>

              <p className="text-muted">
                Books are more than stories — they shape ideas, spark
                imagination, and transform lives.
              </p>
            </div>
          </div>
        </div>
      </section>
<section className="download-section">
  <div className="container">
    <div className="row align-items-center justify-content-between">

      {/* 📱 IMAGE */}
      <div className="col-md-5 text-center mb-4 mb-md-0">
        <img
          src={`${import.meta.env.VITE_API_URL || "https://library-app-1-0n0j.onrender.com"}/uploads/mobile.png`}
          alt="mobile"
          className="mobile-img"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png";
          }}
        />
      </div>

      {/* TEXT */}
      <div className="col-md-6">
        <h2 className="download-title">Download Our App Now</h2>

        <p className="download-text">
          Read books anywhere, anytime. Discover thousands of stories
          right from your phone.
        </p>

        <div className="store-buttons">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
            alt="playstore"
          />

          <img
            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
            alt="appstore"
          />
        </div>
      </div>

    </div>
  </div>
</section>
      {/* TERMS & CONDITIONS */}
      <section id="terms" className="py-5" style={{ background: "#fdf6ec" }}>
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="section-title">Terms & Conditions</h2>
          </div>

          <div className="row">
            {[
              {
                icon: <FaUserShield />,
                title: "User Responsibility",
                desc: "Users must provide accurate information and maintain account security.",
              },
              {
                icon: <FaShoppingCart />,
                title: "Orders & Payments",
                desc: "All purchases are subject to availability and confirmation.",
              },
              {
                icon: <FaTag />,
                title: "Pricing Policy",
                desc: "Prices and offers may change without prior notice.",
              },
              {
                icon: <FaLock />,
                title: "Account Usage",
                desc: "Unauthorized activity may result in suspension of your account.",
              },
              {
                icon: <FaCopyright />,
                title: "Content Rights",
                desc: "All content is protected under copyright laws.",
              },
              {
                icon: <FaFileContract />,
                title: "Agreement",
                desc: "Using StoryTeller means you agree to our terms and policies.",
              },
            ].map((item, i) => (
              <div className="col-md-4 mb-4" key={i}>
                <div
                  className="term-card"
                  style={{
                    padding: "25px",
                    borderRadius: "14px",
                    background: "#fff",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    height: "100%",
                    transition: "0.3s",
                    textAlign: "center",
                  }}
                >
                  {/* ICON */}
                  <div
                    style={{
                      fontSize: "28px",
                      color: "#c76509",
                      marginBottom: "10px",
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* TITLE */}
                  <h5 className="mb-2">{item.title}</h5>

                  {/* DESC */}
                  <p
                    className="text-muted mb-0"
                    style={{ fontSize: "0.95rem" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT + MAP (FULL WIDTH BOTTOM STYLE) */}
      <section className="contact-map-section">
        {/* MAP FULL WIDTH */}
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps?q=College+Street+Surya+Sen+Street+Kolkata&output=embed"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        {/* CONTACT INFO */}
        <section id="contact"></section>
        <div className="container py-5 text-center">
          <h2 className="section-title mb-4">Contact Us</h2>

          <div className="row justify-content-center">
            {/* ADDRESS */}
            <div className="col-md-3 mb-4">
              <div className="contact-box">
                <h5>📍 Address</h5>
                <p>
                  45, Surya Sen Street
                  <br />
                  Kolkata - 700073
                </p>
              </div>
            </div>

            {/* PHONE */}
            <div className="col-md-3 mb-4">
              <div className="contact-box">
                <h5>📞 Phone</h5>
                <p> +91 9123456789</p>
              </div>
            </div>

            {/* EMAIL */}
            <div className="col-md-3 mb-4">
              <div className="contact-box">
                <h5>✉ Email</h5>
                <p>support@storyteller.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-pro">
        <div className="container">
          <div className="row">
            {/* BRAND */}
            <div className="col-md-4 mb-4">
              <h3
                className="footer-logo"
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
              >
                StoryTeller
              </h3>

              <p className="footer-desc">
                Discover books, authors and stories that inspire your journey.
              </p>
            </div>

            <div className="col-md-2">
              <h6 className="footer-title">About</h6>
              <ul className="footer-links">
                <li onClick={() => handleScrollNav("vision")}>Vision</li>

                <li onClick={() => handleScrollNav("latest-blog")}>Articles</li>

                <li onClick={() => handleScrollNav("quotation")}>
                  Today's Quote
                </li>

                <li onClick={() => handleScrollNav("terms")}>Terms</li>
              </ul>
            </div>

            <div className="col-md-2">
              <h6 className="footer-title">Discover</h6>
              <ul className="footer-links">
                <li onClick={() => navigate("/books")}>Books</li>

                <li onClick={() => handleScrollNav("authorsSection")}>
                  Authors
                </li>

                <li onClick={() => handleScrollNav("categoriesSection")}>
                  Categories
                </li>

                <li onClick={() => handleScrollNav("featured")}>Search</li>
              </ul>
            </div>

            {/* ACCOUNT */}
            <div className="col-md-2">
              <h6 className="footer-title">My Account</h6>
              <ul className="footer-links">
                <li onClick={() => navigate("/login")}>Login</li>
                <li onClick={() => navigate("/wishlist")}>Wishlist</li>
                <li onClick={() => navigate("/cart")}>Cart</li>
                <li onClick={() => navigate("/orders")}>Orders</li>
              </ul>
            </div>

            {/* HELP */}
            <div className="col-md-2">
              <h6 className="footer-title">Latest News & Help</h6>
              <ul className="footer-links">
                <li onClick={() => navigate("/support")}>Support</li>
                <li onClick={() => handleScrollNav("contact")}>Contact</li>
                <li onClick={() => navigate("/report")}>News & Report</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* FOOTER BOTTOM */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner text-center">
          {/* SOCIAL ICONS */}
          <div className="footer-socials mb-2">
            <span onClick={() => window.open("https://facebook.com", "_blank")}>
              <FaFacebookF />
            </span>

            <span onClick={() => window.open("https://twitter.com", "_blank")}>
              <FaTwitter />
            </span>

            <span
              onClick={() => window.open("https://instagram.com", "_blank")}
            >
              <FaInstagram />
            </span>
          </div>

          {/* COPYRIGHT */}
          <span className="footer-copy">
            © 2026 StoryTeller. All rights reserved.
          </span>
        </div>
      </div>
      {/* 🔥 FLOATING HELP DESK BUTTON */}
      <button className="helpdesk-float" onClick={() => navigate("/support")}>
        💬 Help
      </button>
    </>
  );
}
