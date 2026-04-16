import { useState } from "react";
import API from "../services/api"; // ✅ FIXED
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
      }

     await API.post("/auth/register",  {
        name,
        email: email.toLowerCase(),
        password,
      });

      alert("User registered successfully");

      navigate("/login");

    } catch (err: any) { // ✅ FIXED
      console.log("REGISTER ERROR:", err?.response?.data || err?.message);
      alert(err?.response?.data?.message || "Register failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}