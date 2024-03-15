const sql = require("./db.js");

const orderItems = function(items) {
  this.order_id = items.order_id;
  this.product_id = items.product_id;
  this.category_id = items.category_id;
  this.price = items.price;
  this.quantity = items.quantity;
  this.total_price = items.total_price;
};


orderItems.getordersItems = (user_id,order_id,result) => {
    sql.query(`SELECT o.order_id,o.product_id as id,o.category_id,o.price,o.quantity,o.total_price,o.status,DATE_FORMAT(o.under_process_date,"%Y-%m-%d") as under_process_date,DATE_FORMAT(o.dispatched_date,"%Y-%m-%d") as dispatched_date,DATE_FORMAT(o.received_date,"%Y-%m-%d") as received_date,DATE_FORMAT(o.cancelled_date,"%Y-%m-%d") as cancelled_date,p.category_id,p.name,p.description,p.company_name,(SELECT rating FROM product_review WHERE product_id = p.id AND user_id= '${user_id}') as rating,(SELECT review FROM product_review WHERE product_id = p.id AND user_id= '${user_id}')  as review,if((SELECT COUNT(id) FROM product_review WHERE product_id = p.id AND user_id='${user_id}')>0,1,0) as is_rating,(SELECT if(image !='',CONCAT('`+nodeSiteUrl+`','file/product/',image),'')  FROM product_images WHERE product_id = o.product_id ORDER BY id ASC LIMIT 1) as image FROM order_items as o LEFT JOIN products as p ON p.id = o.product_id WHERE o.order_id = '${order_id}'`,(err, res) => {
    result(null, res);
    return;  
  });

}

orderItems.getCancelOrdersItems = (order_id,result) => {
  sql.query(`SELECT SUM(o.total_price) as price FROM order_items as o WHERE o.order_id = '${order_id}' AND o.status = '4'`,(err, res) => {
  result(null, res[0]);
  return;  
});

}

orderItems.checkordersItemsCancel = (order_id,result) => {

  sql.query(`SELECT * FROM order_items WHERE order_id = '${order_id}' AND status != 4`,(err, res) => {
  result(null, res);
  return;  
});

}

orderItems.addordersItems = (itemData,result) => {

    sql.query(`INSERT INTO order_items SET ? `,[itemData],(err, res) => {
  // console.log(err);return false;
  result(null, res.insertId);
  return;  
  });

}

orderItems.cancelOrdersItems = (order_id,product_id,cancelled_date,result) => {

  sql.query(`UPDATE order_items SET status='4',cancelled_date = ? WHERE order_id = ? AND product_id = ? `,[cancelled_date,order_id,product_id],(err, res) => {
// console.log(err);return false;
  result(null,order_id);
  return;  
});

}

orderItems.getUniqorderItems = (order_id,result) => {

  sql.query(`SELECT * FROM order_items WHERE order_id = '${order_id}' AND status != '4' `,(err, res) => {
result(null, res);
return;  
});

}

orderItems.addOrdersCancelItems = (cancelled_date,order_id,result) => {

  sql.query(`UPDATE order_items SET cancelled_date = ?,status='4' WHERE order_id = ?`,[cancelled_date,order_id],(err, res) => {
// console.log(err);return false;
  result(null,order_id);
  return;  
});
}

orderItems.getSumOrderItems = (order_id,result) => {

  sql.query(`SELECT SUM(total_price) as total FROM order_items WHERE order_id = ? AND status != '4'`,[order_id],(err, res) => {
// console.log(err);return false;
  result(null,res[0]);
  return;  
});

}

module.exports = orderItems;