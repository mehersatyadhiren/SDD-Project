
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const wishlistSchema= new Schema({
    contact:{
        type: Number,
        required:true
    },
    list:{
        type: [String],
        required:true
    }
},{timestamps: true});

const Wishlist= mongoose.model('Wishlist',wishlistSchema);

module.exports=Wishlist;