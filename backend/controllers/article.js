const Article = require("../schemas/Article.js");
const { validateData } = require("../helper/validate.js");
const fs = require("fs");
const path = require("path");
//Returns an article by id
const get = (req, res) => {
  const consulta = Article.findById(req.params.id);
  consulta
    .then((article) => {
      if (!article)
        return res
          .status(404)
          .json({ status: "error", message: "No article found with this id" });
      return res.status(200).send({
        status: "success",
        article,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: "error",
        message: `Error getting article with id: ${error.message}`,
      });
    });
};

//Creates a new article
const create = (req, res) => {
  try {
    const params = req.body;
    validateData(params);
    const article = new Article(params);
    article
      .save()
      .then((savedArticle) => {
        return res.status(200).json({
          status: "success",
          Articulo: savedArticle,
          message: "Article saved successfully",
        });
      })
      .catch((error) => {
        throw new Error(`Error saving article: ${error.message}`);
      });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

//List all articles or the last n articles
const list = (req, res) => {
  const consulta = Article.find({});
  if (req.params.last && !isNaN(req.params.last)) {
    consulta.limit(req.params.last);
  }
  consulta.sort({ date: -1 });
  consulta
    .then((articles) => {
      if (!articles)
        return res
          .status(404)
          .json({ status: "error", message: "No articles found" });
      return res.status(200).send({
        status: "success",
        articles,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: "error",
        message: `Error getting articles: ${error.message}`,
      });
    });
};

//Deletes an article by id
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      status: "success",
      message: "Article deleted successfully",
      article,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Error deleting article with id ${req.params.id}: No article found with this id`,
    });
  }
};

//Updates an article by id
const edit = (req, res) => {
  try {
    validateData(req.body);
    const consulta = Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .then((article) => {
        if (!article)
          throw new Error(`No article found with this id ${req.params.id}`);
        return res
          .status(200)
          .send({
            status: "success",
            article,
            message: "Article updated successfully",
          });
      })
      .catch((error) => {
        throw new Error(`Error updating article with id: ${error.message}`);
      });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

const upload = async (req, res) => {
  try {
    if (!req.file && !req.files)
      return res
        .status(400)
        .json({ status: "error", message: "No file uploaded" });
    const fileName = req.file.originalname;
    const splitName = fileName.split(".");
    const extension = splitName[splitName.length - 1];

    if (["jpg", "png", "jpeg", "gif"].includes(extension)) {
      const article = await Article.findByIdAndUpdate(
        req.params.id,
        { image: req.file.filename },
        { new: true }
      );

      if (!article) {
        throw new Error(`No article found with this id ${req.params.id}`);
      }

      return res.status(200).send({
        status: "success",
        article,
        message: "Article updated successfully",
      });
    }
    fs.unlink(req.file.path, (err) => {
      throw new Error("Invalid file type");
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

const image = (req, res) => {
  const myPath = `./uploads/articles/${req.params.image}`;

  fs.promises
    .stat(myPath)
    .then((stats) => {
      if (stats.isFile()) {
        return res.sendFile(path.resolve(myPath));
      }
      throw new Error(`Image not found with id ${req.params.image}`);
    })
    .catch((error) => {
      return res.status(404).json({ status: "error", message: error.message });
    });
};

const search = (req, res) => {
  const search = req.params.search;
  Article.find({"$or": [
    {"title": {"$regex": search, "$options": "i"}},
    {"content": {"$regex": search, "$options": "i"}},
  ]})
  .sort({date: -1})
  .then((articles) => {
    if (!articles || articles.length <= 0) return res.status(404).json({ status: "error", message: "No articles found" });
    return res.status(200).send({status: "success", articles,});
  })
  .catch((error) => {
    return res.status(500).json({
      status: "error",
      message: `Error getting articles: ${error.message}`,
    });
  })
}


module.exports = {
  list,
  create,
  get,
  delete: deleteArticle,
  edit,
  upload,
  image,
  search
};
