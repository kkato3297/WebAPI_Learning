var MongoClient = require('mongodb').MongoClient,
    settings = require('./settings');
MongoClient.connect("mongodb://localhost/"+settings.db, function(err, client) {
	if (err) { return console.dir(err); }

	// callbackに渡されるオブジェクトが変わった
	// db名を明示的に指定してdbオブジェクトを取得する必要がある
	const db = client.db(settings.db);

	console.log("connected to db");
	db.collection("users", function(err, collection) {
		var docs = [
			{name: "taguchi", score: 40},
			{name: "fkoji", score: 80},
			{name: "dotinstall", score: 60}
		];
		/*
		collection.find({name: "taguchi"}).toArray(function(err, items) {
			console.log(items);
		});
		*/
		var stream = collection.find().stream();
		stream.on("data", function(item) {
			console.log(item);
		});
		stream.on("end", function() {
			console.log("finished.");
		});
	});
});
