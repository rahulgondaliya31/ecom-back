const sql = require("./db.js");

// constructor
const User = function (user) {
    this.full_name = user.full_name;
    this.email = user.email;
    this.password = user.password;
    this.phone_number = user.phone_number;
    this.address = user.address;
    this.profile_picture = user.profile_picture;
    this.device_type = user.device_type;
    this.device_token = user.device_token;
};


User.signUp = (userData, result) => {

    sql.query(`INSERT INTO user SET ?`, [userData], (err, res) => {
        result(null, res.insertId);
        return;
    });

}

User.findEmailExists = (email, result) => {
    sql.query(`SELECT * FROM user WHERE email = ? `, [email], (err, res) => {
        result(null, res[0])
        return;
    });
};

User.findPhoneExists = (phone_number, result) => {
    sql.query(`SELECT * FROM user WHERE phone_number = ? `, [phone_number], (err, res) => {
        result(null, res[0])
        return;
    });
};

User.findUserInfo = (id, result) => {
    sql.query(`SELECT id,full_name,email,phone_number,address,device_type,device_token,(SELECT if(profile_picture !='',CONCAT('`+nodeSiteUrl+`','file/profile_picture/',profile_picture),'') ) as profile_picture,is_password_reset FROM user WHERE id = ?`, [id], (err, res) => {
        // console.log(err);return false;
        result(null, res[0])
        return;
    })
}

User.Login = (email,password,result)  =>{
    sql.query("SELECT * FROM user WHERE email = ? AND password = ?",[email,password],(err,res)=>{
    //  console.log(err); return false
     result(null,res[0])
     return;
    })
}

User.loginUpdate = (user_id,device_type,device_token,result)  =>{
    sql.query("UPDATE user SET device_type = ?,device_token = ? WHERE id = ?",[device_type,device_token,user_id],(err,res)=>{
    //  console.log(err); return false
     result(null,user_id)
     return;
    })
}

User.findPasswordExists = (password,id,result) =>{ 
    sql.query("SELECT * FROM user WHERE password = ? AND id = ?",[password,id],(err,res)=>{
     result(null,res[0])
     return;
    }) 
} 

User.changePassword = (password,id,result) =>{
    sql.query("UPDATE user SET password = ? WHERE id = ?",[password,id],(err,res)=>{
        result(null,id)
        return;
    })
}

User.updatePassword = (password,id,result) =>{
    sql.query("UPDATE user SET password = ?,is_password_reset='1' WHERE id = ?",[password,id],(err,res)=>{
        result(null,id)
        return;
    })
}

User.updateUserToken = (token,id,result) =>{
    sql.query("UPDATE user SET user_token = ?,is_password_reset = '0' WHERE id = ?",[token,id],(err,res)=>{
        result(null,id)
        return;
    })
}

User.updateEmailExists = (email,user_id,result) =>{
    sql.query("SELECT * FROM user WHERE email = ? AND id != ?",[email,user_id],(err,res)=>{
       result(null,res[0])
       return;
    })
}

User.updatePhoneExists = (phone_number,user_id,result) =>{
    sql.query("SELECT * FROM user WHERE phone_number = ? AND id != ?",[phone_number,user_id],(err,res)=>{
       result(null,res[0])
       return;
    })
}

User.updateProfile = (user_id,full_name,email,phone_number,address,profile_picture,result) =>{
    sql.query("UPDATE user SET full_name = ?,email = ?,phone_number = ?,address = ?,profile_picture = ? WHERE id = ?",[full_name,email,phone_number,address,profile_picture,user_id],(err,res)=>{
    //  console.log(err); return  false
       result(null,user_id)
       return;
    })
}

User.userLogout = (id,result) =>{
    sql.query("UPDATE user SET device_type = ?,device_token = ? WHERE id = ?",['0','',id],(err,res)=>{
        result(null,id)
        return;
    })
}


module.exports = User;