//setup

var utilities = require("./utilities.js");
var fs = require("fs");
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");

//variables

let arrUsers = [];
let arrWords = [];
let curDeliveries = [];
let curOrders = [];
let allOrders = [];
let validOrders = [];
let User, Order;
let curUser = {userId : undefined};
let orderCount = 0;
let userCount = 0;



updateOrder = (id, method) => new Promise((resolve, reject) => {
	if (method == "cancel") {
		Order.updateOne({orderId: id}, {$set: {status: 'cancelled'}}, (err, res) => {
			err ? reject(err) : console.log("order status updated to: cancelled");
			resolve();
		});
	} else if (method == "pending") {
		Order.updateOne({orderId: id}, {$set: {status: 'pending', delivererId: curUser.userId}}, (err, res) => {
			err ? reject(err) : console.log("order status updated to: pending");
			resolve();
		});
	} else if (method == "complete") {
		Order.updateOne({orderId: id}, {$set: {status: 'completed'}}, (err, res) => {
			err ? reject(err) : console.log("order status updated to: complete");
			resolve();
		});
	} else if (method == "final") {
		Order.updateOne({orderId: id}, {$set: {status: 'final'}}, (err, res) => {
			err ? reject(err) : console.log("order status updated to: final");
			resolve();
		});
	} else if (method == "ordered") {
		Order.updateOne({orderId: id}, {$set: {status: 'ordered', delivererId: null}}, (err, res) => {
			err ? reject(err) : console.log("order status updated to: ordered");
			resolve();
		});
	}
});

createModels = _ =>  new Promise((resolve, reject) => {
	User = mongoose.model("user", new mongoose.Schema({
		userId: String,
		username: String,
		password: String,
		email: String,
		dateCreated: Date,
		location: String,
		name: String,
		surname: String,
	}));

	Order = mongoose.model("order", new mongoose.Schema({
		orderId: String,
		buyerId: String,
		buyerUsername: String,
		delivererId: String,
		date: Date,
		status: String,
		paymentOption: String,
		deliveryDate: Date,
		items: [],
		rating: Number
	}));
	console.log("created models successfully");
	resolve();
});

createUser = user => new Promise((resolve, reject) => {
	User.create({
		userId: getUserId(++userCount),
		username: user["username"],
		password: user["password"],
		email: user["email"],
		dateCreated: new Date(),
		location: "Secunda",
		name: user["name"],
		surname: user["surname"],
	}, (err, user) => err ? reject(err) : (console.log("created user succesfully"), resolve()));
});

createOrder = order => new Promise((resolve, reject) => {
	Order.create({
		orderId: ++orderCount,
		buyerId: curUser.userId,
		buyerUsername: curUser.username,
		delivererId: null,
		date: new Date(),
		status: "ordered",
		paymentOption: "cash",
		deliveryDate: new Date(),
		items: order,
		rating: randomFloat(0, 5)
	});
	console.log("created order succesfully");
	resolve();
});

getCurUser = req => new Promise((resolve, reject) => {
	arrUsers.forEach(user => {
		if (user["username"] == req.body["username"]) {
			curUser = user;
			console.log("user updated");
			resolve();
		}
	});
	reject("user not found");
});

readRandomWords = _ => new Promise((resolve, reject) => {
	fs.readFile("randomWords.txt", (err, data) => {
		if (err) {
			reject(err);
		} else {
			data.toString().split("\n").map(word => {
				arrWords.push(word.substring(0, word.length - 1))
			});
			console.log("words read");
			resolve();
		}
	});
});

getAllUsers = _ => new Promise((resolve, reject) => {
	User.find({} , (err, users) => {
		arrUsers = [];
		err ? reject(err) : users.map(user => {
			arrUsers.push(user);
		});
		console.log("all users gotten from database");
		resolve();
	});
});

getAllOrders = _ => new Promise((resolve, reject) => {
	Order.find({}, (err, orders) => {
		allOrders = [];
		if (err) {
			reject(err)
		} else {
			orderCount = 0;
			orders.map(order => {
				if (order.status != 'cancelled' && order.status != 'final') {
					allOrders.push(order);
				}
				orderCount++;
			});
			console.log("all orders gotten from database");
			resolve();
		}
	});
});

