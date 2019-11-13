/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
// require('dotenv').config(); - install if needed
const { param, body, sanitizeParam, sanitizeBody, validationResult } = require('express-validator');
const mysql = require('mysql');

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .get([
      
    ], function(req, res) {})
    .post([
      sanitizeParam(), 
      body('threadText')
        .trim()
        .isLength({max: 560}).withMessage('Thread text character limit of 560 has been exceeded'),
      sanitizeBody('threadText')
        .escape(),
      body('delPass')
        .trim()
        .isLength({max: 100}).withMessage('Thread password character limit of 100 has been exceeded'),
      sanitizeBody('delPass')
        .escape(),
    ], function(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({err: errors.array()[0].msg});
        return;
      }
      const connection = mysql.createConnection({
        host: 'localhost',
        user: 'db_admin',
        password: 'wd72ln7fj',
        database: 'message_board_db'
      })
      connection.connect(function(err) {
        if (err) {
          console.log(err);
          console.log('hhheeyyoo');
          //return;
        } else {
          console.log('nad willams');
        }
        console.log('suupersz');
      })
      /*
      connection.query('SHOW TABLES', function (err, rows, fields) {
        if (err) {
          console.log('ERROR');
          console.log(err);
          return;
        }
        console.log('success');
       // console.log(rows);
       // console.log(fields);
      }) */
      connection.end()
    })
    .put([

    ], function(req, res) {

    })
    .delete([

    ], function() {

    })
  //app.route('/api/replies/:board');
};
