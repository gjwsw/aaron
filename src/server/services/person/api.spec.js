'use strict';

import 'babel/polyfill';

import {deepEqual} from 'assert';
import {default as request} from 'supertest';
import {default as express} from 'express';
import {db} from '../../database';
import {router} from './api';

const app = express();
app.use(db);
app.use('/', router);

describe('person', () => {
    it('GET / should list all persons', done => {
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                deepEqual(JSON.parse(res.text), []);
                done();
            });
    });
    it('POST / should create a new person', done => {
        const expected = { givenname: 'Hugo', familyname: 'Kraut', age: 77 };
        request(app)
            .post('/')
            .send(expected)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                deepEqual(res.body, expected);
                done();
            });
    });
});