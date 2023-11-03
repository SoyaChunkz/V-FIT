const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql2")
const path = require("path");
const req = require("express/lib/request");
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
const rep = require("./controllers/auth");
const res = require("express/lib/response");
const { time } = require("console");
const { NULL } = require("mysql/lib/protocol/constants/types");


 const email = rep.add();
 

const app = express();
const db = mysql.createConnection({

    host:'localhost',
    user:'root',
    password:'bourbon5',
    database:'dbmslogin',
    // port:'3000'

});




app.set('view engine','hbs');
const publicDirectory = path.join(__dirname,"./public");
app.use(express.static(publicDirectory));

db.connect((error)=>{
  if(error){
      console.log("Error in running MySQL")
      console.log(error)
  }
  else{
      console.log("MySQL running")
  } 

})



app.use(bodyParser.urlencoded({
    extended:true
}));





app.use("/",require("./routes/pages"));
// app.use("/auth",require("./routes/auth"));
var email1;
app.post("/beta",(req,res)=>{
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
        res.sendFile("C:/Users/tykwo/Documents/Fitness-Centre-main/views/setProfile.html")
    }
});
    
});



var bdd=0;
var username1;
app.post("/",(req,res)=>{

    var username = req.body.username;
    username1=username;
    var passcode = req.body.passcode;
    console.log(username);

    db.query("SELECT * FROM users WHERE email = ? and password =?",[username,passcode],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            
            res.redirect("/welcome");
        }
        else{
            return res.render("index", {message:'Invalid username or password'});
        }

        res.end();
    });

    app.get("/welcome",(req,res)=>{
        db.query("SELECT name,weight,id,height,age,BMI,Address,Time,BuddyID FROM users WHERE email = ?",[username1],(error,results)=>{
            if(error){
                console.log(error);
            }
            if(results.length >0){
            
                if(results[0].BuddyID!==NULL){
                    bdd=results[0].BuddyID;
                }
                address1=results[0].Address;
                time1=results[0].Time;
                ida=results[0].id;
                console.log(bdd);
                return res.render("C:/Users/tykwo/Documents/Fitness-Centre-main/views/DashboardU.hbs",{
                    message1:results[0].weight,
                    message2:results[0].height,
                    message3:results[0].age,
                    message4:results[0].BMI,
                    message5:results[0].name,
                    message6:results[0].Address,
                    message7:results[0].Time,
                    message8:results[0].BuddyID,
                    message9:'Yes, a partner has been chosen, with ID',
                    message10:'No buddy has been alloted',
               


                    
                });
            }
        });
        
      
    });



});

app.post("/BMI",(req,res)=>{
    console.log(req.body);
    

    const { weight, height, age,bmi} = req.body;
    

    db.query("UPDATE users SET ? WHERE email=?",[{weight: weight, height:height,age:age,BMI:bmi},[email1]],(error,results) =>{
        if(error){
            console.log(error);
        }else{
            res.sendFile("C:/Users/tykwo/Documents/Fitness-Centre-main/views/Slot_booking.html")
        }
    }
        );

});

app.get("/setProfile",(req,res)=>{
    db.query("SELECT id FROM users WHERE  email = ? ",[email1],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            console.log(results);
           
             ida=   results[0].id;
            console.log(ida);
            res.sendFile("C:/Users/tykwo/Documents/Fitness-Centre-main/views/BMI.html");
        }
    });
    
    console.log(email1);
    });


app.listen(3000,function(){
    console.log("Server started on port 3000")
});

app.get("/logout",(req,res)=>{
        res.render("index.hbs")
        console.log(email1);
    });



//Slot booking updating in database
var time1;
var address1;

app.post("/slot",(req,res)=>{
    console.log(req.body);
    

    const {address,time} = req.body;
    time1=time;
    address1=address;
    

    db.query("UPDATE users SET ? WHERE email=?",[{Address: address,Time:time},[email1]],(error,results) =>{
        if(error){
            console.log(error);
        }else{
            res.sendFile("C:/Users/tykwo/Documents/Fitness-Centre-main/views/GymBuddy.html")
        }
    }
        );

});





