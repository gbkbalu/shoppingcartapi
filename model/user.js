const mongoose = require('mongoose')
const Joi = require('joi');
const schema = mongoose.Schema

const userSchema = new schema({
    id:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String
    },
    hashedpassword:{
        type:String,
        required:true
    },
    name:{
        firstname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,
            required:true
        }
    },
    address:{
        city:String,
        street:String,
        number:Number,
        zipcode:String,
        geolocation:{
            lat:String,
            long:String
        }
    },
    salt:{type:String},
    phone:{type:String,required:true},
    createdAt: {type:Date, default:new Date()},
    updatedAt: {type:Date, default:new Date()}
})
userSchema.methods.toJSON = function() {
    var obj = this.toObject()
    delete obj.salt;
    delete obj.password;
    delete obj.hashedpassword;
    return obj
  }
module.exports = mongoose.model('user',userSchema)