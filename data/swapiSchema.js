/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLEnumType,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString
} from 'graphql';

import * as _ from "lodash";
// import { Client } from "pg";
// const client = new Client({
//   connectionString: 'postgresql://postgres:mysecretpassword@localhost:5432/postgres'
// })
// client.connect();
// client.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
// });

import models from '../models/index.js';

import { makeExecutableSchema } from 'graphql-tools';

const schemaString = `
schema {
  query: Query
  mutation: Mutation
}

# The query type, represents all of the entry points into our object graph
type Query {
  readNote(id: String): Note
  listNotes: [Note]
}

# The mutation type, represents all updates we can make to our data
type Mutation {
  createNote(note: NoteInput): Note
  updateNote(note: NoteInput): Note
  deleteNote(note: NoteInput): Note
}

type Note {
  id: String
  title: String
  content: String
  createdAt: Float
}

input NoteInput {
  id: String!
  title: String
  content: String
  createdAt: Float
}
`;

// const notes = [
//   {
//     id: '2000',
//     title: 'C-3PO',
//     content: 'note content',
//     createdAt: 1527106784849
//   },
// ];

// const resolvers = {
//   Query: {
//     readNote: (root, { id }) => {
//       console.log('notes readNote', notes);
//       return _.find(notes, {
//         id: id
//       });
//     },
//     listNotes: () => {
//       return notes;
//     }
//   },
//   Mutation: {
//     createNote: (root, { note }) => {
//       notes.push(note);
//       console.log('notes createNote', notes);
//       return note;
//     },
//     updateNote: (root, { note }) => {
//       notes[_.findIndex(notes, {
//         id: note.id
//       })] = note;
//       console.log('notes updateNote', notes);
//       return note
//     },
//     deleteNote: (root, { note }) => {
//       _.remove(notes, {
//         id: id
//       });
//       console.log('notes deleteNote', notes);
//       return note;
//     },
//   },
// }


const resolvers = {
  Query: {
    readNote: (root, { id }) => {
      console.log('notes readNote', id);
      return models.Note.findById(id);
    },
    listNotes: () => {
      console.log('notes listNotes');
      return models.Note.findAll();
    }
  },
  Mutation: {
    createNote: (root, { note }) => {
      return models.Note.build(note).save();
    },
    updateNote: (root, { note }) => {
      return models.Note.findById(note.id).then((existing_note) => {
        return existing_note.update(note);
      });
    },
    deleteNote: (root, { note }) => {
      return models.Note.findById(note.id).then((existing_note) => {
        return existing_note.destroy({force: true});
      });
    },
  },
}

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const StarWarsSchema = makeExecutableSchema({
  typeDefs: [schemaString],
  resolvers
});
