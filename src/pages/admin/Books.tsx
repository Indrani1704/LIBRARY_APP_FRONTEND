import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Dialog,
  
  DialogContent,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchBooks } from "../../store/slices/bookSlice";
import { fetchAuthors } from "../../store/slices/authorSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import { fetchPublishers } from "../../store/slices/publisherSlice";
import API from "../../services/api";

const BASE_URL = "http://localhost:5000";

// ✅ FIX optional
const getImage = (img?: string) => {
  if (!img) return "/placeholder.png";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}/${img}`;
};

export default function AdminBooks() {
  const dispatch = useAppDispatch();

  // ✅ FIX types (avoid "never")
  const { books = [] } = useAppSelector((s: any) => s.books || {});
  const { authors = [] } = useAppSelector((s: any) => s.authors || {});
  const { categories = [] } = useAppSelector((s: any) => s.categories || {});
  const { publishers = [] } = useAppSelector((s: any) => s.publishers || {});

  const [form, setForm] = useState({
    title: "",
    price: "",
    genre: "",
    language: "",
    category: "",
    author: "",
    publisher: "",
    isBestSeller: false,
  });

  const [image, setImage] = useState<File | null>(null);
  const [editBook, setEditBook] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchAuthors());
    dispatch(fetchCategories());
    dispatch(fetchPublishers());
  }, [dispatch]);

  // ✅ FIX typing
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      data.append(k, String(v)); // ✅ FIX
    });

    if (image) data.append("image", image);

    await API.post("/books", data);
    dispatch(fetchBooks());

    setForm({
      title: "",
      price: "",
      genre: "",
      language: "",
      category: "",
      author: "",
      publisher: "",
      isBestSeller: false,
    });

    setImage(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete book?")) return;
    await API.delete(`/books/${id}`);
    dispatch(fetchBooks());
  };

  const handleUpdate = async () => {
    if (!editBook?._id) return; // ✅ FIX

    const formData = new FormData();

    formData.append("title", editBook.title);

    formData.append(
      "author",
      editBook.author?._id || editBook.author
    );

    formData.append(
      "category",
      editBook.category?._id || editBook.category
    );

    formData.append("price", String(editBook.price)); // ✅ FIX

    if (editBook.image instanceof File) {
      formData.append("image", editBook.image);
    }

    await API.put(`/books/${editBook._id}`, formData);

    dispatch(fetchBooks());
    setEditBook(null);
  };

return (
  <Box
    sx={{
      px: 4,
      py: 3,
      fontFamily: "Inter, sans-serif",
      background: "#f5f7fb",
      minHeight: "100vh",
    }}
  >

    {/* HEADER */}
    <Typography
      sx={{
        fontFamily: "Playfair Display, serif",
        fontSize: 26,
        fontWeight: 600,
        mb: 3,
        color: "#1e293b",
      }}
    >
      Books Management
    </Typography>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "340px 1fr",
        gap: 3,
        alignItems: "start",
      }}
    >

      {/* ===== FORM ===== */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Playfair Display",
            fontWeight: 600,
            mb: 2,
          }}
        >
          Add Book
        </Typography>

        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>

          <TextField label="Title" name="title" value={form.title} onChange={handleChange} size="small" fullWidth />

          <Box display="flex" gap={2}>
            <TextField label="Price" name="price" value={form.price} onChange={handleChange} size="small" fullWidth />
            <TextField label="Language" name="language" value={form.language} onChange={handleChange} size="small" fullWidth />
          </Box>

          <TextField label="Genre" name="genre" value={form.genre} onChange={handleChange} size="small" />

          <TextField select label="Author" name="author" value={form.author} onChange={handleChange} size="small">
            {authors.map((a: any) => (
              <MenuItem key={a._id} value={a._id}>{a.name}</MenuItem>
            ))}
          </TextField>

          <TextField select label="Category" name="category" value={form.category} onChange={handleChange} size="small">
            {categories.map((c: any) => (
              <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
            ))}
          </TextField>

          <TextField select label="Publisher" name="publisher" value={form.publisher} onChange={handleChange} size="small">
            {publishers.map((p: any) => (
              <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={
              <Checkbox
                checked={form.isBestSeller}
                onChange={handleChange}
                name="isBestSeller"
              />
            }
            label="Bestseller"
          />

          <Button
            variant="outlined"
            component="label"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              borderColor: "#cbd5e1",
              color: "#475569",
            }}
          >
            Upload Image
            <input hidden type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={{
              background: "#2563eb",
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { background: "#1d4ed8" },
            }}
          >
            Add Book
          </Button>

        </Box>
      </Paper>

      {/* ===== TABLE ===== */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Playfair Display",
            fontWeight: 600,
            mb: 2,
          }}
        >
          Book List
        </Typography>

        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f8fafc" }}>
              <TableCell sx={{ fontWeight: 600 }}>Book</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Author</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Publisher</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {books.map((book: any) => (
              <TableRow
                key={book._id}
                hover
                sx={{ "&:hover": { background: "#f9fafb" } }}
              >

                {/* BOOK */}
                <TableCell>
                  <Box display="flex" gap={2} alignItems="center">
                    <Avatar
                      src={getImage(book.image)}
                      variant="rounded"
                      sx={{ width: 45, height: 55 }}
                    />
                    <Box>
                      <Typography fontWeight={500}>
                        {book.title}
                      </Typography>
                      <Typography fontSize={12} color="text.secondary">
                        {book.genre}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>{book.author?.name}</TableCell>
                <TableCell>{book.category?.name}</TableCell>
                <TableCell>{book.publisher?.name}</TableCell>
                <TableCell>₹{book.price}</TableCell>

                {/* ACTIONS */}
                <TableCell>
                  <Box sx={{ display: "flex", gap: "10px" }}>

                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        backgroundColor: "#2563eb !important",
                        color: "#fff",
                        textTransform: "none",
                        borderRadius: "8px",
                        px: 2,
                        boxShadow: "0 2px 6px rgba(37,99,235,0.3)",
                        "&:hover": {
                          backgroundColor: "#1d4ed8 !important",
                        },
                      }}
                      onClick={() => setEditBook(book)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        backgroundColor: "#dc2626 !important",
                        color: "#fff",
                        textTransform: "none",
                        borderRadius: "8px",
                        px: 2,
                        boxShadow: "0 2px 6px rgba(220,38,38,0.3)",
                        "&:hover": {
                          backgroundColor: "#b91c1c !important",
                        },
                      }}
                      onClick={() => handleDelete(book._id)}
                    >
                      Delete
                    </Button>

                  </Box>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>

      </Paper>

    </Box>

    {/* ===== EDIT MODAL ===== */}
    <Dialog open={!!editBook} onClose={() => setEditBook(null)}>
      <DialogContent sx={{ minWidth: 350 }}>

        <Typography sx={{ fontFamily: "Playfair Display", fontWeight: 600, mb: 2 }}>
          Edit Book
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>

          <TextField
            label="Title"
            value={editBook?.title || ""}
            onChange={(e) =>
              setEditBook({ ...editBook, title: e.target.value })
            }
            size="small"
          />

          <TextField
            label="Price"
            value={editBook?.price || ""}
            onChange={(e) =>
              setEditBook({ ...editBook, price: e.target.value })
            }
            size="small"
          />

          <TextField
            select
            label="Author"
            value={editBook?.author?._id || editBook?.author || ""}
            onChange={(e) =>
              setEditBook({ ...editBook, author: e.target.value })
            }
            size="small"
          >
            {authors.map((a: any) => (
              <MenuItem key={a._id} value={a._id}>{a.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Category"
            value={editBook?.category?._id || editBook?.category || ""}
            onChange={(e) =>
              setEditBook({ ...editBook, category: e.target.value })
            }
            size="small"
          >
            {categories.map((c: any) => (
              <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Publisher"
            value={editBook?.publisher?._id || editBook?.publisher || ""}
            onChange={(e) =>
              setEditBook({ ...editBook, publisher: e.target.value })
            }
            size="small"
          >
            {publishers.map((p: any) => (
              <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            sx={{ background: "#2563eb" }}
            onClick={handleUpdate}
          >
            Update Book
          </Button>

        </Box>

      </DialogContent>
    </Dialog>

  </Box>
);
}