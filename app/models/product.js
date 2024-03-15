const sql = require("./db.js");

// constructor
const Product = function (product) {
  this.id = product.id;
  this.category_id = product.category_id;
  this.name = product.name;
  this.description = product.description;
  this.price = product.price;
  this.created_at = product.created_at;
  this.updated_at = product.updated_at;
};


Product.getproductListCount = (user_id,sort_by,min_price,max_price,selectedCategory,search_text,product_id,result) => {
  var strlimit = "";
  var strCon="";
  var order_by = "";


  if(sort_by == '1')
  {
     order_by =" ORDER BY p.avg_rating DESC";
  }
  else if(sort_by == '2')
  {
     order_by =" ORDER BY total_like DESC";
  }


  if(min_price !== '' && max_price !== '')
  {
    strCon +=` WHERE p.price BETWEEN ${min_price} AND ${max_price} `;
  }

  if(search_text !=''){

    if(product_id == "" && min_price !== '' && max_price !== '')
    {
      strCon +=" AND (p.name LIKE '%"+search_text+"%' OR p.company_name LIKE '%"+search_text+"%')";
    }
    else{
      strCon +=" WHERE (p.name LIKE '%"+search_text+"%' OR p.company_name LIKE '%"+search_text+"%')";
    }
  }

  if(selectedCategory !== ""){
    if(search_text !='' || min_price !== '' || max_price !== '')
    {
      strCon +=` AND FIND_IN_SET(p.category_id, "${selectedCategory}")`;
    }
    else{
      strCon +=` WHERE FIND_IN_SET(p.category_id, "${selectedCategory}")`;
    }
  }

    if(search_text == '' && product_id != "")
    {
      strCon +=` WHERE p.id = ${product_id} `;
    }

  sql.query(`SELECT (SELECT COUNT(w.id) FROM wishlist as w WHERE w.product_id = p.id ) as total_like,p.id,p.category_id,p.name,p.description,p.price,p.is_available,p.company_name,p.avg_rating,p.total_review,c.name as category_name,(SELECT if(image !='',CONCAT('` + nodeSiteUrl + `','file/product/',image),'') FROM product_images WHERE product_id = p.id ORDER BY id ASC LIMIT 1) as image,if((SELECT COUNT(id) FROM wishlist WHERE product_id = p.id AND user_id= ${user_id})>0,1,0) as is_favourite FROM products as p LEFT JOIN categories as c ON c.id = p.category_id `+strCon+` `+order_by+`` + strlimit, (err, res) => {
    // console.log(err);return false;
    result(null, res);
    return;
  });

}


Product.getproductList = (user_id,sort_by,min_price,max_price,selectedCategory,search_text,product_id,sp, limit, result) => {
  var strlimit = " LIMIT " + sp + "," + limit + "";
  var strCon="";
  var order_by = "";

  if(sort_by == '1')
  {
     order_by =" ORDER BY p.avg_rating DESC";
  }
  else if(sort_by == '2')
  {
     order_by =" ORDER BY total_like DESC";
  }

  if(min_price !== '' && max_price !== '')
  {
    strCon +=` WHERE p.price BETWEEN ${min_price} AND ${max_price} `;
  }

  if(search_text !=''){

    if(product_id == "" && min_price !== '' && max_price !== '')
    {
      strCon +=" AND (p.name LIKE '%"+search_text+"%' OR p.company_name LIKE '%"+search_text+"%')";
    }
    else
    {
      strCon +=" WHERE (p.name LIKE '%"+search_text+"%' OR p.company_name LIKE '%"+search_text+"%')";
    }
  }

  if(selectedCategory !== ""){
    if(search_text !='' || min_price !== '' || max_price !== '')
    {
      strCon +=` AND FIND_IN_SET(p.category_id, "${selectedCategory}")`;
    }
    else{
      strCon +=` WHERE FIND_IN_SET(p.category_id, "${selectedCategory}")`;
    }
  }

  if(product_id != "")
  {
    strCon +=` WHERE p.id = ${product_id} `;
  }


  sql.query(`SELECT (SELECT COUNT(w.id) FROM wishlist as w WHERE w.product_id = p.id ) as total_like,p.id,p.category_id,p.name,p.description,p.price,p.is_available,p.company_name,p.avg_rating,p.total_review,c.name as category_name,(SELECT if(image !='',CONCAT('` + nodeSiteUrl + `','file/product/',image),'')  FROM product_images WHERE product_id = p.id ORDER BY id ASC LIMIT 1) as image,if((SELECT COUNT(id) FROM wishlist WHERE product_id = p.id AND user_id= ${user_id})>0,1,0) as is_favourite FROM products as p LEFT JOIN categories as c ON c.id = p.category_id `+strCon+` `+order_by+` ` + strlimit, (err, res) => {
    result(null, res);
    return;
  });

}

Product.getproductsById = (product_id, result) => {

  sql.query(`SELECT id,category_id,name,description,price FROM products WHERE FIND_IN_SET(id,'${product_id}') `, (err, res) => {
    // console.log(err);return false;
    result(null, res);
    return;
  });

}



module.exports = Product;