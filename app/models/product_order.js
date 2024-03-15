const sql = require("./db.js");


const ProductOrder = function (order) {
  this.unique_order_id = order.unique_order_id;
  this.user_id = order.user_id;
  this.name = order.name;
  this.phone = order.phone;
  this.address = order.address;
  this.delivery_instructions = order.delivery_instructions;
  this.total_shipping = order.total_shipping;
  this.total_price = order.total_price;
  this.order_total = order.order_total;
};


ProductOrder.getordersList = (order_id, result) => {

  sql.query(`SELECT * FROM product_order WHERE unique_order_id = '${order_id}' `, (err, res) => {
    // return false;
    result(null, res[0]);
    return;
  });

}

ProductOrder.addOrder = (orderData, result) => {

  sql.query(`INSERT INTO product_order SET ? `, [orderData], (err, res) => {
    // console.log(err);
    // return false;
    result(null, res.insertId);
    return;
  });

}

ProductOrder.getOrdersListCount = (user_id,result) =>{
  var strlimit = "";
  sql.query(`SELECT o.id,o.unique_order_id,o.user_id,o.delivery_instructions,o.total_shipping,o.total_price,o.order_total,o.address,o.cancel_order_reason,o.status,DATE_FORMAT(o.delivered_date,"%Y-%m-%d") as delivered_date,DATE_FORMAT(o.partially_delivered_date,"%Y-%m-%d") as partially_delivered_date,o.created_at,o.updated_at,u.full_name,u.email,u.phone_number,(SELECT if(u.profile_picture !='',CONCAT('` + nodeSiteUrl + `','file/profile_picture/',u.profile_picture),'') ) as profile_picture,(SELECT count(id) FROM order_items WHERE order_id = o.id) as total_product,
    (SELECT p.name FROM order_items as d LEFT JOIN products as p ON p.id=d.product_id WHERE d.order_id = o.id limit 1) as product_name,(SELECT if(i.image !='',CONCAT('`+ nodeSiteUrl + `','file/product/',i.image),'') FROM order_items as d LEFT JOIN products as p ON p.id=d.product_id LEFT JOIN product_images as i ON i.product_id = p.id WHERE d.order_id = o.id limit 1) as product_image FROM product_order as o LEFT JOIN user as u ON o.user_id = u.id WHERE o.user_id = ${user_id} GROUP BY o.id ORDER BY o.created_at DESC`+strlimit, (err, res) => {
    result(null, res)
    return;
  })
}

ProductOrder.getOrdersList = (user_id,sp,limit,result) => {
  sql.query(`SELECT o.id,o.unique_order_id,o.user_id,o.delivery_instructions,o.total_shipping,o.total_price,o.order_total,o.address,o.cancel_order_reason,o.status,DATE_FORMAT(o.delivered_date,"%Y-%m-%d") as delivered_date,DATE_FORMAT(o.partially_delivered_date,"%Y-%m-%d") as partially_delivered_date,o.created_at,o.updated_at,u.full_name,u.email,u.phone_number,(SELECT if(u.profile_picture !='',CONCAT('` + nodeSiteUrl + `','file/profile_picture/',u.profile_picture),'') ) as profile_picture,(SELECT count(id) FROM order_items WHERE order_id = o.id) as total_product,
    (SELECT p.name FROM order_items as d LEFT JOIN products as p ON p.id=d.product_id WHERE d.order_id = o.id limit 1) as product_name,(SELECT if(i.image !='',CONCAT('`+ nodeSiteUrl + `','file/product/',i.image),'') FROM order_items as d LEFT JOIN products as p ON p.id=d.product_id LEFT JOIN product_images as i ON i.product_id = p.id WHERE d.order_id = o.id limit 1) as product_image FROM product_order as o LEFT JOIN user as u ON o.user_id = u.id WHERE o.user_id = ${user_id} GROUP BY o.id ORDER BY o.created_at DESC LIMIT ` +sp+`,`+limit, (err, res) => {
      // console.log(err);return false
    result(null, res)
    return;
  })
}

ProductOrder.getOrderProductsListCount = (user_id,result) => {
  var strlimit = "";
  sql.query(`SELECT o.id,o.user_id,o.delivery_instructions,o.total_shipping,o.total_price,o.order_total,o.created_at,o.updated_at,p.id as product_id,p.name as product_name,company_name,p.description,p.price,(SELECT if(image !='',CONCAT('` + nodeSiteUrl + `','file/product/',image),'')  FROM product_images WHERE product_id = p.id ORDER BY id ASC LIMIT 1) as product_image FROM order_items as d LEFT JOIN product_order as o ON o.id = d.order_id LEFT JOIN products as p ON p.id=d.product_id WHERE o.id = d.order_id AND o.user_id = ${user_id} ORDER BY o.created_at DESC `+strlimit, (err, res) => {
    result(null, res)
    return;
  })
}

ProductOrder.getOrderProductsList = (user_id,sp,limit,result) => {
  sql.query(`SELECT o.id,o.user_id,o.delivery_instructions,o.total_shipping,o.total_price,o.order_total,o.created_at,o.updated_at,p.id as product_id,p.name as product_name,company_name,p.description,p.price,(SELECT if(image !='',CONCAT('` + nodeSiteUrl + `','file/product/',image),'')  FROM product_images WHERE product_id = p.id ORDER BY id ASC LIMIT 1) as product_image FROM order_items as d LEFT JOIN product_order as o ON o.id = d.order_id LEFT JOIN products as p ON p.id=d.product_id WHERE o.id = d.order_id AND o.user_id = ${user_id} ORDER BY o.created_at DESC LIMIT ` +sp+`,`+limit, (err, res) => {
    result(null, res)
    return;
  })
}

ProductOrder.cancelOrder = (order_id,reason,result) => {
  sql.query(`UPDATE product_order SET status = '3',cancel_order_reason = ? WHERE id = ?`,[reason,order_id],(err, res)=>{
    result(null,order_id)
    return;
  })
}

ProductOrder.updateOrderStatus = (order_id,result) => {
  sql.query(`UPDATE product_order SET status = '3' WHERE id = ?`,[order_id],(err, res)=>{
    result(null,order_id)
    return;
  })
}

ProductOrder.updateOrder = (order_id,total_shipping,total_price,order_total,result) => {
  sql.query(`UPDATE product_order SET total_shipping = ?,total_price = ?,order_total = ? WHERE id = ?`,[total_shipping,total_price,order_total,order_id],(err, res)=>{
    result(null,order_id)
    return;
  })
}



module.exports = ProductOrder;