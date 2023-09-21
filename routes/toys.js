const express = require("express");
const {
  ToyModel: ProductModel,
  validateToys: validateProducts,
} = require("../models/toyModel");
const { auth } = require("../middleware/auth");
const router = express.Router();

// get the products by given value and search.
router.get("/", async (req, res) => {
  try {
    // change the limit of products in the page (default: 10 products)
    const limit = req.query.limit || 10;
    // change the page
    const page = req.query.page - 1 || 0;
    // change the option of sorting (default: by the "_id")
    const sort = req.query.sort || "_id";
    // change the way of sorting (a - z // z - a)
    const reverse = req.query.reverse == "yes" ? 1 : -1;

    // search the products by ?s = (as default) and also as the title and info.
    let filterFind = {};
    if (req.query.s) {
      const search = new RegExp(req.query.s, "i");
      filterFind = { $or: [{ name: search }, { info: search }] };
    }

    // combine and find all by the given value.
    const data = await ProductModel.find(filterFind)
      .limit(limit)
      .skip(limit * page)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

// get the product by category.
router.get("/category", async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const cat = req.query.cat;

    // find the product by the given category -- /cat=******
    const data = await ProductModel.find({ category: cat }).limit(limit);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

// get all the products that in the range( min = ? max =?).
router.get("/prices", async (req, res) => {
  try {
    const min = req.query.min || 0;
    const max = req.query.max || Infinity;
    const limit = req.query.limit || 10;
    const data = await ProductModel.find({
      price: { $gte: min, $lte: max },
    }).limit(limit);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

// find one product by his id.
router.get("/single/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ProductModel.findOne({ _id: id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

// add new product (only authorized users can do that).
router.post("/", auth, async (req, res) => {
  const validBody = validateProducts(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const product = new ProductModel(req.body);
    product.user_id = req.tokenData._id;
    await product.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

// edit product (only authorized users can do that).
router.put("/:id", auth, async (req, res) => {
  const validBody = validateProducts(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const id = req.params.id;
    const data = await ProductModel.updateOne(
      { _id: id, user_id: req.tokenData._id },
      req.body
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

// delete product (only authorized users can do that).
router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ProductModel.deleteOne({
      _id: id,
      user_id: req.tokenData._id,
    });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.get("/count", async (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const count = await ToyModel.countDocuments({});
    res.json({ count, pages: Math.ceil(count / limit) });
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.get("/price", async (req, res) => {
  try {
    const limit = 10;
    const { min = 0, max = 999999 } = req.query;
    const reverse = req.query.reverse == "yes" ? 1 : -1;
    const page = req.query.page > 0 ? req.query.page - 1 : 0;

    const toy = await ToyModel.find({ price: { $lte: max, $gte: min } })
      .limit(limit)
      .skip(page * limit)
      .sort({ price: reverse });
    res.json(toy);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

module.exports = router;
