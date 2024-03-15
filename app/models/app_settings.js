const sql = require("./db.js");

const appSettings = function(settings) {
  this.id = settings.id;
  this.shipping_charge = settings.shipping_charge;
  this.created_at = settings.created_at;
  this.updated_at = settings.updated_at;
};

appSettings.getAppSettings = (result) => {

    sql.query(`SELECT * FROM app_settings`,(err, res) => {
  // console.log(err);return false;
  result(null, res[0]);
  return;  
  });

}

module.exports = appSettings;