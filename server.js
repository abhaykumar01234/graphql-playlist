const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema/schema");

const app = express();

// connect to mlab database
mongoose.connect("mongodb://test:test123@ds121413.mlab.com:21413/mytest-db", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

mongoose.connection.once("open", () => console.log("Connected to database"));

app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		graphiql: true
	})
);

// Server static assets in production
if (process.env.NODE_ENV === "production") {
	// set static folder
	app.use(express.static("client/build"));
	app.get("*", (req, res) =>
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
	);
}

app.listen(4000, () => console.log(`Listening for requests on port 4000...`));
