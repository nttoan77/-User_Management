// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import methodOverride from "method-override";
// import path from "path";
// import { fileURLToPath } from "url";

// import apiRoutes from "./API/v1/routes/index.js";
// import db from "./config/db/index.js";
// import fixUserIdIndex from "../src/config/fixUserIdIndex.js";
// import { logRoutes } from "./debugRoutes.js";

// const app = express();
// const port = 8888;

// // Middleware
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // CHỈ GIỮ LẠI 1 DÒNG NÀY THÔI – ẢNH SẼ HIỆN NGAY!
// app.use(express.static(path.join(process.cwd(), "public")));
// // =================================================================

// app.use(methodOverride("_method"));
// app.use(cors());

// // Routes
// app.use("/api", apiRoutes);

// // Khởi động server
// const startServer = async () => {
//   try {
//     await db.connect();
//     await fixUserIdIndex();

//     app.listen(port, () => {
//       console.log(`Server chạy tại http://localhost:${port}`);
//       // logRoutes(app);
//     });
//   } catch (error) {
//     console.error("Lỗi khởi động server:", error);
//     process.exit(1);
//   }
// };

// startServer();

// =====================================

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import methodOverride from "method-override";
import path from "path";
import { fileURLToPath } from "url";

import apiRoutes from "./API/v1/routes/index.js";
import db from "./config/db/index.js";
import fixUserIdIndex from "../src/config/fixUserIdIndex.js";
import { logRoutes } from "./debugRoutes.js";

const app = express();
const port = 8888;

// Middleware
// // Log request chi tiết (status 200/404/...) 
// app.use(morgan('dev')); 

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ★★★ ĐÃ CHỮA HOÀN TOÀN: Serve static đúng thư mục & prefix ★★★
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug đường dẫn gốc
// console.log('[DEBUG] __dirname (thư mục chứa file server):', __dirname);

// Tính đường dẫn chính xác đến public/uploads (vì server ở src/ → phải lên cấp cha)
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
// console.log('[SERVER] Serve /uploads từ thư mục vật lý:', uploadsDir);

// Serve prefix /uploads từ public/uploads
app.use('/uploads', express.static(uploadsDir));

// Log request đến /uploads để debug (bao gồm status code qua morgan)
app.use((req, res, next) => {
  if (req.path.startsWith('/uploads/')) {
    // console.log(`[STATIC REQUEST] ${req.method} ${req.path} - từ ${req.ip}`);
  }
  next();
});

// =================================================================

app.use(methodOverride("_method"));
app.use(cors());

// Routes
app.use("/api", apiRoutes);

// Khởi động server
const startServer = async () => {
  try {
    await db.connect();
    await fixUserIdIndex();

    app.listen(port, () => {
      console.log(`Server chạy tại http://localhost:${port}`);
      // logRoutes(app); // nếu bạn muốn log routes
    });
  } catch (error) {
    console.error("Lỗi khởi động server:", error);
    process.exit(1);
  }
};

startServer();