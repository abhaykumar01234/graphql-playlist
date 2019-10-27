import React, { useState } from "react";
import { graphql } from "@apollo/react-hoc";
import { flowRight as compose } from "lodash";
import {
	getBooksQuery,
	getAuthorsQuery,
	addBookMutation
} from "../queries/queries";

const AddBook = props => {
	const [book, setBook] = useState({
		name: "",
		genre: "",
		authorId: ""
	});

	const displayAuthors = () => {
		let {
			getAuthorsQuery: { loading, authors }
		} = props;
		if (loading) return <option disabled>Loading Authors...</option>;
		else
			return authors.map(author => (
				<option key={author.id} value={author.id}>
					{author.name}
				</option>
			));
	};

	const onChange = e => setBook({ ...book, [e.target.name]: e.target.value });

	const onSubmit = e => {
		e.preventDefault();
		console.log(props, book);
		props.addBookMutation({
			variables: {
				...book
			},
			refetchQueries: [{ query: getBooksQuery }]
		});
		setBook({
			name: "",
			genre: "",
			authorId: ""
		});
	};

	return (
		<form id="add-book" onSubmit={onSubmit}>
			<div className="field">
				<label>Book Name:</label>
				<input type="text" name="name" onChange={onChange} value={book.name} />
			</div>

			<div className="field">
				<label>Genre:</label>
				<input
					type="text"
					name="genre"
					onChange={onChange}
					value={book.genre}
				/>
			</div>

			<div className="field">
				<label>Author:</label>
				<select name="authorId" onChange={onChange}>
					<option>Select author</option>
					{displayAuthors()}
				</select>
			</div>
			<button>+</button>
		</form>
	);
};

export default compose(
	graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
	graphql(addBookMutation, { name: "addBookMutation" })
)(AddBook);
