var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    Student         = require("./models/student"),
    User            = require("./models/user.js"),
    methodOverride  = require("method-override");

mongoose.connect("mongodb://localhost:27017/fms",{useNewUrlParser : true});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});
//  PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "Oh yeah! I got an Internship at Wishto",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
            res.render("students/index",{students: students,currentUser: req.user});
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
app.get("/students/new",isLoggedIn,function(req,res){
    res.render("students/new");    
});

// Show Route
app.get("/students/:id",function(req,res){
    Student.findById(req.params.id,function(err,foundStudent){
        if(err){
            console.log(err);
        }        
        else{
            res.render("students/show",{student: foundStudent});
        }
    });
});

// Edit Route
app.get("/students/:id/edit",isLoggedIn,function(req,res){
    Student.findById(req.params.id,function(err,editStudent){
        if(err){
            console.log(err);
        }
        else{
            res.render("students/edit",{student: editStudent});
        }
    });
});

// Update Route
app.put("/students/:id",isLoggedIn,function(req,res){
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
app.delete("/students/:id",isLoggedIn,function(req,res){
    Student.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/students");
        }
        else{
            res.redirect("/students");
        }
    });
});

//  Auth Routes

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/students");
        });
    });
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect: "/students",
    failureRedirect: "/login"
}),function(req,res){
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/students");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// Server Starting
app.listen(3000,function(){
    console.log("The Server Has Started!!!"); 
 });