import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import API from "../../services/api";



const getImage = (img?: string) => { // ✅ FIX optional
  if (!img) return "/placeholder.png";
  if (img.startsWith("http")) return img;
  return `${import.meta.env.VITE_API_URL}/${img}`;
};

export default function CategoriesPage() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editCategory, setEditCategory] = useState<any>(null);

  const navigate = useNavigate();

  /* FETCH CATEGORY STATS */
  const fetchData = async () => {
    try {
      const res = await API.get("/books");
      const books = res.data.data || [];

      const map: any = {};

      books.forEach((b: any) => {
        const cat = b.category?.name || "Other";
        map[cat] = (map[cat] || 0) + 1;
      });

      const chartData = Object.keys(map).map((key) => ({
        name: key,
        value: map[key],
      }));

      setData(chartData);
    } catch (err) {
      console.log(err);
    }
  };
console.log(data); // ✅ prevents TS unused error
  /* FETCH CATEGORIES */
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  /* CREATE CATEGORY */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token"); // ✅ FIX

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);

      await API.post("/categories", formData);

      setName("");
      setImage(null);

      fetchData();
      fetchCategories();
    } catch (error: any) {
      if (error?.response?.status === 401) {
        sessionStorage.clear(); // ✅ FIX
        navigate("/login");
      } else {
        alert("Failed to add category");
      }
    } finally {
      setLoading(false);
    }
  };

  /* DELETE */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete category?")) return;

    await API.delete(`/categories/${id}`);
    fetchCategories();
  };

  /* UPDATE */
  const handleUpdate = async () => {
    if (!editCategory?._id) return; // ✅ FIX

    const formData = new FormData();

    formData.append("name", editCategory.name);

    if (editCategory.image instanceof File) {
      formData.append("image", editCategory.image);
    }

    await API.put(`/categories/${editCategory._id}`, formData);

    fetchCategories();
    setEditCategory(null);
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

    {/* TITLE */}
    <Typography
      sx={{
        fontFamily: "Playfair Display, serif",
        fontSize: 26,
        fontWeight: 600,
        mb: 3,
        color: "#1e293b",
      }}
    >
      Manage Categories
    </Typography>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
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
          Add Category
        </Typography>

        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>

          <TextField
            size="small"
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
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
            <input
              hidden
              type="file"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </Button>

          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            sx={{
              background: "#2563eb",
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { background: "#1d4ed8" },
            }}
          >
            {loading ? "Adding..." : "Add Category"}
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
          Categories List
        </Typography>

        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f8fafc" }}>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.map((cat: any) => (
              <TableRow
                key={cat._id}
                hover
                sx={{ "&:hover": { background: "#f9fafb" } }}
              >

                {/* CATEGORY */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      src={getImage(cat.image)}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Typography fontWeight={500}>
                      {cat.name}
                    </Typography>
                  </Box>
                </TableCell>

                {/* ACTIONS */}
                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "10px",
                    }}
                  >

                    {/* EDIT */}
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setEditCategory(cat)}
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
                    >
                      Edit
                    </Button>

                    {/* DELETE */}
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleDelete(cat._id)}
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
    <Dialog open={!!editCategory} onClose={() => setEditCategory(null)}>

      <DialogTitle sx={{ fontFamily: "Playfair Display" }}>
        Edit Category
      </DialogTitle>

      <DialogContent>

        <Box display="flex" justifyContent="center" mt={2}>
          <Avatar
            src={
              editCategory?.image instanceof File
                ? URL.createObjectURL(editCategory.image)
                : getImage(editCategory?.image)
            }
            sx={{ width: 70, height: 70 }}
          />
        </Box>

        <TextField
          fullWidth
          label="Name"
          value={editCategory?.name || ""}
          onChange={(e) =>
            setEditCategory({
              ...editCategory,
              name: e.target.value,
            })
          }
          sx={{ mt: 2 }}
        />

        <Button component="label" sx={{ mt: 2 }}>
          Upload Image
          <input
            hidden
            type="file"
            onChange={(e) =>
              setEditCategory({
                ...editCategory,
                image: e.target.files?.[0],
              })
            }
          />
        </Button>

        <Button
          sx={{
            mt: 2,
            background: "#2563eb",
          }}
          variant="contained"
          onClick={handleUpdate}
        >
          Update
        </Button>

      </DialogContent>
    </Dialog>

  </Box>
);
}