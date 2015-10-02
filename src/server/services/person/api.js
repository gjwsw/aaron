'use strict';

import {Router} from 'express';

export const router = new Router();

router.route('/')
      .get((req, res) => {
          req.models.person.find((err, result) => {
              if (err) {
                  res.status(500)
                     .json(err);
              } else {
                  res.json(result.map(person => `${req.baseUrl}/${person.id}`));
              }
          });
      })
      .post((req, res) => {
          req.models.person.create(req.body, (err, result) => {
              if (err) {
                  res.status(400)
                     .json(err);
              } else {
                  res.json(`${req.baseUrl}/${result.id}`);
              }
          });
      })
      .delete((req, res) => {
          req.models.person.count({}, (err, n) => {
              req.models.person.find().remove(err => {
                  if (err) {
                      res.status(500)
                         .json(err);
                  } else {
                      res.json(`successfully deleted ${n} person${n === 1 ? '' : 's'}`);
                  }
              });
          });
      });

router.route('/:id')
      .get((req, res) => {
          req.models.person.get(req.params.id, (err, result) => {
              if (err) {
                  res.status(400)
                     .json(err);
              } else {
                  res.json(result);
              }
          });
      });