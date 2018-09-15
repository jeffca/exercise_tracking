var express = require("express");
var app = express();

var bodyParser = require("body-parser");

var request = require("request");

methodOverride = require("method-override");

var mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/runtracking", {useNewUrlParser: true})

// var trailSchema = new mongoose.Schema({
// 	name: String,
// 	city: String
// });
// var Trail = mongoose.model("Trail", trailSchema);

// var runtrackingSchema = new mongoose.Schema({
// 	distance: Number,
// 	time: String,
// 	pacepermile: Number,
// 	trail: trailSchema
// });
// var Run = mongoose.model("Run", runtrackingSchema);

// var test = new Run({
// 	distance: 4,
// 	time: "42:00",
// 	pacepermile: 10.2,
// 	trail: {name: "Cross Kirkland Corridor", city:"Kirkland"}
// });

// test.save(function(error, run){
// 	if(error){
// 		console.log(error);
// 	} else {
// 		console.log("saved");
// 		console.log(run);
// 	}
// });

var pgp = require("pg-promise")();
const db = pgp('postgres://hvwvyrbinytxga:80ddf8ed99a35b2e20971aeb0c5b41bd8fe16009b57fe17083569a74b45aad55@ec2-107-21-126-193.compute-1.amazonaws.com:5432/d44r132kdeefer?ssl=true');

// db.none('INSERT INTO run (distance, time, pacepermile) VALUES ($1, $2, $3)', [1,'432', 59])
// 	.then(data => {
// 		console.log("success");
// 		console.log(data);
// 	}).catch(error => {
// 		console.log(error);
// 	});




app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method")); //to handle PUT/DELETE requests in HTML forms
app.set("view engine", "ejs"); //tells the server to use ejs files


// request("http://google.com", function(error, response, body) {
// 	if (!error && response.statusCode == 200) {
// 		//returned data is a string. you need JSON.parse(body) to convert the string to a JSON object
// 		var parsedData = JSON.parse(body);
// 		console.log(body)
// 	}
// });

app.get("/", function(req,res) {
    var values =  [ ]
    res.render("home");
});

app.get("/friends", function(req, res) {
	var friends = ["Jim", "Bob", "Larry"];
	res.render("friends", {friends:friends})
});

app.post("/addfriend", function(req, res) {
	console.log(req.body.newfriend);
	res.redirect("friends")
});

app.post("/addNewRun", function(req, res) {
	// var distance = req.body.distance;
	// var time = req.body.time;
	// var pacepermile = req.body.pacepermile;
	// Run.create(req.body.run, function(error, newRun) {
	// 	if (error) {
	// 		console.log(error);
	// 	} else {
	// 		res.redirect("/runs");
	// 	}
	// });
	db.none('INSERT INTO run (distance, time, pacepermile) VALUES ($1, $2, $3)', [req.body.run.distance,req.body.run.time,req.body.run.pacepermile])
		.then(data => {
			console.log("success");
			res.redirect("/runs");
		}).catch(error => {
			alert(error);
		});	

});

app.get("/runs/edit/:id", function(req, res) {
	db.any("SELECT * FROM run WHERE id = $1", req.params.id)
		.then(function(data) {
			console.log(data);
			res.render("runedit", {run:data[0]});
		}).catch(function(error) {
			alert(error)
		});	

	// Run.findById(req.params.id, function(error, run) {
	// 	if (error) {
	// 		console.log(error);
	// 	} else {
	// 		res.render("runedit", {run:run})
	// 	}
	// });
});

app.put("/runs/:id", function(req, res) {
	db.none('UPDATE run SET distance = $1, time = $2, pacepermile = $3', [req.body.run.distance, req.body.run.time, req.body.run.pacepermile])
		.then(data => {
			console.log("success");
			res.redirect("/runs");
		}).catch(error => {
			alert(error);
		});	

	// Run.findByIdAndUpdate(req.params.id, req.body.run, function(error, updatedRun) {
	// 	if(error) {
	// 		console.log("error");
	// 	} else {
	// 		res.redirect("/runs/" + req.params.id);
	// 	}
	// })
});

app.delete("/runs/:id", function(req, res) {
	db.none('DELETE FROM run WHERE id = $1', req.params.id)
		.then(data => {
			console.log("success");
			res.redirect("/runs");
		}).catch(error => {
			alert(error);
		});	

	// Run.findByIdAndRemove(req.params.id, function(error) {
	// 	if (error) {
	// 		console.log(error);
	// 	} else {
	// 		res.redirect("/runs");
	// 	}
	// })
});

app.get("/runs", function(req, res) {
	db.any("SELECT * FROM run")
		.then(function(data) {
			console.log(data);
			res.render("runs", {runs:data});
		}).catch(function(error) {
			alert(error)
		});	

	// Run.find({}, function(error, runs) {
	// 	if (error) {
	// 		console.log(error);
	// 	} else {
	// 		res.render("runs", {runs:runs})
	// 	}
	// });
});

app.get("/runs/:id", function(req, res) {
	db.any("SELECT * FROM run WHERE id = $1", req.params.id)
		.then(function(data) {
			console.log(data);
			res.render("rundetail", {run:data[0]});
		}).catch(function(error) {
			alert(error)
		});	
	// Run.findById(req.params.id, function(error, run) {
	// 	if (error) {
	// 		console.log(error);
	// 	} else {	
	// 		console.log(run);		
	// 		res.render("rundetail", {run:run})
	// 	}
	// });
});

app.get("/trails", function(req, res) {
	Trail.findOne({name: "Cross Kirkland Corridor"}, function(error, trail) {
		if(error) {
			console.log(error);
		} else {
			res.send(trail);
		}
	});
});

app.get("/r/:subreddit", function(req, res) {
    var subreddit = req.params.subreddit;
    res.send("welcome to the " + subreddit + " subreddit");
});

app.get("*", function(req, res) {
   res.send("This shows on all pages except the routes above this one"); 
});

app.listen(process.env.PORT || 5000, process.env.IP, function() {
   console.log("Server has started");
});