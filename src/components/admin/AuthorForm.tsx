import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
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
  DialogTitle,
  DialogContent,
} from "@mui/material";

import API from "../../services/api";

const BASE_URL = "http://localhost:5000";

const getImage = (img: string) => {
  if (!img) return "/placeholder.png";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}/${img}`;
};

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [isClassic, setIsClassic] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const [editAuthor, setEditAuthor] = useState<any>(null);

  /* FETCH */
  const fetchAuthors = async () => {
    const res = await API.get("/authors");
    setAuthors(res.data.data);
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  /* CREATE */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("isClassic", String(isClassic));
    if (image) formData.append("image", image);

    await API.post("/authors", formData);

    setName("");
    setIsClassic(false);
    setImage(null);

    fetchAuthors();
  };

  /* DELETE */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete author?")) return;
    await API.delete(`/authors/${id}`);
    fetchAuthors();
  };

  /* UPDATE */
 const handleUpdate = async () => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("name", editAuthor.name);
  formData.append("isClassic", editAuthor.isClassic);

  // if you add image later
  if (editAuthor.image instanceof File) {
    formData.append("image", editAuthor.image);
  }

  await API.put(`/authors/${editAuthor._id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fetchAuthors();
  setEditAuthor(null);
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
      Manage Authors
    </Typography>

    {/* LAYOUT */}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "320px 1fr",
        gap: 3,
        alignItems: "start",
      }}
    >

      {/* ================= FORM ================= */}
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
          Add Author
        </Typography>

        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>

          <TextField
            size="small"
            label="Author Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isClassic}
                onChange={(e) => setIsClassic(e.target.checked)}
              />
            }
            label="Classic Author"
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
            Add Author
          </Button>

        </Box>
      </Paper>

      {/* ================= TABLE ================= */}
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
          Authors List
        </Typography>

        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f8fafc" }}>
              <TableCell sx={{ fontWeight: 600 }}>Author</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {authors.map((author) => (
              <TableRow
                key={author._id}
                hover
                sx={{ "&:hover": { background: "#f9fafb" } }}
              >

                {/* AUTHOR */}
                <TableCell>
                  <Box display="flex" gap={2} alignItems="center">
                    <Avatar
                      src={getImage(author.image)}
                      sx={{ width: 45, height: 45 }}
                    />
                    <Typography fontWeight={500}>
                      {author.name}
                    </Typography>
                  </Box>
                </TableCell>

                {/* TYPE */}
                <TableCell>
                  {author.isClassic ? "Classic" : "Modern"}
                </TableCell>

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
      onClick={() => setEditAuthor(author)}
      sx={{
        backgroundColor: "#2563eb !important",
        color: "#fff !important",
        textTransform: "none",
        borderRadius: "8px",
        padding: "4px 14px",
        fontWeight: 500,
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
      onClick={() => handleDelete(author._id)}
      sx={{
        backgroundColor: "#dc2626 !important",
        color: "#fff !important",
        textTransform: "none",
        borderRadius: "8px",
        padding: "4px 14px",
        fontWeight: 500,
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

    {/* ================= EDIT MODAL ================= */}
    <Dialog open={!!editAuthor} onClose={() => setEditAuthor(null)} maxWidth="xs" fullWidth>

      <DialogTitle sx={{ fontFamily: "Playfair Display" }}>
        Edit Author
      </DialogTitle>

      <DialogContent>

        <Box display="flex" justifyContent="center" mt={2}>
          <Avatar
            src={
              editAuthor?.image instanceof File
                ? URL.createObjectURL(editAuthor.image)
                : getImage(editAuthor?.image)
            }
            sx={{ width: 80, height: 80 }}
          />
        </Box>

        <TextField
          fullWidth
          label="Author Name"
          value={editAuthor?.name || ""}
          onChange={(e) =>
            setEditAuthor({ ...editAuthor, name: e.target.value })
          }
          sx={{ mt: 3 }}
        />

        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mt: 2 }}
        >
          Upload New Image
          <input
            hidden
            type="file"
            onChange={(e) =>
              setEditAuthor({
                ...editAuthor,
                image: e.target.files?.[0],
              })
            }
          />
        </Button>

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            background: "#2563eb",
          }}
          onClick={handleUpdate}
        >
          Update Author
        </Button>

      </DialogContent>
    </Dialog>

  </Box>
);
}