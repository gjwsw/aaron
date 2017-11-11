'use strict';

import 'babel/polyfill';

import * as _ from 'underscore';
import * as assert from 'assert';
import * as async from 'async';
import {default as request} from 'supertest';

import {testapp, GET, POST, PUT, DELETE} from '../util/test';
import {RestfulRouter} from './RestfulRouter';

// using person model here is as good as any (but we need an existing model)
const model = 'person';

class TestRouter extends RestfulRouter {
    constructor() {
        super(model);
    }
}

const app = testapp();
app.use('/', new TestRouter().build());

/**
 * asserts that `url` has a number as its final path element, e.g.
 *
 *     assertIdUrl('/foo/123') // => succeeds
 *     assertIdUrl('/foo')     // => fails
 *
 * @param {string} url the url to be tested
 * @param {string} message? the message to be displayed
 *                          if the assertion fails
 */
function assertIdUrl(url) {
    assert.ok(/\/\d+"?$/.test(url), `${url} should end with a number (i.e. be an instance url)`);
}

/**
 * asserts that each value of `expected` is the same in `actual`, e.g.
 *
 *     assertSubsetequal({foo: 1, bar: 2}, {foo: 1}) // => succeeds
 *     assertSubsetequal({foo: 1}, {foo: 1, bar: 2}) // => fails
 *
 * @param {object} actual must contain all key:value pairs
 *                        of `expected`, may contain more
 * @param {object} expected the key:value mappings that are
 *                          asserted to be in `actual`
 */
function assertSubsetequal(actual, expected) {
    Object.keys(expected).forEach(key => assert.equal(actual[key], expected[key], `${JSON.stringify(actual[key])} should equal ${JSON.stringify(expected[key])}`));
}

/**
 * creates a function for an `async.waterfall` that asserts
 * that `POST /` creates the `item` and returns a url to it
 *
 * @param {object} item the item to create
 * @return ((next: (Error, string) => any) => void)
 * the waterfall function
 */
function waterfallAssertCreate(item) {
    return (next) => {
        request(app)
            .post('/')
            .send(item)
            .expect(200)
            .end((err, url) => {
                if (err) {
                    throw err;
                } else {
                    assertIdUrl(url.body);
                    next(null, url.body);
                }
            });
    };
}

/**
 * creates a function for an `async.waterfall` that asserts
 * that the result of `GET ${url}` subsetequals `expected` and
 * calls `next` with the this result
 *
 * @param {object} expected the expected result of GET `url`
 * @return {(url: string, next: (Error, object) => any) => void}
 * the waterfall function
 */
function waterfallAssertRead(expected) {
    return (url, next) => {
        request(app)
            .get(url)
            .expect(200)
            .end((err, result) => {
                if (err) {
                    throw err;
                } else {
                    assertSubsetequal(result.body, expected);
                    next(null, result.body);
                }
            });
    };
}

/**
 * creates a function for an `async.waterfall` that asserts
 * that `PUT ${url}` updates the item and returns the url of
 * the updated item
 *
 * @param {object} expected the update content
 * @return {(url: string, next: (Error, string) => any) => void}
 * the waterfall function
 */
function waterfallAssertUpdate(expected) {
    return (url, next) => {
        request(app)
            .put(url)
            .send(expected)
            .expect(200)
            .end((err, url) => {
                if (err) {
                    throw err;
                } else {
                    assertIdUrl(url.body);
                    next(null, url.body);
                }
            });
    };
}

/**
 * creates a function for an `async.waterfall` that asserts
 * that `DELETE ${item.id}` successfully deletes `item` and
 * returns a success message containing the items id
 *
 * @return {(item: object, next: (Error, number) => any) => void}
 * the waterfall function
 */
function waterfallAssertDelete() {
    return (item, next) => {
        request(app)
            .delete(`/${item.id}`)
            .expect(200)
            .end((err, message) => {
                if (err) {
                    throw err;
                } else {
                    assert.ok(/successfully deleted \w+ \d+/.test(message.text));
                    next(null, item.id);
                }
            });
    };
}

/**
 * creates a function that finalizes an `async.waterfall`
 * (the callback in `async.waterfall(tasks, callback)`)
 *
 * @param {() => void} done the mocha done callback to be called
 * @return {(Error) => void} the waterfall finalization: throw
 * the error if any occured, else call `done()`
 */
function waterfallFinalize(done) {
    return (err) => {
        if (err) {
            throw err;
        } else {
            done();
        }
    };
}

describe('RestfulRouter', () => {
    it(`${GET} / should result in a list of urls to all items`, done => {
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, result) => {
                if (err) {
                    throw err;
                } else {
                    const actual = JSON.parse(result.text);
                    assert.ok(_.isArray(actual));
                    _.each(actual, assertIdUrl);
                    done();
                }
            });
    });

    it(`${POST} / should result in the url of the newly created item`, done => {
        request(app)
            .post('/')
            .send({givenname: 'foo', familyname: 'bar'})
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, result) => {
                if (err) {
                    throw err;
                } else {
                    assertIdUrl(result.text);
                    done();
                }
            });
    });

    it(`${DELETE} / should result in a success message stating the number of deleted items`, done => {
        request(app)
            .delete('/')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, result) => {
                if (err) {
                    throw err;
                } else {
                    assert.ok(/successfully deleted \d+ \w+/.test(result.text));
                    done();
                }
            });
    });

    it(`${GET} /:id should result in a single item`, done => {
        const expected = {givenname: 'foo', familyname: 'bar'};

        async.waterfall([
            waterfallAssertCreate(expected),
            waterfallAssertRead(expected)
        ], waterfallFinalize(done));
    });

    it(`${PUT} /:id should result in the url of the updated item`, done => {
        const expected = {givenname: 'foo', familyname: 'bar'};

        async.waterfall([
            waterfallAssertCreate({givenname: 'baz', familyname: 'quux'}),
            waterfallAssertUpdate(expected),
            waterfallAssertRead(expected)
        ], waterfallFinalize(done));
    });

    it(`${DELETE} /:id should result in a success message stating the deleted items id`, done => {
        const expected = {givenname: 'foo', familyname: 'bar'};

        async.waterfall([
            waterfallAssertCreate(expected),
            waterfallAssertRead(expected),
            waterfallAssertDelete()
        ], waterfallFinalize(done));
    });
});