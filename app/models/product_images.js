const sql = require("./db.js");


const productImages = function(image) {
    this.id = settings.id;
    this.product_id = image.product_id;
    this.image = image.image;
};


productImages.getProductImage = (product_id,result) => {

    sql.query(`SELECT id,
    if(image !='',CONCAT('`+nodeSiteUrl+`','file/product/',image),'') AS image
    FROM product_images
    WHERE product_id = ${product_id}`,(err, res) => {
        if (res.length) 
        {
    
              result(null, res);
              return;
        }
        else
        {
          result(null, []);
          return;
        } 
  });

}

module.exports = productImages;