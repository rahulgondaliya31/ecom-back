module.exports = app => {
  const product = require("../controllers/product.js");


  app.post("/product/getProductListing", product.getProductListing);
  app.post("/product/getOrdersListing", product.getOrdersListing);
  app.post("/product/addOrder", product.addOrder);
  app.get("/product/getCategoriesList", product.getCategoriesList);
  app.get("/product/getAppSettings", product.getAppSettings);
  app.post("/product/getProductImages", product.getProductImages);
  app.post("/product/getUserOrdersListing", product.getUserOrdersListing);
  app.post("/product/addOrRemoveWishlist",product.addOrRemoveWishlist);
  app.post("/product/getWishlistProducts",product.getWishlistProducts);
  app.post("/product/getOrderProductsListing",product.getOrderProductsListing);
  app.post("/product/cancelOrder",product.cancelOrder);
  app.post("/product/cancelProduct",product.cancelProduct);
  app.post("/product/addReviewRating",product.addReviewRating);
  app.post("/product/getReviewListing",product.getReviewListing);
};