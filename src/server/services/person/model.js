'use strict';

export function define(db) {
    return db.define('person', {
        givenname: {
            type: 'text'
        },
        familyname: {
            type: 'text'
        },
        birthdate: {
            type: 'date'
        },
        sex: {
            type: 'enum',
            values: ['male', 'female']
        },
        photo: Buffer
    }, {
        methods: {
            /**
             * from http://stackoverflow.com/a/7091965/1168892
             *
             * @return {number} the age of the person as of the moment the method was called
             */
            age: function() {
                var now = new Date()
                  , age = now.getFullYear() - this.birthdate.getFullYear()
                  , months = now.getMonth() - this.birthdate.getMonth();

                if (months < 0 || (months === 0 && now.getDate() < this.birthdate.getDate())) {
                    return age - 1;
                } else {
                    return age;
                }
            }
        }
    });
}