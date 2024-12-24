import multer from "multer";
import path from "path";
import fs from "fs";
import config from "../config/config.js";

import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Utility to ensure the folder exists
const ensureFolderExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

const createStorage = (folder) => {
    const folderPath = path.join(__dirname, `../public/${folder}`);
    ensureFolderExists(folderPath);

    return multer.diskStorage({
        destination: (_, __, cb) => cb(null, folderPath),
        filename: (_, file, cb) =>
            cb(null, `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`),
    });
};

export const productImageUpload = multer({
    storage: createStorage(config.paths.images.product),
}).array('images', 10); // Allow up to 10 images
