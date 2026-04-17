import { useEffect } from "react";
import "../../../style.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";

import { fetchAuthors } from "../../store/slices/authorSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import { fetchPublishers } from "../../store/slices/publisherSlice";
import { fetchBooks } from "../../store/slices/bookSlice";
import { FaBook, FaUser, FaTags, FaBuilding } from "react-icons/fa";


const getImage = (img?: string) => {
  if (!img) return "/placeholder.png";
  if (img.startsWith("http")) return img;
  return `${import.meta.env.VITE_API_URL}/${img}`;
};

const Dashboard = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchAuthors());
    dispatch(fetchCategories());
    dispatch(fetchPublishers());
  }, [dispatch]);

  const books = useAppSelector((s: any) => s.books?.books || []);
  const authors = useAppSelector((s: any) => s.authors?.authors || []);
  const categories = useAppSelector((s: any) => s.categories?.categories || []);
  const publishers = useAppSelector((s: any) => s.publishers?.publishers || []);

  // ===== HELPERS =====
  const getCount = (field: string, id: string) =>
    books.filter((b: any) => b[field]?._id === id).length;

  const short = (t: string) =>
    t.length > 8 ? t.slice(0, 8) + "…" : t;

  // ===== DATA =====
  const categoryData = categories
    .map((c: any) => ({
      name: short(c.name),
      value: getCount("category", c._id),
    }))
    .filter((c) => c.value > 0);

  const publisherData = publishers
    .map((p: any) => ({
      name: short(p.name),
      value: getCount("publisher", p._id),
    }))
    .filter((p) => p.value > 0);

  const authorData = authors
    .map((a: any) => ({
      name: short(a.name),
      value: getCount("author", a._id),
    }))
    .filter((a) => a.value > 0);

  const topAuthors = authors
    .map((a: any) => ({
      ...a,
      count: getCount("author", a._id),
    }))
    .filter((a) => a.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // ===== CHART =====
  const Chart = ({ data, color }: any) => {
    if (!data.length) return <p className="no-data">No Data</p>;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar
            dataKey="value"
            fill={color}
            barSize={28}
            minPointSize={6}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="dashboard">

      <h2 className="title">Dashboard Overview</h2>
<div className="kpi-row">

  <div className="kpi-card pastel1">
    <div className="kpi-icon"><FaBook /></div>
    <h3>{books.length}</h3>
    <p>Total Books</p>
  </div>

  <div className="kpi-card pastel2">
    <div className="kpi-icon"><FaUser /></div>
    <h3>{authors.length}</h3>
    <p>Total Authors</p>
  </div>

  <div className="kpi-card pastel3">
    <div className="kpi-icon"><FaTags /></div>
    <h3>{categories.length}</h3>
    <p>Total Categories</p>
  </div>

  <div className="kpi-card pastel4">
    <div className="kpi-icon"><FaBuilding /></div>
    <h3>{publishers.length}</h3>
    <p>Total Publishers</p>
  </div>

</div>
      {/* ===== CHARTS ===== */}
      <div className="chart-row">

        <div className="card">
          <h4>Genres</h4>
          <div className="chart-box">
            <Chart data={categoryData} color="#7c2d12" />
          </div>
        </div>

        <div className="card">
          <h4>Categories</h4>
          <div className="chart-box">
            <Chart data={categoryData} color="#92400e" />
          </div>
        </div>

        <div className="card">
          <h4>Publishers</h4>
          <div className="chart-box">
            <Chart data={publisherData} color="#ea580c" />
          </div>
        </div>

        <div className="card">
          <h4>Authors</h4>
          <div className="chart-box">
            <Chart data={authorData} color="#fb923c" />
          </div>
        </div>

      </div>

      {/* ===== LOWER ===== */}
      <div className="lower-row">

        <div className="card">
          <h4>Books</h4>
          {books.slice(0, 5).map((b: any) => (
            <div className="list-item" key={b._id}>
              <img src={getImage(b.image)} />
              <span>{b.title}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h4>Categories</h4>
          {categories.slice(0, 5).map((c: any) => (
            <div className="list-item" key={c._id}>
              <img src={getImage(c.image)} />
              <span>{c.name}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h4>Publishers</h4>
          {publishers.slice(0, 5).map((p: any) => (
            <div className="list-item" key={p._id}>
              <img src={getImage(p.image)} />
              <span>{p.name}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h4>Top Authors</h4>
          {topAuthors.map((a: any) => (
            <div className="top-author" key={a._id}>
              <div className="list-item">
                <img src={getImage(a.image)} />
                <span>{a.name}</span>
              </div>
              <strong>{a.count}</strong>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default Dashboard;