let bid;
app.post("/ghq",(req,res)=>{
    

    var option=req.body.option;

    if(option==='yes'){
        db.query("SELECT id FROM users WHERE  Address = ? and Time=? and BuddyID IS NULL  ",[address1,time1],(error,results)=>{
            if(error){
                console.log(error);
            }
            if(results.length >0){
                console.log(results);
                let idB=[];
                for(let i=0;i<results.length;i++){
                  
                       idB[i]= results[i].id;
    
                 
                }
                let q=results.length-2;
              console.log(idB);
              
              function getRandomInt(max) {
                return Math.floor(Math.random() * max);
              }
              let p= getRandomInt(q);
              if(idB.length>1){
                console.log(p);
                console.log(idB[p]);
                bid=idB[p];
                res.sendFile("C:/Users/tykwo/Documents/Fitness-Centre-main/views/Buddy1.html");
              }
              else{
                res.sendFile("C:/Users/tykwo/Documents/Fitness-Centre-main/views/DenyBuddy1.html");
              }   
            }
        });
    }
    else if(option==='no'){
    res.sendFile("C:/Users/tykwo/Documents/Fitness-Centre-main/views/pricing.html");
    }


});
app.post("/denyB",(req,res)=>{
    res.sendFile("C:/Users/tykwo/Documents/Fitness-Centre-main/views/pricing.html");
});
app.post("/denyB1",(req,res)=>{

    db.query("SELECT name,weight,height,age,BMI,Address,Time,BuddyID FROM users WHERE email = ?",[username1],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            if(results[0].BuddyID!==NULL){
                bdd=results[0].BuddyID;
            }
            console.log(bdd);
            return res.render("C:/Users/tykwo/Documents/Fitness-Centre-main/views/DashboardU.hbs",{
                message1:results[0].weight,
                message2:results[0].height,
                message3:results[0].age,
                message4:results[0].BMI,
                message5:results[0].name,
                message6:results[0].Address,
                message7:results[0].Time,
                message8:results[0].BuddyID,
                message9:'Yes, a partner has been chosen, with ID',
                message10:'No buddy has been alloted',
       
            });
        }
    });
});
app.post("/bud",(req,res)=>{

        db.query("SELECT name,id,BMI FROM users WHERE  id = ? ",[bid],(error,results)=>{
            if(error){
                console.log(error);
            }
            if(results.length >0){
                console.log(results);
                return res.render("C:/Users/tykwo/Documents/Fitness-Centre-main/views/Buddy2.hbs",{
                    message1:results[0].name,
                    message2:results[0].id,
                    message3:results[0].BMI,
                  
                });
                
                
            }
        });
    
});
let ida;
app.post("/fin",(req,res)=>{

    db.query("UPDATE users SET ? WHERE id=?",[{BuddyID:ida},[bid]],(error,results) =>{
        if(error){
            console.log(error);
        }else{
            db.query("UPDATE users SET ? WHERE id=?",[{BuddyID:bid},[ida]],(error,results) =>{
                if(error){
                    console.log(error);
                }else{
                    res.sendFile("C:/Users/tykwo/Documents/Fitness-Centre-main/views/pricing.html")
                }
            }
                );
        }
    }
        );

});

app.post("/pa",(req,res)=>{
    
    

   const {plan} = req.body;
    console.log(plan);
    

    db.query("UPDATE users SET ? WHERE email=?",[{Plan: plan},[email1]],(error,results) =>{
        if(error){
            console.log(error);
        }else{
            res.sendFile("C:/Users/tykwo/Documents/Fitness-Centre-main/views/ProfileComplete.html")
        }
    }
        );

});


 app.post("/da",(req,res)=>{
    res.render("index.hbs");
    
});

app.get("/budye",(req,res)=>{
    

    
    if(bdd===null){
        return res.render("C:/Users/tykwo/Documents/Fitness-Centre-main/views/buddyUpdate2.hbs");
        }
    else{
    


        db.query("SELECT name,id,BMI FROM users WHERE  id = ? ",[bdd],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            console.log(results);
            return res.render("C:/Users/tykwo/Documents/Fitness-Centre-main/views/buddyUpdate.hbs",{
                message1:results[0].name,
                message2:results[0].id,
                message3:results[0].BMI,
              
            });
            
            
        }
    });
}
});

