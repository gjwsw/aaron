'use strict';

export function define(db) {
    return db.define('person', {
        givenname: String,
        familyname: String,
        sex: ['male', 'female'],
        age: Number,
        photo: Buffer
    });
}