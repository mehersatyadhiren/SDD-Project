
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const productSchema= new Schema({
    brand:{
        type: String,
        required:true
    },
    category:{
        type: String,
        required:true
    },
    product:{
        type: String,
        required:true
    },
    modelno:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    price:{
        type: String,
        required:true
    },
    capacity:{
        type: String,
        required:true
    },
    url:{
        type: String,
        required:true
    }
},{timestamps: true});

const Product= mongoose.model('Product',productSchema);

module.exports=Product;