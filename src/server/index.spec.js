'use strict';

import 'babel/polyfill';

import {deepEqual} from 'assert';
import {default as request} from 'supertest';
import {readFileSync} from 'fs';
import {app} from './index';

describe('aaron', () => {
    describe('html5 history routing', () => {
        it('should serve index.html for all 404 requests', done => {
            request(app)
                .get(`/${Math.random().toString(36).slice(-8)}/`)
                .set('Accept', 'text/html')
                .expect('Content-Type', /html/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }

                    deepEqual(res.text, readFileSync(__dirname + '/../client/index.html').toString());

                    done();
                });
        });
    });
});