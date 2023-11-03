const mysql = require("mysql");
// const { NULL } = require("mysql/lib/protocol/constants/types");

const db = mysql.createConnection({

    host:'localhost',
    user:'root',
    password:'',
    database:'dbmsLogin'

});
var email1;

module.exports={

register (req,res) {

    console.log(req.body);
 

    const { name, email, password} = req.body;
    email1=email;


    db.query('SELECT email FROM users WHERE email = ?',[email],(error, results)=>{

        if(error){
            console.log(error);
        }
        if(results.length >0){
            return res.render("Index.hbs",{
                message:"That email is already in use"
            });
        }

        
        
    });
    console.log(email1);
    db.query("INSERT INTO users SET ?", {name: name, email:email,password:password},(error,results) =>{
    if(error){
        console.log(error);
    }else{
        res.sendFile("e:/Krishn/dbms project/views/setProfile.html")
    }
}
    );
    
},


// export {email};
add() {return email1;}
        


}