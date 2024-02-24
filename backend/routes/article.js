const {Router} = require("express");
const controller = require("../controllers/Article.js");
const router = Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/articles")
  },

  filename: (req, file, cb) => {
    cb(null, `article_${Date.now()}_${file.originalname}`)
  }
})

const uploads = multer({storage}) 

router.get("/articles/list/:last?", controller.list);
router.post("/articles/create", controller.create);
router.get("/articles/:id", controller.get);
router.delete("/articles/:id", controller.delete);
router.put("/articles/:id", controller.edit);
router.post("/articles/upload/:id", [uploads.single('file')], controller.upload);
router.get("/articles/image/:image", controller.image);
router.get("/articles/search/:search", controller.search);

module.exports = {
    router
};