app.post("/bapd",(req,res)=>{

        db.query("SELECT name,weight,height,age,BMI,Address,Time,BuddyID FROM users WHERE email = ?",[username1],(error,results)=>{
            if(error){
                console.log(error);
            }
            if(results.length >0){
            
                if(results[0].BuddyID!==NULL){
                    bdd=results[0].BuddyID;
                }
                
                console.log(bdd);
                return res.render("C:/Users/tykwo/Documents/Fitness-Centre-main/views/DashboardU.hbs",{
                    message1:results[0].weight,
                    message2:results[0].height,
                    message3:results[0].age,
                    message4:results[0].BMI,
                    message5:results[0].name,
                    message6:results[0].Address,
                    message7:results[0].Time,
                    message8:results[0].BuddyID,
                    message9:'Yes, a partner has been chosen, with ID',
                    message10:'No buddy has been alloted',
         
                });
            }
        });
});

app.post("/jkool",(req,res)=>{
    

    var option=req.body.option;

    if(option==='yes'){
        db.query("SELECT id FROM users WHERE  Address = ? and Time=? and BuddyID IS NULL  ",[address1,time1],(error,results)=>{
            if(error){
                console.log(error);
            }
            if(results.length >0){
                console.log(results);
                let idB=[];
                for(let i=0;i<results.length;i++){
                    if(results[i].id!==ida){
                    idB.push(results[i].id);
                    }             
                }
              let q=results.length-1;
              console.log(idB);
              
              function getRandomInt(max) {
                return Math.floor(Math.random() * max);
              }
              let p= getRandomInt(q);
              if(idB.length>1){
                console.log(p);
                console.log(idB[p]);
                console.log(ida);
                bdd=idB[p];
                res.sendFile("C:/Users/tykwo/Documents/Fitness-Centre-main/views/buddyUpdate4.html");
              }
              else{
                res.sendFile("C:/Users/tykwo/Documents/Fitness-Centre-main/views/DenyBuddy1.html");
              }    
            }
        });
    }
    else if(option==='no'){
        db.query("SELECT name,weight,height,age,BMI,Address,Time,BuddyID FROM users WHERE email = ?",[username1],(error,results)=>{
            if(error){
                console.log(error);
            }
            if(results.length >0){
                if(results[0].BuddyID!==NULL){
                    bdd=results[0].BuddyID;
                }
                console.log(bdd);
                return res.render("C:/Users/tykwo/Documents/Fitness-Centre-main/views/DashboardU.hbs",{
                    message1:results[0].weight,
                    message2:results[0].height,
                    message3:results[0].age,
                    message4:results[0].BMI,
                    message5:results[0].name,
                    message6:results[0].Address,
                    message7:results[0].Time,
                    message8:results[0].BuddyID,
                    message9:'Yes, a partner has been chosen, with ID',
                    message10:'No buddy has been alloted',    
                });
            }
        });
    }
});


app.post("/bud1",(req,res)=>{

    db.query("SELECT name,id,BMI FROM users WHERE  id = ? ",[bdd],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            console.log(results);
            return res.render("C:/Users/tykwo/Documents/Fitness-Centre-main/views/buddyUpdate3.hbs",{
                message1:results[0].name,
                message2:results[0].id,
                message3:results[0].BMI,
              
            });
            
            
        }
    });

});




app.post("/fin1",(req,res)=>{

    db.query("UPDATE users SET ? WHERE id=?",[{BuddyID:ida},[bdd]],(error,results) =>{
        if(error){
            console.log(error);
        }else{
            db.query("UPDATE users SET ? WHERE id=?",[{BuddyID:bdd},[ida]],(error,results) =>{
                if(error){
                    console.log(error);
                }else{
                    db.query("SELECT name,weight,height,age,BMI,Address,Time,BuddyID FROM users WHERE email = ?",[username1],(error,results)=>{
                        if(error){
                            console.log(error);
                        }
                        if(results.length >0){
                        
                            if(results[0].BuddyID!==NULL){
                                bdd=results[0].BuddyID;
                            }
                            
                            console.log(bdd);
                            return res.render("C:/Users/tykwo/Documents/Fitness-Centre-main/views/DashboardU.hbs",{
                                message1:results[0].weight,
                                message2:results[0].height,
                                message3:results[0].age,
                                message4:results[0].BMI,
                                message5:results[0].name,
                                message6:results[0].Address,
                                message7:results[0].Time,
                                message8:results[0].BuddyID,
                                message9:'Yes, a partner has been chosen, with ID',
                                message10:'No buddy has been alloted',
                       
                            });
                        }
                    });
                }
            }
                );
        }
    }
        );

});

