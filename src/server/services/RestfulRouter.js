'use strict';

import {Router} from 'express';

export class RestfulRouter {
    constructor(model) {
        this.model = model;

        this.bulkOperations = {
            get: (req, res) => this.query(req, res),
            post: (req, res) => this.create(req, res),
            delete: (req, res) => this.drop(req, res)
        };

        this.instanceOperations = {
            get: (req, res) => this.read(req, res),
            put: (req, res) => this.update(req, res),
            delete: (req, res) => this.remove(req, res)
        };

        this.middleware = [];
    }

    query(req, res) {
        req.models[this.model].find((err, result) => {
            if (err) {
                res.status(500)
                   .json(err);
            } else {
                res.json(result.map(item => `${req.baseUrl}/${item.id}`));
            }
        });
    }

    drop(req, res) {
        req.models[this.model].count({}, (err, n) => {
            req.models[this.model].find().remove(err => {
                if (err) {
                    res.status(500)
                       .json(err);
                } else {
                    res.json(`successfully deleted ${n} ${this.model}${n === 1 ? '' : 's'}`);
                }
            });
        });
    }

    create(req, res) {
        req.models[this.model].create(req.body, (err, result) => {
            if (err) {
                res.status(400)
                   .json(err);
            } else {
                res.json(`${req.baseUrl}/${result.id}`);
            }
        });
    }

    read(req, res) {
        req.models[this.model].get(req.params.id, (err, result) => {
            if (err) {
                res.status(400)
                   .json(err);
            } else {
                res.json(result);
            }
        });
    }

    update(req, res) {
        req.models[this.model].get(req.params.id, (err, item) => {
            if (err) {
                res.status(400)
                   .json(err);
            } else {
                item.save(req.body, err => {
                    if (err) {
                        res.status(500)
                        .json(err);
                    } else {
                        res.json(`${req.baseUrl}/${req.params.id}`);
                    }
                });
            }
        });
    }

    remove(req, res) {
        req.models[this.model].find({id: req.params.id}).remove(err => {
            if (err) {
                res.status(500)
                   .json(err);
            } else {
                res.json(`successfully deleted ${this.model} ${req.params.id}`);
            }
        });
    }

    register(operations, route) {
        Object.keys(operations).reduce((route, method) => {
            route[method](operations[method]);
            return route;
        }, route);
    }

    build() {
        const router = new Router();

        this.register(this.bulkOperations, router.route('/'));
        this.register(this.instanceOperations, router.route('/:id'));

        return router;
    }
}