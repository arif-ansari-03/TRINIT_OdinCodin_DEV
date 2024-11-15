const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const passport = require("passport")
const session = require("express-session");
const bodyParser = require('body-parser');
const path = require("path")
const router = express.Router();
const passportSetup = require("./passport-setup");

const app = express();

dotenv.config();

app.use(session({
    secret: 'tri-nit-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 5 * 60 * 60 * 24 * 1000, // 5 days
    },
}));

app.use(bodyParser.json());

app.use(
    cors({
        origin:"http://localhost:3000",
        methods:"GET,POST,PUT,DELETE,PATCH",
        credentials: true
    }
))

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://itsaryanpatil:oneboard@oneboardcluster1.ibxuo.mongodb.net/UserPass"); 
app.use(express.json());

app.get("/", (req, res) => {
    try {
        return res.status(200).json("JSON Server is running");
    } catch (error) {
        console.log(error)
    }
})

app.get("/login/success", (req, res) => {
	if (req.user) {
        res.redirect("http://localhost:3000/")
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});

app.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

app.post('/user/login', (req, res, next) => {
    passport.authenticate('user-local', (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
  
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
  
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Internal server error" });
        }
  
        return res.status(200).json({ message: "Login successful", user : user });
      });
    })(req, res, next);
  });
  

app.get('/user', (req, res) => {
    res.status(200).send(req.user)
})

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect("http://localhost:3000/")
    });
});

app.get('/auth/check-session', (req, res) => {
    if (req.isAuthenticated()) {
        // If the user is authenticated, return user details
        return res.json(req.user);
    } else {
        // If the user is not authenticated, return an empty object
        return res.json({});
    }
});

const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const analyticsRoute = require("./routes/analytics")

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute)
const paperRoute = require("./routes/papers")
const grpRoute = require("./routes/group")
const grpMsgRoute = require("./routes/groupMessage")

app.use("/api/v1/papers", paperRoute);
app.use("/api/v1/groups",grpRoute)
app.use("/api/v1/groups/messages",grpMsgRoute)
app.use("/api/v1/analytics", analyticsRoute);


passportSetup();

app.listen(8000, () => {
    console.log("Backend server is running!")
})