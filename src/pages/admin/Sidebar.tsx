// import { NavLink, Outlet } from "react-router-dom";
// import {
//   FaBook,
//   FaUser,
//   FaLayerGroup,
//   FaBuilding,
//   FaTachometerAlt,
// } from "react-icons/fa";

// const menu = [
//   { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin" },
//   { name: "Books", icon: <FaBook />, path: "/admin/books" },
//   { name: "Authors", icon: <FaUser />, path: "/admin/authors" },
//   { name: "Categories", icon: <FaLayerGroup />, path: "/admin/categories" },
//   { name: "Publishers", icon: <FaBuilding />, path: "/admin/publishers" },
// ];

// const AdminLayout = () => {
//   return (
//     <div className="layout">

//       {/* SIDEBAR */}
//       <aside className="sidebar">
//         <h2 className="logo">StoryTeller</h2>

//         <nav>
//           {menu.map((item) => (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               end={item.path === "/admin"}
//               className="nav-item"
//             >
//               {item.icon}
//               <span>{item.name}</span>
//             </NavLink>
//           ))}
//         </nav>

//         <div className="sidebar-footer">© 2026</div>
//       </aside>

//       {/* MAIN */}
//       <div className="main">

//         <header className="topbar">
//           <h1>Admin Dashboard</h1>
//           <div className="user">Admin</div>
//         </header>

//         <main className="content">
//           <Outlet />
//         </main>

//       </div>
//     </div>
//   );
// };

// export default AdminLayout;