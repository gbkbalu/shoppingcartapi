const mongoose = require('mongoose')
const schema = mongoose.Schema

const productSchema = new schema({
    id:{
        type:Number,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:String,
    image:String,
    category:String,
    createdAt: {type:Date, default:new Date()},
    updatedAt: {type:Date, default:new Date()}
})

module.exports = mongoose.model('product',productSchema)