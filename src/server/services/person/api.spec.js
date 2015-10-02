'use strict';

import 'babel/polyfill';

import * as _ from 'underscore';
import * as assert from 'assert';
import {default as request} from 'supertest';

import {testapp, GET, POST, DELETE} from '../../util/test';
import {router} from './api';

const app = testapp();
app.use('/', router);

describe('person', () => {
    it(`${GET} / should list all persons`, done => {
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                assert.ok(_.isArray(JSON.parse(res.text)));
                done();
            });
    });
    it(`${POST} / should create a new person`, done => {
        request(app)
            .post('/')
            .send({givenname: 'Hugo', familyname: 'Kraut', age: 77})
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                assert.ok(/\/\d+"$/.test(res.text));
                done();
            });
    });
    it(`${DELETE} / should bulk delete all persons`, done => {
        request(app)
            .delete('/')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                assert.ok(/successfully deleted \d+/.test(res.text));
                done();
            });
    });
});