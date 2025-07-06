const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
connectDB();

const app = express();

// ✅ Allow frontend (Vite) to access API
app.use(cors({
  origin: "http://localhost:5173", // your frontend origin
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dryfruits", require("./routes/dryfruitRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
