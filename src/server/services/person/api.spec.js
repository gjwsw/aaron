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
            .end((err, result) => {
                if (err) {
                    throw err;
                }
                assert.ok(_.isArray(JSON.parse(result.text)));
                done();
            });
    });

    it(`${POST} / should create a new person`, done => {
        request(app)
            .post('/')
            .send({givenname: 'foo', familyname: 'bar', age: 1})
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, result) => {
                if (err) {
                    throw err;
                }
                assert.ok(/\/\d+"$/.test(result.text));
                done();
            });
    });
    
    it(`${DELETE} / should bulk delete all persons`, done => {
        request(app)
            .delete('/')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, result) => {
                if (err) {
                    throw err;
                }
                assert.ok(/successfully deleted \d+/.test(result.text));
                done();
            });
    });

    it(`${GET} /:id should retrieve a single item`, done => {
        const expected = {givenname: 'foo', familyname: 'bar', age: 2};
        request(app)
            .post('/')
            .send(expected)
            .expect(200)
            .end((err, url) => {
                if (err) {
                    throw err;
                }
                request(app)
                    .get(url.body)
                    .expect(200)
                    .end((err, result) => {
                        if (err) {
                            throw err;
                        }
                        Object.keys(expected).forEach(key => assert.deepEqual(expected[key], result.body[key]));
                        done();
                    });
            });
    });
});