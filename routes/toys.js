const express= require("express");
const { auth } = require("../middlewares/auth");
const {toysModel,toysvalidateToy} = require("../models/toysModel")
const router = express.Router();

router.get("/" , async(req,res)=> {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  try{
    let data = await toysModel.find({})
    .limit(perPage)
    .skip((page - 1) * perPage)
    .sort({_id:-1})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

// /toys/search?s=
router.get("/search",async(req,res) => {
  try{
    let queryS = req.query.s;
    let searchReg = new RegExp(queryS,"i")
    let data = await toysModel.find({$or:
      [{name:searchReg},
      {info:searchReg},],
    }).limit(50)
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

router.get("/category/:catName",async(req,res) => {
  try{
    let queryS = req.params.catName;
    // i -> מבטל את כל מה שקשור ל CASE SENSITVE
    let searchReg = new RegExp(queryS,"i")
    let data = await toysModel.find({category:searchReg}).limit(50)
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

router.get("/single/:id",async(req,res) => {
  try{
    let queryS = req.params.id;
  
    let data = await toysModel.find({_id:queryS}).limit(50)
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

router.post("/", auth,async(req,res) => {
  let validBody = toysvalidateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let toy = new toysModel(req.body);
    // add the user_id of the user that add the toy
    toy.user_id = req.tokenData._id;
    await toy.save();
    res.status(201).json(toy);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

// האדמין יוכל לערוך את כל הרשומות ויוזרים יוכלו לערוך רק את של עצמם
router.put("/:editId",auth, async(req,res) => {
  let validBody = toysvalidateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let editId = req.params.editId;
    let data;
    if(req.tokenData.role == "admin"){
      data = await toysModel.updateOne({_id:editId},req.body)
    }
    else{
       data = await toysModel.updateOne({_id:editId,user_id:req.tokenData._id},req.body)
    }
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})


// האדמין יוכל למחוק את כל הרשומות ויוזרים יוכלו למחוק רק את של עצמם

router.delete("/:delId",auth, async(req,res) => {
  try{
    let delId = req.params.delId;
    let data;
    // אם אדמין יכול למחוק כל רשומה אם לא בודק שהמשתמש
    // הרשומה היוזר איי די שווה לאיי די של המשתמש
    if(req.tokenData.role == "admin"){
      data = await toysModel.deleteOne({_id:delId})
    }
    else{
      data = await toysModel.deleteOne({_id:delId,user_id:req.tokenData._id})
    }
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

module.exports = router;