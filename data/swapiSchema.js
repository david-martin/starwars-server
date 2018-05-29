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

import models from '../models/index.js';

import { makeExecutableSchema } from 'graphql-tools';
import * as fs from 'fs';
import * as path from 'path';

const schemaString = fs.readFileSync(path.join(__dirname, 'schema.graphql')).toString();

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

debugger