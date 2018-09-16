var express = require("express");
var app = express();

var bodyParser = require("body-parser");

var request = require("request");

methodOverride = require("method-override");

// var mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost/runtracking", {useNewUrlParser: true});

const Sequelize = require("sequelize");
const sequelize = new Sequelize('d44r132kdeefer', 'hvwvyrbinytxga', '80ddf8ed99a35b2e20971aeb0c5b41bd8fe16009b57fe17083569a74b45aad55', {
	dialect: "postgres",
	host: "ec2-107-21-126-193.compute-1.amazonaws.com",
	port: 5432,
	protocol: null,
	native: true
});

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

const Trail = sequelize.define("trail", {
	title: Sequelize.STRING,
	description: Sequelize.TEXT,
	createdAt: {
		field: "createdat",
		type: Sequelize.DATE
	},
	updatedAt: {
		field: "updatedat",
		type: Sequelize.DATE		
	}
});

const Run = sequelize.define("run", {
	distance: Sequelize.FLOAT,
	time: Sequelize.STRING,
	pacepermile: Sequelize.STRING,
	elevationgain: Sequelize.INTEGER,
	rundate: Sequelize.DATEONLY,
	notes: Sequelize.TEXT,
	createdAt: {
		field: "createdat",
		type: Sequelize.DATE
	},
	updatedAt: {
		field: "updatedat",
		type: Sequelize.DATE		
	},
	trailId: {
		field: "trailid",
		type: Sequelize.INTEGER
	}
});

Run.belongsTo(Trail);


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

// var pgp = require("pg-promise")();
// const db = pgp('postgres://hvwvyrbinytxga:80ddf8ed99a35b2e20971aeb0c5b41bd8fe16009b57fe17083569a74b45aad55@ec2-107-21-126-193.compute-1.amazonaws.com:5432/d44r132kdeefer?ssl=true');

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

app.get("/", function(req, res) {
	res.render("home");
});

app.get("/addNewRun", function(req,res) {
    var trails = Trail.findAll({attributes: ['id','title']}).then(function(data) {
	    res.render("addnewrun", {trails:data});
    });
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

	// db.none('INSERT INTO runs (distance, time, pacepermile, rundate, elevationgain, notes, trailid) VALUES ($1, $2, $3, $4, $5, $6, $7)', [req.body.run.distance,req.body.run.time,req.body.run.pacepermile, req.body.run.rundate, req.body.run.elevationgain, req.body.run.notes, req.body.run.runtype])
	// 	.then(data => {
	// 		console.log("success");
	// 		res.redirect("/runs");
	// 	}).catch(error => {
	// 		console.log(error);
	// 	});	

	return sequelize.transaction(function (t) {
	  return Run.create({
	    distance: req.body.run.distance,
	    time: req.body.run.time,
	    pacepermile: req.body.run.pacepermile,
	    rundate: req.body.run.rundate,
	    elevationgain: req.body.run.elevationgain,
	    notes: req.body.run.notes,
	    trailId: req.body.run.trailid
	  }, {transaction: t});
	}).then(function (result) {
		console.log(result);
		res.redirect("/runs");
	}).catch(function (error) {
		console.log(error);
	});

});

app.get("/runs/edit/:id", function(req, res) {
	db.any("SELECT * FROM run WHERE id = $1", req.params.id)
		.then(function(data) {
			console.log(data);
			res.render("runedit", {run:data[0]});
		}).catch(function(error) {
			console.log(error);
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
			console.log(error);
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
			console.log(error);
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
    var runs = Run.findAll().then(function(rundata) {
    	var trails = Trail.findAll().then(function(traildata) {
		    res.render("runs", {runs:rundata, trails:traildata});
    	})
    });	

	// db.any("SELECT * FROM run")
	// 	.then(function(data) {
	// 		console.log(data);
	// 		res.render("runs", {runs:data});
	// 	}).catch(function(error) {
	// 		console.log(error)
	// 	});	

	// Run.find({}, function(error, runs) {
	// 	if (error) {
	// 		console.log(error);
	// 	} else {
	// 		res.render("runs", {runs:runs})
	// 	}
	// });
});

app.get("/runs/:id", function(req, res) {
    var runs = Run.findOne({
    		where: {
		    	id: req.params.id
    		},
	    	include: [{
	    		model:Trail
	    	}],
    	}).then(function(data) {
    	console.log(data);
	    res.render("rundetail", {run:data});
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

app.get("/trails/:id", function(req, res) {
    var runs = Run.findAll({
    	where: {
    		trailId: req.params.id
    	}
    }).then(function(data) {
	    res.render("trails", {runs:data});
    });	
});


app.get("*", function(req, res) {
   res.send("This shows on all pages except the routes above this one"); 
});

app.listen(process.env.PORT || 5000, process.env.IP, function() {
   console.log("Server has started");
});