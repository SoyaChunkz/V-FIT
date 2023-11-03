const express = require("express");

const router = express.Router();

router.get("/", (req,res) => {

    res.render("index.hbs");

});
// router.get("/setProfile",(req,res)=>{
//     res.render("BMI.html")
    
//     });
module.exports = router;