getValidOrders = _ => new Promise((resolve, reject) => {
	validOrders = [];
	allOrders.forEach(order => {
		let taken = (order.delivererId != curUser.userId) && (order.delivererId != null);
		let myOrder = order.buyerId == curUser.userId;
		let finished = order.status == "completed";
		(!taken && !myOrder && !finished) ? validOrders.push(order) : null;
	});

	console.log("all valid orders processed");
	resolve();
});

getOrderById = id => new Promise((resolve, reject) => {
	allOrders.forEach(order => order.orderId == id ? resolve(order) : null);
	reject("order not found");
});

getMyOrders = _ => new Promise((resolve, reject) => {
	curOrders = [];
	allOrders.forEach(order => order.buyerId == curUser.userId ? curOrders.push(order) : null);
	console.log("current user orders processed");
	resolve();
});

getMyDeliveries = _ => new Promise((resolve, reject) => {
	curDeliveries = [];
	allOrders.forEach(order => {
		let myId = order.delivererId === curUser.userId;
		let finished = order.status == "completed";
		if (myId && !finished) {
			curDeliveries.push(order);
		}
	});
	console.log("current user deliveries processed");
	resolve();
});

testCartItem = id => new Promise((resolve, reject) => {
	let found = false;
	getMyDeliveries()
	.then(_ => {
		curDeliveries.forEach(delivery => {
			if (delivery.orderId == id) {
				found = true;
				updateOrder(id, "ordered")
				.then(resolve);
			}
		});
	});
	!found ? updateOrder(id, "pending").then(resolve) : null;
});


//get and post

app.get("/", (req, res) => {
	getValidOrders()
	.then(getMyDeliveries)
	.then(_ => {
		res.render("home", {
			orders: validOrders,
			deliveries: curDeliveries,
			curUser : curUser
		})
	})
	.catch(err => console.log(err));
});

app.get("/userprofile", (req, res) => {
	if (curUser.userId) {
		getMyOrders()
		.then(getMyDeliveries)
		.then(_ => {
			res.render("userprofile", {
				user: curUser,
				orders: curOrders,
				deliveries: curDeliveries
			});
		})
		.catch(err => console.log(err));
	} else {
		res.redirect("/login");
	}
});

app.get("/order", (req, res) => {
	if (curUser.userId) {
		readRandomWords()
		.then(_ => res.render("order", {randomWordArray: arrWords}))
		.catch(err => console.log(err));
	} else {
		res.redirect("/login");
	}
});

app.get("/info", (req, res)	=> res.render("info"));

app.get("/login", (req, res) => curUser.userId ? res.redirect("/userprofile") : res.render("login")); 

app.get("/signup", (req, res) => res.render("signup"));

app.get("/log_out", (req, res) => {
	curUser = {userId : undefined};
	curDeliveries = [];
	curOrders = [];
	res.redirect("/");
});

app.get("/new_order/:order", (req, res) => {
	createOrder(JSON.parse(req.params.order))
	.then(getAllOrders)
	.then(_ => res.redirect("/userprofile"))
	.catch(err => console.log(err));
});

app.get("/cancel_item/:index", (req, res) => {
	res.json();
	updateOrder(req.params.index, "cancel")
	.then(getAllOrders)
	.catch(err => console.log(err))
});

app.get("/finish_item/:index", (req, res) => {
	res.json();
	updateOrder(req.params.index, "complete")
	.then(getAllOrders)
	.catch(err => console.log(err));
});

app.get("/finalise_item/:index", (req, res) => {
	res.json();
	updateOrder(req.params.index, "final")
	.then(getAllOrders)
	.catch(err => console.log(err));
});

app.post("/cart_item/:index", (req, res) => {
	res.json();
	testCartItem(req.params.index)
	.then(getAllOrders)
	.catch(err => console.log(err));
});

app.post("/add_user", (req, res) => {
	createUser(req.body)
	.then(getAllUsers)
	.then(_ => res.redirect(307, "/test_user"))
	.catch(err => console.log(err));
});

app.post("/test_user", (req, res) => {
	getCurUser(req)
	.then(_ => res.redirect("/userprofile"))
	.catch(err => {console.log(err); res.redirect("/login")});
});


//create Page
mongoose.connect("mongodb://localhost/bulkbuy", { useNewUrlParser: true, useUnifiedTopology: true });
app.listen(3000, _ => {
	console.log("starting server...");
	createModels()
	.then(getAllOrders)
	.then(getAllUsers)
	.then(readRandomWords)
	.catch(err => console.log(err));
});