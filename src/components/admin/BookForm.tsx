import { useState, useEffect } from "react"; // ✅ FIX
import type { ChangeEvent, FormEvent } from "react"; // ✅ FIX

import { useAppDispatch } from "../../hooks/reduxHooks";
import { createBook } from "../../store/slices/bookSlice";
import API from "../../services/api";

interface Author {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Publisher {
  _id: string;
  name: string;
}

const BookForm = () => {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    genre: "",
    bookLanguage: "",
    publisher: "",
    author: "",
    category: "",
    isBestSeller: false,
  });

  const [image, setImage] = useState<File | null>(null);

  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const a = await API.get("/authors");
        const c = await API.get("/categories");
        const p = await API.get("/publishers");

        setAuthors(a.data.data || []);
        setCategories(c.data.data || []);
        setPublishers(p.data.data || []);
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.author || !form.category || !form.publisher) {
      alert(" Please fill all required fields");
      return;
    }

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, String(value)); // ✅ FIX safer
    });

    if (image) formData.append("image", image);

    dispatch(createBook(formData as any)); // ✅ FIX TS error
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow mb-5">
      <h2 className="text-xl font-bold mb-4">Add Book</h2>

      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
      <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
      <input name="bookLanguage" placeholder="Language" value={form.bookLanguage} onChange={handleChange} />

      {/* Publisher */}
      <select name="publisher" value={form.publisher} onChange={handleChange}>
        <option value="">Select Publisher</option>
        {publishers.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Author */}
      <select name="author" value={form.author} onChange={handleChange}>
        <option value="">Select Author</option>
        {authors.map((a) => (
          <option key={a._id} value={a._id}>
            {a.name}
          </option>
        ))}
      </select>

      {/* Category */}
      <select name="category" value={form.category} onChange={handleChange}>
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <label>
        <input
          type="checkbox"
          name="isBestSeller"
          checked={form.isBestSeller}
          onChange={handleChange}
        />
        Bestseller
      </label>

      <input
        type="file"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />

      <button className="bg-black text-white px-4 py-2 mt-3">
        Add Book
      </button>
    </form>
  );
};

export default BookForm;