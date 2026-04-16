import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  InputBase,
  Avatar,
  IconButton,
  Badge,
} from "@mui/material";

import {
  Dashboard,
  MenuBook,
  People,
  Category,
  Business,
  Search,
  Support,
  Notifications,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { socket } from "../../socket";

const drawerWidth = 240;

const menu = [
  { text: "Dashboard", icon: <Dashboard />, path: "/admin" },
  { text: "Books", icon: <MenuBook />, path: "/admin/books" },
  { text: "Authors", icon: <People />, path: "/admin/authors" },
  { text: "Categories", icon: <Category />, path: "/admin/categories" },
  { text: "Publishers", icon: <Business />, path: "/admin/publishers" },
  { text: "Support", icon: <Support />, path: "/admin/support" },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Notification State
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const handleMessage = () => {
      setNotifications((prev) => prev + 1);
    };

    socket.off("receive_message");
    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, []);

  return (
    <Box sx={{ display: "flex", bgcolor: "#fff7ed", minHeight: "100vh" }}>

      {/*  SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            background: "linear-gradient(180deg, #f5d0a9, #e7b98c)", 
            color: "#5c3d1e",
            borderRight: "none",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" fontWeight="bold">
            Story Admin
          </Typography>
        </Toolbar>

        <List>
          {menu.map((item) => {
            const active = location.pathname === item.path;

            return (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1.5,
                  my: 0.5,
                  borderRadius: 2,
                  transition: "0.3s",
                  background: active
                    ? "linear-gradient(90deg, #fff7ed, #ffe4c7)"
                    : "transparent",
                  color: active ? "#7c2d12" : "#5c3d1e",
                  "&:hover": {
                    background: "#ffe4c7",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? "#7c2d12" : "#7c2d12",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>

      {/*  MAIN AREA */}
      <Box sx={{ flexGrow: 1 }}>

        {/*  TOPBAR */}
        <AppBar
          position="fixed"
          sx={{
            ml: `${drawerWidth}px`,
            width: `calc(100% - ${drawerWidth}px)`,
            background: "#fff7ed",
            color: "#7c2d12",
            boxShadow: "0 4px 20px rgba(124,45,18,0.1)",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

            {/*  SEARCH */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                background: "#ffe4c7",
                px: 2,
                py: 0.5,
                borderRadius: 3,
              }}
            >
              <Search sx={{ mr: 1 }} />
              <InputBase placeholder="Search books, authors..." />
            </Box>

            {/*  RIGHT SIDE */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

              {/*  NOTIFICATION */}
              <IconButton
                onClick={() => setNotifications(0)}
                sx={{
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <Badge badgeContent={notifications} color="error">
                  <Notifications sx={{ color: "#7c2d12" }} />
                </Badge>
              </IconButton>

              {/*  ADMIN */}
              <Typography fontWeight="500">Admin</Typography>
              <Avatar sx={{ bgcolor: "#7c2d12" }}>A</Avatar>
            </Box>

          </Toolbar>
        </AppBar>

        {/*  PAGE CONTENT */}
        <Box sx={{ p: 4, mt: 8 }}>
          <Outlet />
        </Box>

      </Box>
    </Box>
  );
};

export default AdminLayout;