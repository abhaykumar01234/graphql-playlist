import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-components";

//components
import BookList from "./components/BookList";
import AddBook from "./components/AddBook";

const App = () => {
	//apollo client setup
	const client = new ApolloClient({
		uri: "/graphql"
	});

	return (
		<ApolloProvider client={client}>
			<div id="main">
				<h1>Ninja's Reading List</h1>
				<BookList />
				<AddBook />
			</div>
		</ApolloProvider>
	);
};

export default App;
