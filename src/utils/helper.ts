import multer from 'multer';

// 配置解析post的文件
export const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  // fileFilter(req, file, cb) {
  //   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
  //     cb(null, true);
  //   } else {
  //     cb(null, false);
  //   }
  // },
});
