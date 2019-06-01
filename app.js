var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Student         = require("./models/student"),
    User            = require("./models/user.js"),
    methodOverride  = require("method-override");

mongoose.connect("mongodb://localhost:27017/fms",{useNewUrlParser : true});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));

// Landing Route
app.get("/",function(req,res){
    res.render("landing");
});


// Index Route
app.get("/students",function(req,res){
    Student.find({},function(err,students){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{students: students})
        }
    });
});


// Create Route
app.post("/students",function(req,res){    
    Student.create(req.body.student,function(err,newStudent){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/students");
        }
    })
});

// New Route
app.get("/students/new",function(req,res){
    res.render("new");    
});

// Show Route
app.get("/students/:id",function(req,res){
    Student.findById(req.params.id,function(err,foundStudent){
        if(err){
            console.log(err);
        }        
        else{
            res.render("show",{student: foundStudent});
        }
    });
});

// Edit Route
app.get("/students/:id/edit",function(req,res){
    Student.findById(req.params.id,function(err,editStudent){
        if(err){
            console.log(err);
        }
        else{
            res.render("edit",{student: editStudent});
        }
    });
});

// Update Route
app.put("/students/:id",function(req,res){
    Student.findByIdAndUpdate(req.params.id,req.body.student,function(err,updatedStudent){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/students/"+req.params.id);
        }
    });
});

// Delete Route
app.delete("/students/:id",function(req,res){
    Student.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/students");
        }
        else{
            res.redirect("/students");
        }
    });
});

// Server Starting
app.listen(3000,function(){
    console.log("The Server Has Started!!!"); 
 });