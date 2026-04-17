import { useEffect, useState } from "react";
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

import API from "../../services/api";



const getImage = (img: string) => {
  if (!img) return "/placeholder.png";
  if (img.startsWith("http")) return img;
  return `${import.meta.env.VITE_API_URL}/${img}`;
};

export default function PublishersPage() {
  const [publishers, setPublishers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [editPublisher, setEditPublisher] = useState<any>(null);

  /* FETCH */
  const fetchPublishers = async () => {
    const res = await API.get("/publishers");
    setPublishers(res.data.data);
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  /* CREATE */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", name);
    if (image) fd.append("image", image);

    await API.post("/publishers", fd);

    setName("");
    setImage(null);
    fetchPublishers();
  };

  /* DELETE */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete publisher?")) return;
    await API.delete(`/publishers/${id}`);
    fetchPublishers();
  };

  /* UPDATE */
const handleUpdate = async () => {
  const formData = new FormData();

  formData.append("name", editPublisher.name);

  if (editPublisher.image instanceof File) {
    formData.append("image", editPublisher.image);
  }

  await API.put(`/publishers/${editPublisher._id}`, formData);

  fetchPublishers(); // or dispatch(fetchPublishers())
  setEditPublisher(null);
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
      Manage Publishers
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
          Add Publisher
        </Typography>

        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>

          <TextField
            size="small"
            label="Publisher Name"
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
            variant="contained"
            sx={{
              background: "#2563eb",
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { background: "#1d4ed8" },
            }}
          >
            Add Publisher
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
          Publishers List
        </Typography>

        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f8fafc" }}>
              <TableCell sx={{ fontWeight: 600 }}>Publisher</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {publishers.map((pub) => (
              <TableRow
                key={pub._id}
                hover
                sx={{ "&:hover": { background: "#f9fafb" } }}
              >

                {/* NAME */}
                <TableCell>
                  <Typography fontWeight={500}>
                    {pub.name}
                  </Typography>
                </TableCell>

                {/* IMAGE */}
                <TableCell>
                  <Avatar
                    src={getImage(pub.image)}
                    variant="rounded"
                    sx={{ width: 60, height: 40 }}
                  />
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
                      onClick={() => setEditPublisher(pub)}
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
                      onClick={() => handleDelete(pub._id)}
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
    <Dialog open={!!editPublisher} onClose={() => setEditPublisher(null)} maxWidth="xs" fullWidth>

      <DialogTitle sx={{ fontFamily: "Playfair Display" }}>
        Edit Publisher
      </DialogTitle>

      <DialogContent>

        <Box display="flex" justifyContent="center" mt={2}>
          <Avatar
            src={
              editPublisher?.image instanceof File
                ? URL.createObjectURL(editPublisher.image)
                : getImage(editPublisher?.image)
            }
            sx={{ width: 80, height: 80 }}
          />
        </Box>

        <TextField
          fullWidth
          label="Publisher Name"
          value={editPublisher?.name || ""}
          onChange={(e) =>
            setEditPublisher({
              ...editPublisher,
              name: e.target.value,
            })
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
              setEditPublisher({
                ...editPublisher,
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
          Update Publisher
        </Button>

      </DialogContent>
    </Dialog>

  </Box>
);
}