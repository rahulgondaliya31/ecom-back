const sql = require("./db.js");

const productReview = function (review) {
    this.user_id = review.user_id;
    this.product_id = review.product_id;
    this.rating = review.rating;
    this.review = review.review;
};

productReview.isUserExist = (user_id, result) => {
    sql.query(`SELECT id FROM user WHERE id = ${user_id}`, (err, res) => {
    result(null, res[0]);
    return;  
    });
}

productReview.productratingExist = (user_id,product_id, result) => {
    sql.query(`SELECT id FROM product_review WHERE user_id = ${user_id} AND product_id = ${product_id}`, (err, res) => {
    result(null, res[0]);
    return;  
    });
}

productReview.updateRating = (user_id,product_id,rating,review, result) => {
    sql.query(
      "UPDATE product_review SET user_id = ?, product_id = ?,rating = ?,review = ? WHERE product_id = ? AND user_id = ?",
      [user_id, product_id, rating, review, product_id, user_id],
      (err, res) => {
        result(null, product_id);
        return;  
      }
    );
};

productReview.getproductReviewRating = (product_id, result) => {
    sql.query(`SELECT SUM(rating) as total_rating,count(id) as total FROM product_review WHERE product_id = ${product_id}`, (err, res) => {
    result(null, res[0]);
    return;  
    });
}

productReview.updateProductsRating = (product_id,average_rating,total, result) => {
    sql.query(
      "UPDATE products SET avg_rating = ?, total_review = ? WHERE id = ?",
      [average_rating, total, product_id],
      (err, res) => {
        result(null, product_id);
        return;  
      }
    );
};

productReview.reviewAdd = (newreview, result) => {
    sql.query("INSERT INTO product_review SET ?",[newreview], (err, res) => {
      //console.log(err);return false;
      result(null, res.insertId);
      return; 
    });
};

productReview.reviewListing = (product_id, result) => {
    sql.query(`SELECT r.id,r.user_id,r.review,r.rating,r.created_at as posted_at,u.full_name,(SELECT if(u.profile_picture !='',CONCAT('`+nodeSiteUrl+`','file/profile_picture/',u.profile_picture),'') ) as profile_picture
    FROM product_review as r 
    LEFT JOIN user AS u ON u.id = r.user_id
    WHERE r.product_id = ${product_id} ORDER BY r.id DESC`, 
    (err, res) => {
    // console.log(err);return false;
    result(null, res);
    return;  
    });
}


module.exports = productReview;
