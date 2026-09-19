import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env";

if (!fs.existsSync(env.storagePath)) {
  fs.mkdirSync(env.storagePath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.storagePath),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });
