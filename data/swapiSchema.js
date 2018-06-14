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

import { PubSub, SubscriptionManager, withFilter } from 'graphql-subscriptions';
const pubsub = new PubSub();
const CREATED_NOTE_TOPIC = 'new_note';

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
      let newNote = models.Note.build(note).save();
      // This is a simplified pub/sub setup that doesn't take
      // into account if the model created OK, or return the
      // resulting created model
      pubsub.publish(CREATED_NOTE_TOPIC, {noteCreated: note});
      return newNote;
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
  Subscription: {
    noteCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(CREATED_NOTE_TOPIC),
        (payload, variables) => {
          return payload !== undefined;
            // return (payload !== undefined) && 
            // ((variables.episode === null) || (payload.reviewAdded.episode === variables.episode));
        }
      ),
    }
  }
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