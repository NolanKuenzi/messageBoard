const mysql = require('mysql2/promise');
require('dotenv').config();
const moment = require('moment');
const pool = mysql.createPool(process.env.DB);

function idGenerator() {
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
  const randFunc = () => possibleChars[Math.floor(Math.random() * 62)]; 
  const idString = [];
  while (idString.length < 25) {
    idString.push(randFunc());
  }
  return idString.join('');
};
function PostHandler() {
  this.addTable = function(tableName) {
    return pool.query(`CREATE TABLE ${tableName} (_id VARCHAR(26), ThreadId VARCHAR(26), Type VARCHAR(8), Text VARCHAR(1000), Reported BOOL, Pass VARCHAR(150), CreatedOn DATETIME(0), BumpedOn DATETIME(0))`)
    .then(dta => 'success')
    .catch(err => err);
  };
  this.addEntry = function(req, res, type, text, pass) {
    const identifier = idGenerator();
    const newDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
      if (type === 'Thread') {
        pool.query(`INSERT INTO ${req.params.board} (_id, ThreadId, Type, Text, Reported, Pass, CreatedOn, BumpedOn) VALUES ('${type === 'Thread' ? identifier : idGenerator()}', '${type === 'Thread' ? identifier : req.body.threadId}', '${type}', '${text}', '${0}', '${pass}', '${newDate}', '${newDate}')`)
        .then(dta => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err}));
      } else {
        pool.query(`INSERT INTO ${req.params.board} (_id, ThreadId, Type, Text, Reported, Pass, CreatedOn) VALUES ('${type === 'Thread' ? identifier : idGenerator()}', '${type === 'Thread' ? identifier : req.body.threadId}', '${type}', '${text}', '${0}', '${pass}', '${newDate}')`)
        .then(dta => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err}));
      }
  };
  this.getTableDta = function(res, tableName) {
    pool.query(`SELECT _id, ThreadId, Type, Text, CreatedOn, BumpedOn FROM ${tableName} WHERE Type='Thread' ORDER BY BumpedOn DESC LIMIT 10`)
    .then(dta => {
      pool.query(`SELECT _id, ThreadId, Type, Text, CreatedOn FROM ${tableName} WHERE Type='Reply' ORDER BY CreatedOn ASC`)
      .then(dta2 => {
        const cpyDta = dta[0].slice(0).concat(dta2[0].slice(0));
        let threads = [];
        const replies = [];
        const arrayDta = function(tableDta) {
          if (tableDta.length === 0) {
            return;
          }
          if (tableDta[0].Type === 'Thread') {
            threads.push(tableDta[0]);
            threads[threads.length-1].Replies = [];
          } else {
            replies.push(tableDta[0]);
          }
          arrayDta(tableDta.slice(1));
        };
        arrayDta(cpyDta.slice(0));
        const addReplies = function(rplys) {
          if (rplys.length === 0) {
            return;
          }
          for (let i = 0; i < threads.length; i++) {
            if (rplys[0].ThreadId === threads[i].ThreadId) {
              threads[i].Replies.push(rplys[0]);
            }
          }
          addReplies(rplys.slice(1));
        };
        addReplies(replies.slice(0));
        threads.map(item => item.TotalReplies = item.Replies.length);
        threads.map(item => item.Replies = item.Replies.slice(0, 3));
        res.status(200).json({data: threads.slice(0)});
      }).catch(err => res.status(500).json({error: err}))
    }).catch(err => res.status(500).json({error: err}));
  };
  this.updateBumped = function(tableName, iden) {
    const newDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    return pool.query(`UPDATE ${tableName} SET BumpedOn='${newDate}' WHERE _id='${iden}'`)
    .then(rtrn => 'success') 
    .catch(err => err);
  };
  this.updateReported = function(tableName, threadId, iden, type) {
    return pool.query(`SELECT ThreadId FROM ${tableName} WHERE ThreadId='${threadId}'`)
    .then(rpse0 => {
      if (rpse0[0].length === 0) {
        throw 'Thread not found'
      }
      return pool.query(`SELECT _id FROM ${tableName} WHERE _id='${iden}'`)
      .then(rpse1 => {
        if (rpse1[0].length === 0) {
          throw 'Reported _id not found';
        }
        return pool.query(`UPDATE ${tableName} SET Reported='${1}' WHERE ThreadId='${threadId}' AND _id='${iden}' AND Type='${type === 'Thread' ? 'Thread' : 'Reply'}'`)
        .then(rpse2 => {
          if (rpse2[0].info.includes('Rows matched: 1') !== true) {
            throw 'Reported id does not match thread id';
          }
          return 'Reported';
        }).catch(err => err);
      }).catch(err => err);
    }).catch(err => err);
  };
  this.deleteEntry = function(tableName, threadId, iden, type, pwd) {
    return pool.query(`SELECT Pass, Type FROM ${tableName} WHERE ThreadId='${threadId}'`)
    .then(dta => {
      if (dta[0].length === 0) {
        throw 'Thread Id not found';
      }
      return pool.query(`SELECT Pass, Type FROM ${tableName} WHERE _id='${iden}'`)
      .then(dta => {
        if (dta[0].length === 0) {
          throw 'Reply Id not found';
        }
        if (dta[0][0].Pass !== pwd) {
          throw 'Incorrect password for given id';
        }
        if (type === 'Thread') {
          return pool.query(`DELETE FROM ${tableName} WHERE ThreadId='${threadId}'`)
          .then(response => {
            return 'Success';
          }).catch(err => err);
        } else {
          return pool.query(`DELETE FROM ${tableName} WHERE ThreadId='${threadId}' AND _id='${iden}' And Type='Reply'`)
          .then(response => {
            if (response[0].affectedRows === 0) {
              throw 'Reported id does not match thread id';
            }
            return 'Success';
          }).catch(err => err);
        }
      }).catch(err => err)
    }).catch(err => {
      if (err.code !== undefined && err.code === 'ER_NO_SUCH_TABLE') {
        return 'Board not found'
      } else {
        return err;
      }
    });
  };
  this.getThreadDta = function(res, tableName, ThrdIden) {
    pool.query(`SELECT _id, ThreadId, Type, Text, CreatedOn, BumpedOn FROM ${tableName} WHERE ThreadId='${ThrdIden}' AND Type='Thread'`)
    .then(res0 => {
      if (res0[0].length === 0) {
        res.status(200).json({data: []});
        return;
      }
      pool.query(`SELECT _id, ThreadId, Type, Text, CreatedOn FROM ${tableName} WHERE ThreadId='${ThrdIden}' AND Type='Reply' ORDER BY CreatedOn ASC`)
      .then(res1 => {
        const copyDta = res0[0].slice(0);
        copyDta[0].replies = [];
        copyDta[0].board = tableName;
        for (let i = 0; i < res1[0].length; i++) {
          copyDta[0].replies.push(res1[0][i]);
        }
        res.status(200).json({data: copyDta});
      }).catch(err => res.status(500).json({error: err}))
    }).catch(err => {
      if (err === 'Thread not found') {
        res.status(404).json({error: err});
        return;
      }
    });
  };
};
module.exports = PostHandler;