'use strict';

import 'babel/polyfill';

import * as express from 'express';
import {default as bodyParser} from 'body-parser';
import {resolve} from 'path';

import {db} from './database';

import {router as person} from './services/person/api';

export const app = express['default']();

// parse request bodies
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// initialize orm to provide req.models to express routers
app.use(db());

// register routers
app.use('/api/v1/person', person);

// serve files from ../client as static content
app.use(express.static(resolve(__dirname, '..', 'client')));
// serve files from ../../bower_components as static content at /bower_components
app.use('/bower_components', express.static(resolve(__dirname, '..', '..', 'bower_components')));

// serve index.html if everything else fails
app.use((req, res) => res.sendFile(resolve(__dirname, '..', 'client/index.html')));