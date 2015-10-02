'use strict';

import {default as express} from 'express';
import {default as bodyParser} from 'body-parser';
import {db} from '../database';

export const GET    = '   GET';
export const POST   = '  POST';
export const PUT    = '   PUT';
export const DELETE = 'DELETE';

export function testapp() {
    const app = express();

    app.use(bodyParser.json());
    app.use(db(`sqlite://${process.env.npm_package_config_test_sqlitedb || '.database-tmp.sqlite'}`));

    return app;
}