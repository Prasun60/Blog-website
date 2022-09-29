//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/blogdb", {useNewUrlParser: true});
const blogschema = new mongoose.Schema({
  title: String,
  content:String
});
const blog = mongoose.model("blog", blogschema);


const homeStartingContent = "Are you looking for the top bloggers and best blogs in India? This is the place where you’ll discover top Indian blogs to read in 2022. There are only two ways to succeed in blogging: reading and implementing.If you’re not a regular reader of blogs and don’t know what’s going on around your niche, you can never create a successful blog that makes money.Reading best blogs is a no-brainer if you want to get the latest trends in your industry. Some of my favorite blogs that I usually read are from Indian bloggers.";
const aboutContent = "Hi, Myself Prasun Mondal, I am an engineering student at ABV-IIITM, pursuing Btech-CSE, CGPA-8.53.I am a Fullstack web-developer and competitive coder,Block-Chain Enthusiast,Love to dance in my free time"
const contactContent = " Ph No- 8777045674, email id: prasunmondal60@gmail.com."
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", function(req, res){
  blog.find({},function(err,posts){
    if(!err){
      res.render("home",{
        startingContent: homeStartingContent,
        posts: posts
      })
    }
  })
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/delete",function(req,res){
  const postt=req.body.post;
  blog.deleteOne({title:postt},function(err){
    if(!err){
      console.log("sucessfully deleted");
      res.redirect("/");
    }
  })
})

app.post("/compose", function(req, res){
  const post = new blog({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){

    if (!err){
    
    res.redirect("/");
    
    }
    
    });

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  blog.find({},function(err,posts){
    if(!err){
      posts.forEach(function(post){
        const storedTitle = _.lowerCase(post.title);
    
        if (storedTitle === requestedTitle) {
          res.render("post", {
            title: post.title,
            content: post.content
          });
        }
      });
    }
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
