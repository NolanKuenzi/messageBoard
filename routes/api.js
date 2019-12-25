//Complete the API routing below
'use strict';

const { param, body, sanitizeParam, sanitizeBody, validationResult } = require('express-validator');
const mysql = require('mysql2/promise');
require('dotenv').config();
const PostHandler = require('../controllers/postHandler');
const pool = mysql.createPool(process.env.DB);

module.exports = function (app) {
   
  app.route('/api/threads/:board')
    .get([
      param('board')
        .trim()
        .isLength({max: 50}).withMessage('Board character limit of 50 has been exceeded')
        .custom(function(pm, paramObj) {
          paramObj.req.params.board = paramObj.req.params.board.replace(/\s/g, '');
          paramObj.req.params.board = escape(paramObj.req.params.board);
          return true;
        }),
    ], function(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({error: errors.array()[0].msg});
        return;
      }
      pool.query('SHOW TABLES')
      .then(dta => {
        const postHandler = new PostHandler();
        for (let i = 0; i < dta[0].length; i++) {
          if (dta[0][i].Tables_in_heroku_86c840b95eb22c2 === req.params.board) {
            return postHandler.getTableDta(res, req.params.board);
          }
        }
        res.status(200).json({data: []});
      }).catch(err => res.status(500).json({error: err}));
    })
    .post([
      param('board')
        .trim()
        .isLength({max: 50}).withMessage('Board character limit of 50 has been exceeded')
        .custom(function(pm, paramObj) {
          paramObj.req.params.board = paramObj.req.params.board.replace(/\s/g, '');
          paramObj.req.params.board = escape(paramObj.req.params.board);
          return true;
        }),
      sanitizeParam('board')
        .escape(),
      body('text')
        .trim()
        .isLength({max: 560}).withMessage('Thread text character limit of 560 has been exceeded'),
      sanitizeBody('text')
        .escape(),
      body('pass')
        .trim()
        .isLength({max: 50}).withMessage('Thread password character limit of 50 has been exceeded'),
      sanitizeBody('pass')
        .escape(),
    ], function(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({error: errors.array()[0].msg});
        return;
      }
    pool.query('SHOW TABLES')
      .then(dta => {
        const postHandler = new PostHandler();
        for (let i = 0; i < dta[0].length; i++) {
          if (req.params.board === dta[0][i].Tables_in_heroku_86c840b95eb22c2) {
            return postHandler.addEntry(req, res, 'Thread', req.body.text, req.body.pass);
          }
        }
        return new Promise(resolve => {
          resolve(postHandler.addTable(req.params.board));
        }).then(response => {
          if (response !== 'success') {
            throw response;
          }
          return postHandler.addEntry(req, res, 'Thread', req.body.text, req.body.pass);
        }).catch(err => res.status(500).json({error: err}));
      }).catch(err => {
        if (err === 'Board already exists') {
          res.status(400).json({error: err});
          return;
        }
        res.status(500).json({error: err});
      })
    })
    .put([
      param('board')
        .trim()
        .isLength({max: 50}).withMessage('Board character limit of 50 has been exceeded')
        .custom(function(pm, paramObj) {
          paramObj.req.params.board = paramObj.req.params.board.replace(/\s/g, '');
          paramObj.req.params.board = escape(paramObj.req.params.board);
          return true;
        }),
      sanitizeParam('board')
        .escape(),
      body('id')
        .trim()
        .isLength({max: 30}).withMessage('Thread _id character limit of 30 has been exceeded'),
      sanitizeBody('id')
        .escape(),
    ], function(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({error: errors.array()[0].msg});
        return;
      }
      const postHandler = new PostHandler();
      return new Promise(resolve => {
        resolve(postHandler.updateReported(req.params.board, req.body.id, req.body.id, 'Thread'));
      }).then(response => {
        if (response !== 'Reported') {
          throw response;
        }
        res.status(200).json({msg: response});
      }).catch(err => {
        if (err.code !== undefined && err.code === 'ER_NO_SUCH_TABLE') {
          res.status(404).json({error: 'Board not found'});
          return;
        }
        if (err === 'Thread not found') {
          res.status(404).json({error: err});
          return;          
        }
        res.status(500).json({error: err});
      })
    })
    .delete([
      param('board')
        .trim()
        .isLength({max: 50}).withMessage('Board character limit of 50 has been exceeded')
        .custom(function(pm, paramObj) {
          paramObj.req.params.board = paramObj.req.params.board.replace(/\s/g, '');
          paramObj.req.params.board = escape(paramObj.req.params.board);
          return true;
        }),
      sanitizeParam('board')
        .escape(),
      body('id')
        .trim()
        .isLength({max: 30}).withMessage('Thread _id character limit of 30 has been exceeded'),
      sanitizeBody('id')
        .escape(),
      body('pass')
        .trim()
        .isLength({max: 50}).withMessage('Thread password character limit of 50 has been exceeded'),
      sanitizeBody('pass')
        .escape(),
    ], function(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({error: errors.array()[0].msg});
        return;
      }
      const postHandler = new PostHandler();
      return new Promise(resolve => {
        resolve(postHandler.deleteEntry(req.params.board, req.body.id, req.body.id, 'Thread', req.body.pass));
      }).then(response => {
        if (response !== 'Success') {
          throw response;
        }
        res.status(200).json({msg: response});
      }).catch(err => {
        if (err === 'Board not found' || err === 'Thread Id not found') {
          res.status(404).json({error: err});
          return;
        }
        if (err === 'Incorrect password for given id') {
          res.status(400).json({error: err});
          return;
        }
        res.status(500).json({error: err});
      })
    })
  app.route('/api/replies/:board/:threadid')
    .get([
      param('board')
        .trim()
        .isLength({max: 50}).withMessage('Board character limit of 50 has been exceeded')
        .custom(function(pm, paramObj) {
          paramObj.req.params.board = paramObj.req.params.board.replace(/\s/g, '');
          paramObj.req.params.board = escape(paramObj.req.params.board);
          return true;
        }),
      param('threadid')
        .trim()
        .isLength({max: 30}).withMessage('Thread Id character limit of 30 has been exceeded')
        .custom(function(pm, paramObj) {
          paramObj.req.params.threadid = paramObj.req.params.threadid.replace(/\s/g, '');
          paramObj.req.params.threadid = escape(paramObj.req.params.threadid);
          return true;
        }),
    ], function(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({error: errors.array()[0].msg});
        return;
      }
      const postHandler = new PostHandler();
      return postHandler.getThreadDta(res, req.params.board, req.params.threadid)
    })
  app.route('/api/replies/:board/')
    .post([
      param('board')
        .trim()
        .isLength({max: 50}).withMessage('Board character limit of 50 has been exceeded')
        .custom(function(pm, paramObj) {
          paramObj.req.params.board = paramObj.req.params.board.replace(/\s/g, '');
          paramObj.req.params.board = escape(paramObj.req.params.board);
          return true;
        }),
      sanitizeParam('board')
        .escape(),
      body('threadId')
      .trim()
      .isLength({max: 30}).withMessage('Thread _id character limit of 30 has been exceeded'),
      sanitizeBody('threadId')
        .escape(),
      body('text')
        .trim()
        .isLength({max: 280}).withMessage('Reply text character limit of 280 has been exceeded'),
      sanitizeBody('text')
        .escape(),
      body('pass')
        .trim()
        .isLength({max: 50}).withMessage('Reply password character limit of 50 has been exceeded'),
      sanitizeBody('pass')
        .escape(),
    ], function(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({error: errors.array()[0].msg});
        return;
      }
      pool.query(`SELECT ThreadId FROM ${req.params.board}`)
      .then(dta => {
        const postHandler = new PostHandler();
        let testDta = dta[0].slice(0);
        testDta = testDta.filter(item => item.ThreadId === req.body.threadId);
        if (testDta.length === 0) {
          throw 'Thread Id not found';
        }
        return new Promise(resolve => {
          resolve(postHandler.updateBumped(req.params.board, req.body.threadId));
        }).then(response => {
          if (response !== 'success') {
            throw response;
          }
          return postHandler.addEntry(req, res, 'Reply', req.body.text, req.body.pass);
        }).catch(err => res.status(500).json({error: err}));
      }).catch(err => {
        if (err.code !== undefined && err.code === 'ER_NO_SUCH_TABLE') {
          res.status(404).json({error: 'Board not found'});
          return;
        }
        if (err === 'Thread Id not found') {
          res.status(404).json({error: err});
          return;
        }
        res.status(500).json({error: err});
      })
    })
    .put([
      param('board')
        .trim()
        .isLength({max: 50}).withMessage('Board character limit of 50 has been exceeded')
        .custom(function(pm, paramObj) {
          paramObj.req.params.board = paramObj.req.params.board.replace(/\s/g, '');
          paramObj.req.params.board = escape(paramObj.req.params.board);
          return true;
        }),
      sanitizeParam('board')
        .escape(),
      body('threadId')
        .trim()
        .isLength({max: 30}).withMessage('Thread _id character limit of 30 has been exceeded'),
      sanitizeBody('threadId')
        .escape(),
      body('reportId')
        .trim()
        .isLength({max: 30}).withMessage('Reported _id character limit of 30 has been exceeded'),
      sanitizeBody('reportId')
        .escape(),
    ], function(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({error: errors.array()[0].msg});
        return;
      }
      if (req.body.threadId === req.body.reportId) {
        res.status(400).json({error: 'Thread _id cannot match reported _id'});
        return;
      }
      const postHandler = new PostHandler();
      return new Promise(resolve => {
        resolve(postHandler.updateReported(req.params.board, req.body.threadId, req.body.reportId, 'Reply'));
      }).then(response => {
        if (response !== 'Reported') {
          throw response;
        }
        res.status(200).json({msg: response});
      }).catch(err => {
      if (err.code !== undefined && err.code === 'ER_NO_SUCH_TABLE') {
        res.status(404).json({error: 'Board not found'});
        return;
      }
      if (err === 'Thread not found' || err === 'Reported _id not found') {
        res.status(404).json({error: err});
        return;          
      }
      if (err === 'Reported id does not match thread id') {
        res.status(400).json({error: err});
        return;  
      }
      res.status(500).json({error: err});
      })
    })
    .delete([
      param('board')
        .trim()
        .isLength({max: 50}).withMessage('Board character limit of 50 has been exceeded')
        .custom(function(pm, paramObj) {
          paramObj.req.params.board = paramObj.req.params.board.replace(/\s/g, '');
          paramObj.req.params.board = escape(paramObj.req.params.board);
          return true;
        }),
      sanitizeParam('board')
        .escape(),
      body('threadId')
        .trim()
        .isLength({max: 30}).withMessage('Thread _id character limit of 30 has been exceeded'),
      sanitizeBody('threadId')
        .escape(),
      body('replyId')
        .trim()
        .isLength({max: 30}).withMessage('Reply _id character limit of 30 has been exceeded'),
      sanitizeBody('replyId')
        .escape(),
      body('pass')
        .trim()
        .isLength({max: 50}).withMessage('Reply password character limit of 50 has been exceeded'),
      sanitizeBody('pass')
        .escape(),
    ], function(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({error: errors.array()[0].msg});
        return;
      }
      const postHandler = new PostHandler();
      return new Promise(resolve => {
        resolve(postHandler.deleteEntry(req.params.board, req.body.threadId, req.body.replyId, 'Reply', req.body.pass));
      }).then(response => {
        if (response !== 'Success') {
          throw response;
        }
        res.status(200).json({msg: response});
      }).catch(err => {
        if (err === 'Board not found' || err === 'Thread Id not found' || err === 'Reply Id not found') {
          res.status(404).json({error: err});
          return;
        }
        if (err === 'Incorrect password for given id' || 'Reported id does not match thread id') {
          res.status(400).json({error: err});
          return;
        }
        res.status(500).json({error: err});
      })
    })
};