app.get("/pland",(req,res)=>{

        db.query("SELECT Plan FROM users WHERE  email = ? ",[username1],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            console.log(results);
            return res.render("C:/Users/tykwo/Documents/Fitness-Centre-main/views/PricingUpdate.hbs",{
                message1:results[0].Plan,
        
            });
            
            
        }
    });

});

app.post("/pa1",(req,res)=>{
    
    

    const {plan} = req.body;
     console.log(plan);
     
 
     db.query("UPDATE users SET ? WHERE email=?",[{Plan: plan},[username1]],(error,results) =>{
         if(error){
             console.log(error);
         }else{
            db.query("SELECT name,weight,height,age,BMI,Address,Time,BuddyID FROM users WHERE email = ?",[username1],(error,results)=>{
                if(error){
                    console.log(error);
                }
                if(results.length >0){
                
                    if(results[0].BuddyID!==NULL){
                        bdd=results[0].BuddyID;
                    }
                    
                    console.log(bdd);
                    return res.render("C:/Users/tykwo/Documents/Fitness-Centre-main/views/DashboardU.hbs",{
                        message1:results[0].weight,
                        message2:results[0].height,
                        message3:results[0].age,
                        message4:results[0].BMI,
                        message5:results[0].name,
                        message6:results[0].Address,
                        message7:results[0].Time,
                        message8:results[0].BuddyID,
                        message9:'Yes, a partner has been chosen, with ID',
                        message10:'No buddy has been alloted',
               
                    });
                }
            });
         }
     }
         );
 
 });


 app.get("/slotd",(req,res)=>{
        db.query("SELECT Address,Time FROM users WHERE  email = ? ",[username1],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
            console.log(results);
            return res.render("C:/Users/tykwo/Documents/Fitness-Centre-main/views/SlotUpdate.hbs",{
                message1:results[0].Address,
                message2:results[0].Time,
            });
        }
    });

});

app.post("/sl1",(req,res)=>{
    

    var option=req.body.option;

    if(option==='yes'){
                res.sendFile("C:/Users/tykwo/Documents/Fitness-Centre-main/views/SlotUpdate2.html");
            }

    else if(option==='no'){
        db.query("SELECT name,weight,height,age,BMI,Address,Time,BuddyID FROM users WHERE email = ?",[username1],(error,results)=>{
            if(error){
                console.log(error);
            }
            if(results.length >0){
            
                if(results[0].BuddyID!==NULL){
                    bdd=results[0].BuddyID;
                }
                
                console.log(bdd);
                return res.render("C:/Users/tykwo/Documents/Fitness-Centre-main/views/DashboardU.hbs",{
                    message1:results[0].weight,
                    message2:results[0].height,
                    message3:results[0].age,
                    message4:results[0].BMI,
                    message5:results[0].name,
                    message6:results[0].Address,
                    message7:results[0].Time,
                    message8:results[0].BuddyID,
                    message9:'Yes, a partner has been chosen, with ID',
                    message10:'No buddy has been alloted',
               


                    
                });
            }
        });
    }
});

app.post("/slotup",(req,res)=>{
    console.log(req.body);
    

    const {address,time} = req.body;
    time1=time;
    address1=address;
    

    db.query("UPDATE users SET ? WHERE email=?",[{Address: address,Time:time},[username1]],(error,results) =>{
        if(error){
            console.log(error);
        }else{
            db.query("SELECT name,weight,height,age,BMI,Address,Time,BuddyID FROM users WHERE email = ?",[username1],(error,results)=>{
                if(error){
                    console.log(error);
                }
                if(results.length >0){
                
                    if(results[0].BuddyID!==NULL){
                        bdd=results[0].BuddyID;
                    }
                    
                    console.log(bdd);
                    return res.render("C:/Users/tykwo/Documents/Fitness-Centre-main/views/DashboardU.hbs",{
                        message1:results[0].weight,
                        message2:results[0].height,
                        message3:results[0].age,
                        message4:results[0].BMI,
                        message5:results[0].name,
                        message6:results[0].Address,
                        message7:results[0].Time,
                        message8:results[0].BuddyID,
                        message9:'Yes, a partner has been chosen, with ID',
                        message10:'No buddy has been alloted',
                   
    
    
                        
                    });
                }
            });
        }
    }
        );

});

