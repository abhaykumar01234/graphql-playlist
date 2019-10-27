const {
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLNonNull,
	GraphQLList,
	GraphQLSchema,
	GraphQLID
} = require("graphql");
const DataLoader = require("dataloader");
const { groupBy, map } = require("ramda");

// models
const Book = require("../models/Book");
const Author = require("../models/Author");
//const _ = require("lodash");

//Dummy data
/*
var books = [
	{ id: "1", name: "Name of the Wind", genre: "Fantasy", authorId: "1" },
	{ id: "2", name: "The Final Empire", genre: "Fantasy", authorId: "2" },
	{ id: "3", name: "The Long Earth", 	genre: "Sci-Fi", authorId: "3" },
	{ id: "4", name: "The Hero of ages", genre: "Fantasy", authorId: "2" },
	{ id: "5", name: "The Color of Magic", genre: "Fantasy", authorId: "3" },
	{ id: "6", name: "The Light Fantastic", genre: "Fantasy", authorId: "3" }
];

var authors = [
	{ name: "Patrick Rothfuss", age: 44, id: "1" },
	{ name: "Brandon Sanderson", age: 42, id: "2" },
	{ name: "Terry Pratchett", age: 66, id: "3" }
];
*/

// Dataloaders
const bookDataLoader = () => new DataLoader(getBooksOfAuthors);
const authorDataLoader = () => new DataLoader(getAuthorsOfBooks);

const getBooksOfAuthors = async authorIds => {
	console.log(`Query : Books by authorIds - ${authorIds}`);
	const books = await Book.find({ authorId: { $in: [...authorIds] } });
	const groupedById = groupBy(book => book.authorId, books);
	return map(authorId => groupedById[authorId], authorIds);
};

const getAuthorsOfBooks = async bookAuthorIds => {
	await Author.find({ _id: { $in: [...bookAuthorIds] } });
};

//*/

// Author Type
const AuthorType = new GraphQLObjectType({
	name: "Author",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: new GraphQLList(BookType),
			async resolve(parent, args) {
				//return _.filter(books, { authorId: parent.id });
				// console.log(`Query : Books by authorId - ${parent._id}`);
				// return Book.find({ authorId: parent._id });
				return await bookDataLoader().load(parent._id);
			}
		}
	})
});

// Book Type
const BookType = new GraphQLObjectType({
	name: "Book",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },

		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				//return _.find(authors, { id: parent.authorId });
				console.log(`Query : Author of book by id - ${parent.authorId}`);
				return Author.findById(parent.authorId);
			}
		}
	})
});

// Root Query
const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		book: {
			type: BookType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve(parent, args) {
				// code to get data from db/other source
				//return _.find(books, { id: args.id });
				console.log(`Query : Book by id - ${args.id}`);
				return Book.findById(args.id);
			}
		},

		author: {
			type: AuthorType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve(parent, args) {
				//return _.find(authors, { id: args.id });
				console.log(`Query : Author by id - ${args.id}`);
				return Author.findById(args.id);
			}
		},

		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				//return books;
				console.log(`Query : All Books`);
				return Book.find({});
			}
		},

		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args) {
				//return authors;
				console.log(`Query : All Authors`);
				return Author.find({});
			}
		}
	}
});

//Mutations
const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) }
			},
			resolve(parent, args) {
				let { name, age } = args;
				let author = new Author({
					name,
					age
				});
				return author.save();
			}
		},

		addBook: {
			type: BookType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				authorId: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve(parent, args) {
				let { name, genre, authorId } = args;
				let book = new Book({
					name,
					genre,
					authorId
				});
				return book.save();
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
