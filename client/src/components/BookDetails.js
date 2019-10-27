import React, { Fragment } from "react";
import { graphql } from "@apollo/react-hoc";
import { getBookQuery } from "../queries/queries";

const BookDetails = props => {
	console.log(props);

	const displayBookDetails = () => {
		const { book } = props.data;
		if (book) {
			const { name, genre, author } = book;
			return (
				<Fragment>
					<h2>{name}</h2>
					<p>{genre}</p>
					<p>{author.name}</p>
					<p>All books by this author:</p>
					<ul className="other-books">
						{author.books.map(item => (
							<li key={item.id}>{item.name}</li>
						))}
					</ul>
				</Fragment>
			);
		} else return <Fragment>No book selected...</Fragment>;
	};

	return <div id="book-details">{displayBookDetails()}</div>;
};

export default graphql(getBookQuery, {
	options: props => ({ variables: { id: props.bookId } })
})(BookDetails);
