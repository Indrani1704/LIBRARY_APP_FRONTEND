import { useEffect, useState } from "react";
import "../../style.css";

interface News {
  title: string;
  source: { name: string };
  publishedAt: string;
  url: string;
  urlToImage?: string;
}

const API_KEY = "1e618d6bbcdf42b0b2f0d137a996e451";

const FALLBACK_IMG = "https://placehold.co/600x400?text=No+Image";

const Reports = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchNews = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/news`
      );

      const data = await res.json();

      if (data.status !== "ok") {
        throw new Error();
      }

      setNews(data.articles || []);
    } catch (err) {
      setError("⚠️ Unable to load news");
    } finally {
      setLoading(false);
    }
  };

  fetchNews();
}, []);

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Literature Insights</h1>
        <p>Stay updated with global books & literary trends</p>
      </div>

      <section className="reports-section">
        <h2> Latest Literature News</h2>

        {loading && <p className="loading">Fetching news...</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="news-grid">
          {news.map((item, index) => (
            <div key={index} className="premium-card">
              <div className="image-wrapper">
                <img
                  src={item.urlToImage || FALLBACK_IMG}
                  alt="news"
                />
                <div className="overlay" />

                <span className="badge">
                  {item.source?.name || "News"}
                </span>
              </div>

              <div className="card-content">
                <h3>{item.title}</h3>

                <p className="date">
                  {new Date(item.publishedAt).toDateString()}
                </p>

                <a href={item.url} target="_blank" rel="noreferrer">
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Reports;