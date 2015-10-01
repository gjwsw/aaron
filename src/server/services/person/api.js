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
               res.json(result);
           }
       });
   })
   .post((req, res) => {
       console.log(Object.keys(req));
       req.models.person.create(req.body, (err, result) => {
           if (err) {
               res.status(400)
                  .json(err);
           } else {
               res.json(result);
           }
       });
   });