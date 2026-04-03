import multer from "multer";
import fs from "fs";

const folder = "./uploads";
const createFolder = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};
createFolder(folder);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, folder);
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.log(file.mimetype);
    cb(
      new Error("Invalid file type. Only JPG, PNG and WebP images are allowed"),
      false,
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
