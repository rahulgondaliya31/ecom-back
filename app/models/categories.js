const sql = require("./db.js");

const Category = function(category) {
  this.id = category.id;
  this.name = category.name;
  this.created_at = category.created_at;
  this.updated_at = category.updated_at;
};


Category.getCategoriesList = (result) => {

    sql.query(`SELECT * FROM categories `,(err, res) => {
  // console.log(err);
  // return false;
  result(null, res);
  return;  
  });

}


module.exports = Category;