app.get("/profiled",(req,res)=>{
        return res.sendFile("C:/Users/tykwo/Documents/Fitness-Centre-main/views/profileUpdate.html");

});

app.post("/BMI1",(req,res)=>{
    console.log(req.body);
    

    const { weight, height, age,bmi} = req.body;
    

    db.query("UPDATE users SET ? WHERE email=?",[{weight: weight, height:height,age:age,BMI:bmi},[username1]],(error,results) =>{
        if(error){
            console.log(error);
        }else{
            db.query("SELECT name,weight,height,age,BMI,Address,Time,BuddyID FROM users WHERE email = ?",[username1],(error,results)=>{
                if(error){
                    console.log(error);
                }
                if(results.length >0){
                
                    if(results[0].BuddyID!==NULL){
                        bdd=results[0].BuddyID;
                    }
                    
                    console.log(bdd);
                    return res.render("C:/Users/tykwo/Documents/Fitness-Centre-main/views/DashboardU.hbs",{
                        message1:results[0].weight,
                        message2:results[0].height,
                        message3:results[0].age,
                        message4:results[0].BMI,
                        message5:results[0].name,
                        message6:results[0].Address,
                        message7:results[0].Time,
                        message8:results[0].BuddyID,
                        message9:'Yes, a partner has been chosen, with ID',
                        message10:'No buddy has been alloted',
                    });
                }
            });
        }
    }
        );

});

app.get("/cp1",(req,res)=>{ 
        db.query("SELECT Comment_text,name,id FROM comments  ",(error,results)=>{
            if(error){
                console.log(error);
            }
            if(results.length >0){
                let iname=[];
                let itext=[];
                let iid=[];
                for(let i=0;i<results.length;i++){
                  
                       iname[i]= results[i].name;
                }
                for(let i=0;i<results.length;i++){
                  
                    itext[i]= results[i].Comment_text;
                }
                for(let i=0;i<results.length;i++){
                  
                iid[i]= results[i].id;
    
                }
                console.log(iname);
                console.log(itext);
                console.log(iid);
                return res.render("C:/Users/tykwo/Documents/Fitness-Centre-main/views/Comments3.hbs",{
                    results:results
                });   
            }
        });
    
    });

app.post("/cp2",(req,res)=>{

    console.log(req.body);
    const { name,id,comment} = req.body;
    console.log(comment);
    var records = [
        [comment,ida,name],
      ];
    db.query("INSERT INTO comments (Comment_text,id,name)  VALUES ? ",[records],(error,results)=>{
        if(error){
            console.log(error);
        }
        else{
            return res.sendFile("C:/Users/tykwo/Documents/Fitness-Centre-main/views/Comment2.html");    
        }
    });

});

app.post("/cp3",(req,res)=>{
    
    db.query("SELECT name,weight,height,age,BMI,Address,Time,BuddyID FROM users WHERE email = ?",[username1],(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length >0){
        
            if(results[0].BuddyID!==NULL){
                bdd=results[0].BuddyID;
                console.log(bdd);
            }
            
            console.log(bdd);
            return res.render("C:/Users/tykwo/Documents/Fitness-Centre-main/views/DashboardU.hbs",{
                message1:results[0].weight,
                message2:results[0].height,
                message3:results[0].age,
                message4:results[0].BMI,
                message5:results[0].name,
                message6:results[0].Address,
                message7:results[0].Time,
                message8:results[0].BuddyID,
                message9:'Yes, a partner has been chosen, with ID',
                message10:'No buddy has been alloted',
            });
        }
    });

});

app.post("/cp4",(req,res)=>{  
    return res.sendFile("C:/Users/tykwo/Documents/Fitness-Centre-main/views/Comments1.html");
});
