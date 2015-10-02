'use strict';

import * as orm from 'orm';

import {define as person} from './services/person/model';

/**
 * creates the connection string that will be used by
 * orm to establish the connection to the database
 *
 * @return {string} the connection string, e.g. sqlite://database.sqlite
 * or {mysql,postgres,...}://user:password@host/database
 */
function getConnectionString() {
    const host = process.env.npm_package_config_db_host || 'localhost';
    const name = process.env.npm_package_config_db_name || 'aaron';
    const user = process.env.npm_package_config_db_user || 'root';
    const password = process.env.npm_package_config_db_pass || 'password';
    const protocol = process.env.npm_package_config_db_protocol || 'sqlite';
    const storage = process.env.npm_package_config_db_storage || './.database.sqlite';

    if (protocol === 'sqlite') {
        return `${protocol}://${storage}`;
    } else {
        return `${protocol}://${user}:${password}@${host}/${name}`;
    }
}

export function db(connection = getConnectionString()) {
    return orm.express(connection, {
        define: (db, models, next) => {
            models.person = person(db);
            db.sync(err => {
                if (!err) {
                    next();
                }
            });
        }
    });
}