// 4
const mongoose = require('mongoose');
const Joi = require('joi')

const toysSchema = new mongoose.Schema({
    name:String,
    info:String,
    category:String,
    img_url:String,
    price:Number,
    date_created:{
      type:Date, default:Date.now()
    },
    user_id:String
})

exports.toysModel = mongoose.model("toys", toysSchema);

exports.toysvalidateToy = (_reqBody) =>{
    let schemaJoi = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        info: Joi.string().min(2).max(99).required(),
        category: Joi.string().min(2).max(99).required(),
        img_url: Joi.string().min(2).max(99).required(),
        price: Joi.number().min(1).max(9999).required()
    })
    return schemaJoi.validate(_reqBody);
}
