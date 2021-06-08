const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const mongoose = require("mongoose");
const Product = require("./models/products");
const Wishlist = require("./models/wishlist");
const User = require("./models/admin");

const app = express();

//connect to mongoDB
const dbURI =
  "mongodb+srv://SDD_user:sdd1234@cluster0.oxd8u.mongodb.net/SDD?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  session({
    secret: "notagoodsecret",
  })
);

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.use((req, res, next) => {
  if (!app.locals.wishArray) {
    app.locals.wishArray = [];
  }
  next();
});

const requiredLogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  next();
};

const requiredLogin_ = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/login1");
  }
  next();
};

const requiredLogin__ = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/login2");
  }
  next();
};

app.get("/", (req, res) => {
  const categories = [
    { img: "/images/beverage.jpg", name: "Beverage and Breakfast" },
    { img: "/images/cooking.jpg", name: "Cooking and Baking" },
    { img: "/images/dishwasher.jpg", name: "Dishwasher" },
    { img: "/images/fprocessor.jpg", name: "Food Processor" },
    { img: "/images/fridge.jpg", name: "Fridges and Freezers" },
    { img: "/images/kitchen.jpg", name: "Kitchen Appliances" },
    { img: "/images/mixer.jpg", name: "Mixer Grinders" },
    { img: "/images/washer.jpg", name: "Washers and Dryers" },
  ];
  res.render("index", { title: "Home", categories });
});

app.get("/products/create", requiredLogin, (req, res) => {
  res.render("create", { title: "Create a new Product" });
});

// app.get('/products',(req,res)=>{
//   res.render('products',{title:'Products'});
// })

app.get("/products", (req, res) => {
  Product.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("products", { products: result, title: "All Products" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/productsad", requiredLogin_, (req, res) => {
  Product.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("productsad", { products: result, title: "All ProductsAd" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/wishlist", (req, res) => {
  Product.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      var data = req.session;
      console.log(data);
      res.render("wishlist", {
        data: data,
        products: result,
        title: "Wishlist Products",
        wishArray: app.locals.wishArray,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/login1", (req, res) => {
  res.render("login1");
});
app.get("/login2", (req, res) => {
  res.render("login2");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get('/adminsearch',requiredLogin__, (req,res)=>{
  Product.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("adminsearch", { products: result,contact:null, wishes:null, title: "Admin search" });
    })
    .catch((err) => {
      console.log(err);
    });
})

// app.get('/wishlist',(req,res)=> {
//   res.render('wishlist',{title:'Wishlist'});
// })

app.post("/products", (req, res) => {
  const product = new Product(req.body);

  product
    .save()
    .then((result) => {
      res.redirect("/products");
    })
    .catch((err) => {
      console.log(err);
    });
});


app.post('/uploadwish',(req,res)=>{
  var contact=req.body.contact;
  var list=app.locals.wishArray;

  const wish=new Wishlist({contact:contact,list:list});
  wish
    .save()
    .then((result) => {
      res.redirect("/wishlist");
    })
    .catch((err) => {
      console.log(err);
    });

})
app.post("/login", async (req, res) => {
  const { uid, password } = req.body;
  const user = await User.findOne({ uid: uid });
  const validPassword = (await password) == user.password;
  if (validPassword) {
    req.session.user_id = user._id;
    res.redirect("/products/create");
  } else {
    console.log("Error");
    res.redirect("/login");
  }
});

//
app.post("/login1", async (req, res) => {
  const { uid, password } = req.body;
  const user = await User.findOne({ uid: uid });
  const validPassword = (await password) == user.password;
  if (validPassword) {
    req.session.user_id = user._id;
    res.redirect("/productsad");
  } else {
    console.log("Error");
    res.redirect("/login1");
  }
});
//
app.post("/login2", async (req, res) => {
  const { uid, password } = req.body;
  const user = await User.findOne({ uid: uid });
  const validPassword = (await password) == user.password;
  if (validPassword) {
    req.session.user_id = user._id;
    res.redirect("/adminsearch");
  } else {
    console.log("Error");
    res.redirect("/login2");
  }
});

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/login");
});

app.post('/adminsearch',async (req,res)=>{
  const contact=req.body.contact;
  const customer=await Wishlist.findOne({contact:contact})

  Product.find()
  .sort({ createdAt: -1 })
  .then((result) => {
    res.render("adminsearch", { products: result,contact:customer.contact, wishes:customer.list, title: "Admin search" });
  })
  .catch((err) => {
    console.log(err);
  });
})

app.post("/addwish", (req, res) => {
  const id = req.body.id;
  //arr = arr.push(id);
  app.locals.wishArray.push(id);

  res.redirect("/wishlist");
});

app.get("/productsad/:id", (req, res) => {
  const id = req.params.id;
  Product.findById(id)
    .then((result) => {
      res.render("detailsad", { products: result, title: "Product DetailsAd" });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/products/:id", (req, res) => {
  const id = req.params.id;
  Product.findById(id)
    .then((result) => {
      res.render("details", { products: result, title: "Product Details" });
    })
    .catch((err) => {
      console.log(err);
    });
});


app.delete('/productsad/:id', (req, res) => {
  const id = req.params.id;
  
   Product.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/productsad' });
    })
    .catch(err => {
      console.log(err);
    });
});
