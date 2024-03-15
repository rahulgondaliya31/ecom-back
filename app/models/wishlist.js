const sql = require("./db.js");

const Wishlist = function (wishlist) {
    this.user_id = wishlist.user_id;
    this.product_id = wishlist.product_id;
};

Wishlist.wishListAdd = (wishlistData,result) =>{
    sql.query('INSERT INTO wishlist SET ?', [wishlistData], (err,res) => {
        result(null,res.insertId);
        return;
    })
}

Wishlist.isFavoriteExist = (user_id,product_id, result) => {
    sql.query(`SELECT id FROM wishlist WHERE product_id = ${product_id} AND user_id= ${user_id}`, (err, res) => {
    //console.log(err);return false;
    result(null, res[0]);
    return;  
    });
}

Wishlist.remove = (id, result) => {
    sql.query("DELETE FROM wishlist WHERE id = ?", id, (err, res) => {
      result(null, res);
    });
};

Wishlist.getWishlistProductsCount = (user_id,search_text,sort_by,min_price,max_price,selectedCategory,result) => {
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
      strCon +=` p.price BETWEEN ${min_price} AND ${max_price} AND `;
    }

    if(search_text !=''){
        strCon +=" (p.name LIKE '%"+search_text+"%' OR p.company_name LIKE '%"+search_text+"%') AND ";

    }

    if(selectedCategory !== ""){
          strCon +=` FIND_IN_SET(p.category_id, "${selectedCategory}") AND `;
    }


    sql.query(`SELECT (SELECT COUNT(w.id) FROM wishlist as w WHERE w.product_id = p.id ) as total_like,p.id,p.category_id,p.company_name,p.name,p.description,p.price,p.is_available,p.avg_rating,p.total_review,c.name as category_name,(SELECT if(image !='',CONCAT('`+nodeSiteUrl+`','file/product/',image),'')  FROM product_images WHERE product_id = p.id ORDER BY id ASC LIMIT 1) as image,if((SELECT COUNT(id) FROM wishlist WHERE product_id = p.id AND user_id= ${user_id})>0,1,0) as is_favourite FROM wishlist as w LEFT JOIN products as p ON p.id = w.product_id LEFT JOIN categories as c ON c.id = p.category_id WHERE `+strCon+` w.user_id = ${user_id} GROUP BY p.id `+order_by+``+strlimit,(err,res)=>{
        console.log(err);
        result(null,res);
        return;
    })
}

Wishlist.getWishlistProducts = (user_id,search_text,sort_by,min_price,max_price,selectedCategory,sp,limit,result) => {
    var strlimit = " LIMIT "+sp+","+limit+"";
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
      strCon +=` p.price BETWEEN ${min_price} AND ${max_price} AND `;
    }

    if(search_text !=''){

        strCon +=" (p.name LIKE '%"+search_text+"%' OR p.company_name LIKE '%"+search_text+"%') AND ";
        
    }

    if(selectedCategory !== ""){
        strCon +=` FIND_IN_SET(p.category_id, "${selectedCategory}") AND `;
    }

    sql.query(`SELECT (SELECT COUNT(w.id) FROM wishlist as w WHERE w.product_id = p.id ) as total_like,p.id,p.category_id,p.company_name,p.name,p.description,p.price,p.is_available,p.avg_rating,p.total_review,c.name as category_name,(SELECT if(image !='',CONCAT('`+nodeSiteUrl+`','file/product/',image),'')  FROM product_images WHERE product_id = p.id ORDER BY id ASC LIMIT 1) as image,if((SELECT COUNT(id) FROM wishlist WHERE product_id = p.id AND user_id= ${user_id})>0,1,0) as is_favourite FROM wishlist as w LEFT JOIN products as p ON p.id = w.product_id LEFT JOIN categories as c ON c.id = p.category_id WHERE `+strCon+`  w.user_id = ${user_id} GROUP BY p.id `+order_by+``+strlimit,(err,res)=>{
        console.log(err);
        result(null,res);
        return;
    })
}

module.exports = Wishlist;