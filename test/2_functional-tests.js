/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const mysql = require('mysql2/promise');
require('dotenv').config();
const pool = mysql.createPool(process.env.DB);

chai.use(chaiHttp);

describe('Functional Tests', function() {
  this.timeout(10000);
  after(() => {
    return pool.query('DROP TABLE test_database');
  })
  let testThreadId0;
  let testThreadId1;
  let testReplyId0;
  // ^ Id's for subsequent tests
  describe('API ROUTING FOR /api/threads/:board', function() {
    // Threads POST
    it('POST', () => {
      return chai.request(server)
      .post('/api/threads/test_database')
      .send({
        text: 'testThread0',
        pass: 'testPass0',
      })
      .then(res => {
        assert.equal(res.status, 200);
      })
    })
    it('POST - param length exceeded', () => {
      return chai.request(server)
      .post('/api/threads/ddddd_aaaaaaa_ttttt_aaaaaaa_bbbbbb_aaaaaaa_ssss_eeeee')
      .send({
        text: 'testErrText0',
        pass: 'errPass0'
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Board character limit of 50 has been exceeded"}');
      })
    })
    it('POST - text length exceeded', () => {
      return chai.request(server)
      .post('/api/threads/test_database')
      .send({
        text: `testErrText1 - The River Ash is a small, shallow river in Surrey, England and its course of 10 km or 6 miles is just outside Greater London. 
        Work has been carried out to straighten, sluice control, dredge and hem in sections over centuries. 
        It flows as one of the seven present distributaries of the River Colne from just south of Staines Moor by the M25 motorway eastwards through the rest of the borough of Spelthorne before meeting the River Thames. 
        It is not navigable to craft and is rich in plant and insects, particularly where it turns eastward for the rest of its course`,
        pass: 'errPass1',
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Thread text character limit of 560 has been exceeded"}')
      })
    })
    it('POST - password length exceeded', () => {
      return chai.request(server)
      .post('/api/threads/test_database')
      .send({
        text: 'testErrText2',
        pass: 'errPass22222222222222222222222222222222222222222222',
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Thread password character limit of 50 has been exceeded"}');
      })
    })
    // Threads GET
    it('GET', () => {
      return chai.request(server)
      .get('/api/threads/test_database')
      .then(res => {
        const responseDta = JSON.parse(res.text);
        assert.equal(res.status, 200);
        assert.equal(responseDta.data[0].Type, 'Thread');
        assert.equal(responseDta.data[0].Text, 'testThread0');
        assert.equal(responseDta.data[0].ThreadId, responseDta.data[0]._id);
        testThreadId0 = responseDta.data[0].ThreadId;
        // ^ Select Thread id for subsequent tests
      })
    })
    it('GET - param length exceeded', () => {
      return chai.request(server)
      .get('/api/threads/ddddd_aaaaaaa_ttttt_aaaaaaa_bbbbbb_aaaaaaa_ssss_eeeee')
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Board character limit of 50 has been exceeded"}');
      })
    })
    // Threads DELETE
    it('DELETE - param length exceeded', () => {
      return chai.request(server)
      .delete('/api/threads/ddddd_aaaaaaa_ttttt_aaaaaaa_bbbbbb_aaaaaaa_ssss_eeeee')
      .send({
        id: testThreadId0,
        pass: 'errPass3'
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Board character limit of 50 has been exceeded"}');
      })
    });
    it('DELETE - id length exceeded', () => {
      return chai.request(server)
      .delete('/api/threads/test_database')
      .send({
        id: 'fj39fn39sk374302jd3j0wi3he89dh39ql',
        pass: 'errPass4'
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Thread _id character limit of 30 has been exceeded"}');
      })
    })
    it('DELETE - password length exceeded', () => {
      return chai.request(server)
      .delete('/api/threads/test_database')
      .send({
        id: testThreadId0,
        pass: 'errPass555555555555555555555555555555555555555555555',
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Thread password character limit of 50 has been exceeded"}');
      })
    })
    it('DELETE - Board not found', () => {
      return chai.request(server)
      .delete('/api/threads/incorrect_database')
      .send({
        id: testThreadId0,
        pass: 'errPass6',
      })
      .then(res => {
        assert.equal(res.status, 404);
        assert.equal(res.text, '{"error":"Board not found"}');
      })      
    })
    it('DELETE - Thread Id not found', () => {
      return chai.request(server)
      .delete('/api/threads/test_database')
      .send({
        id: 'fj39fn39sfdk37430i3he89d',
        pass: 'errPass7',
      })
      .then(res => {
        assert.equal(res.status, 404);
        assert.equal(res.text, '{"error":"Thread Id not found"}');
      })      
    })
    it('DELETE - Incorrect password', () => {
      return chai.request(server)
      .delete('/api/threads/test_database')
      .send({
        id: testThreadId0,
        pass: 'errPass8',
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Incorrect password for given id"}');
      })   
    })
    it('DELETE (successful)', () => {
      return chai.request(server)
      .delete('/api/threads/test_database')
      .send({
        id: testThreadId0,
        pass: 'testPass0',
      })
      .then(res => {
        const responseMsg = JSON.parse(res.text);
        assert.equal(res.status, 200);
        assert.equal(responseMsg.msg, 'Success');
      })
    })
     // ^ 2nd thread added (1st was deleted above)
    it('POST', () => {
      return chai.request(server)
      .post('/api/threads/test_database')
      .send({
        text: 'testThread1',
        pass: 'testPass1',
      })
      .then(res => {
        assert.equal(res.status, 200);
      })
    })
    it('GET', () => {
      return chai.request(server)
      .get('/api/threads/test_database')
      .then(res => {
        const responseDta = JSON.parse(res.text);
        assert.equal(res.status, 200);
        assert.equal(responseDta.data[0].Type, 'Thread');
        assert.equal(responseDta.data[0].Text, 'testThread1');
        assert.equal(responseDta.data[0].ThreadId, responseDta.data[0]._id);
        testThreadId1 = responseDta.data[0].ThreadId;
        // ^ Select Thread id for subsequent tests
      })
    })
    // Threads PUT
    it('PUT', () => {
      return chai.request(server)
      .put('/api/threads/test_database')
      .send({
        id: testThreadId1,
      })
      .then(res => {
        const responseMsg = JSON.parse(res.text);
        assert.equal(res.status, 200);
        assert.equal(responseMsg.msg, 'Reported');
      })
    })
    it('PUT - param length exceeded', () => {
      return chai.request(server)
      .put('/api/threads/ddddd_aaaaaaa_ttttt_aaaaaaa_bbbbbb_aaaaaaa_ssss_eeeee')
      .send({
        id: testThreadId1,
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Board character limit of 50 has been exceeded"}');
      })
    })
    it('PUT - id length exceeded', () => {
      return chai.request(server)
      .put('/api/threads/test_database')
      .send({
        id: 'fj39fn39sk374302jd3j0wi3he89dh39ql'
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Thread _id character limit of 30 has been exceeded"}');
      })
    })
    it('PUT - Board not found', () => {
      return chai.request(server)
      .put('/api/threads/test_wrong_database')
      .send({
        id: testThreadId1,
      })
      .then(res => {
        assert.equal(res.status, 404);
        assert.equal(res.text, '{"error":"Board not found"}');
      })
    })
    it('PUT - Thread not found', () => {
      return chai.request(server)
      .put('/api/threads/test_database')
      .send({
        id: 'fj39fn39sfdk37430i3he89d',
      })
      .then(res => {
        assert.equal(res.status, 404);
        assert.equal(res.text, '{"error":"Thread not found"}');
      })
    })
  });
  describe('API ROUTING FOR /api/replies/:board', () => {
    // Replies POST
    it('POST', () => {
      return chai.request(server)
      .post('/api/replies/test_database')
      .send({
        threadId: testThreadId1,
        text: 'testReply0',
        pass: 'testPass1',
      })
      .then(res => {
        assert.equal(res.status, 200);
      })
    })
    it('POST - Param character length exceeded', () => {
      return chai.request(server)
      .post('/api/replies/ddddd_aaaaaaa_ttttt_aaaaaaa_bbbbbb_aaaaaaa_ssss_eeeee')
      .send({
        threadId: testThreadId1,
        text: 'testErrText3',
        pass: 'errPass9',
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Board character limit of 50 has been exceeded"}');
      })
    })
    it('POST - id length exceeded', () => {
      return chai.request(server)
      .post('/api/replies/test_database')
      .send({
        threadId: '3kd93n40dncaeu947d92ld9393nf2ll',
        text: 'testErrText4',
        pass: 'errPass10',
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Thread _id character limit of 30 has been exceeded"}');
      })
    })
    it('POST - text length exceeded', () => {
      return chai.request(server)
      .post('/api/replies/test_database')
      .send({
        threadId: testThreadId1,
        text: `testErrText5 - The River Ash is a small, shallow river in Surrey, 
        England and its course of 10 km or 6 miles is just outside Greater London. 
        Work has been carried out to straighten, sluice control, dredge and hem in sections over centuries.
        It flows as one of the seven present distributaries`,
        pass: 'errPass11',
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Reply text character limit of 280 has been exceeded"}');
      })
    })
    it('POST - password length exceeded', () => {
      return chai.request(server)
      .post('/api/replies/test_database')
      .send({
        threadId: testThreadId1,
        text: 'testErrText6',
        pass: 'errPass1212121212121212121212121212121212121212121212',
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Reply password character limit of 50 has been exceeded"}');
      })
    })
    it('POST - Thread Id not found', () => {
      return chai.request(server)
      .post('/api/replies/test_database')
      .send({
        threadId: 'qVBFmzytWcSjIp3pFmVWYEwbN',
        text: 'testErrText7',
        pass: 'errPass13',
      })
      .then(res => {
        assert.equal(res.status, 404);
        assert.equal(res.text, '{"error":"Thread Id not found"}');
      })
    })
    it('POST - Board not found', () => {
      return chai.request(server)
      .post('/api/replies/non_existent_database')
      .send({
        threadId: testThreadId1,
        text: 'testErrText8',
        pass: 'errPass14',
      })
      .then(res => {
        assert.equal(res.status, 404);
        assert.equal(res.text, '{"error":"Board not found"}');
      })
    })
    // Replies GET
    it('Get', function() {
      return chai.request(server)
      .get(`/api/replies/test_database/${testThreadId1}`)
      .then(res => {
        const responseDta = JSON.parse(res.text);
        assert.equal(res.status, 200);
        testReplyId0 = responseDta.data[0].replies[0]._id;
        // ^ to be used subsequent tests
      })
    })
    it('GET - Param (board) length exceeded', () => {
      return chai.request(server)
      .get(`/api/replies/test_database_too0oooo000oooo_loooooo0000ooo0o0ooong/${testThreadId1}`)
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Board character limit of 50 has been exceeded"}');
      })
    })
    it('GET - Param (threadid) length exceeded', () => {
      return chai.request(server)
      .get('/api/replies/test_database/aVeryLongThreadIdblawblawblawblaw')
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Thread Id character limit of 30 has been exceeded"}');
      })
    })
    it('GET - Thread not found', () => {
      return chai.request(server)
      .get(`/api/replies/test_database/3dk2n34vihq10lnbgrewx290a`)
      .then(res => {
        const responseDta = JSON.parse(res.text);
        assert.equal(res.status, 200);
        assert.equal(responseDta.data.length, 0);
      })
    })
    // Replies PUT
    it('PUT', () => {
      return chai.request(server)
      .put('/api/replies/test_database')
      .send({
        threadId: testThreadId1,
        reportId: testReplyId0,
      })
      .then(res => {
        const responseMsg = JSON.parse(res.text);
        assert.equal(res.status, 200);
        assert.equal(responseMsg.msg, 'Reported');
      })
    })
    it('PUT - Param length exceeded', () => {
      return chai.request(server)
      .put('/api/replies/ddddd_aaaaaaa_ttttt_aaaaaaa_bbbbbb_aaaaaaa_ssss_eeeee')
      .send({
        threadId: testThreadId1,
        reportId: testReplyId0,
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Board character limit of 50 has been exceeded"}');
      })
    })
    it('PUT - thread id length exceeded', () => {
      return chai.request(server)
      .put('/api/replies/test_database')
      .send({
        threadId: '3ja4rme992vn2o39k34fa3k;32jv92fal',
        reportId: testReplyId0,
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Thread _id character limit of 30 has been exceeded"}');
      })
    })
    it('PUT - reported id length exceeded', () => {
      return chai.request(server)
      .put('/api/replies/test_database')
      .send({
        threadId: testThreadId1,
        reportId: '3ja4rme992vn2o39k34fa3k;32jv92fal',
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Reported _id character limit of 30 has been exceeded"}');
      })
    })
    it('PUT - Board not found', () => {
      return chai.request(server)
      .put('/api/replies/non_existent_database')
      .send({
        threadId: testThreadId1,
        reportId: testReplyId0,
      })
      .then(res => {
        assert.equal(res.status, 404);
        assert.equal(res.text, '{"error":"Board not found"}');
      })
    })
    it('PUT - Thread not found', () => {
      return chai.request(server)
      .put('/api/replies/test_database')
      .send({
        threadId: '7d8wcj22plqnvf39s1lken842',
        reportId: testReplyId0,
      })
      .then(res => {
        assert.equal(res.status, 404);
        assert.equal(res.text, '{"error":"Thread not found"}');
      })
    })
    it('PUT - Reported _id not found', () => {
      return chai.request(server)
      .put('/api/replies/test_database')
      .send({
        threadId: testThreadId1,
        reportId: '7d3cj22pk3nvf39s1lek2g4m',
      })
      .then(res => {
        assert.equal(res.status, 404);
        assert.equal(res.text, '{"error":"Reported _id not found"}');
      })
    })
    // Replies DELETE
    it('DELETE - Board character limit exceeded', () => {
      return chai.request(server)
      .delete('/api/replies/ddddd_aaaaaaa_ttttt_aaaaaaa_bbbbbb_aaaaaaa_ssss_eeeee')
      .send({
        threadId: testThreadId1,
        reportId: testReplyId0,
        pass: 'errPass15'
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Board character limit of 50 has been exceeded"}');
      })
    })
    it('DELETE - Thread _id character limit exceeded', () => {
      return chai.request(server)
      .delete('/api/replies/test_database')
      .send({
        threadId: testThreadId1.concat('2idqldnf3f8z;'),
        reportId: testReplyId0,
        pass: 'errPass16'
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Thread _id character limit of 30 has been exceeded"}');
      })
    })
    it('DELETE - Reply _id character limit exceeded', () => {
      return chai.request(server)
      .delete('/api/replies/test_database')
      .send({
        threadId: testThreadId1,
        replyId: '3k0f2dl2idqldnf3f8z;w21oznwip1fg',
        pass: 'errPass17'
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Reply _id character limit of 30 has been exceeded"}');
      })
    })
    it('DELETE - Reply password character limit exceeded', () => {
      return chai.request(server)
      .delete('/api/replies/test_database')
      .send({
        threadId: testThreadId1,
        replyId: testReplyId0,
        pass: 'errPass18888888888888888888888888888888888888888888',
      })
      .then(res => {
        assert.equal(res.status, 400);
        assert.equal(res.text, '{"error":"Reply password character limit of 50 has been exceeded"}');
      })
    })
    it('DELETE - Board not found', () => {
      return chai.request(server)
      .delete('/api/replies/non_existent_database')
      .send({
        threadId: testThreadId1,
        replyId: testReplyId0,
        pass: 'errPass19',
      })
      .then(res => {
        assert.equal(res.status, 404);
        assert.equal(res.text, '{"error":"Board not found"}');
      })
    })
    it('DELETE - Thread Id not found', () => {
      return chai.request(server)
      .delete('/api/replies/test_database')
      .send({
        threadId: 'av3c8l37hcosj1fq08fvnalg2',
        replyId: testReplyId0,
        pass: 'errPass20',
      })
      .then(res => {
        assert.equal(res.status, 404);
        assert.equal(res.text, '{"error":"Thread Id not found"}');
      })
    })
    it('DELETE - Reply Id not found', () => {
      return chai.request(server)
      .delete('/api/replies/test_database')
      .send({
        threadId: testThreadId1,
        replyId: '2d9jn94nghow4jfp1qhjwn0o2',
        pass: 'errPass21',
      })
      .then(res => {
        assert.equal(res.status, 404);
        assert.equal(res.text, '{"error":"Reply Id not found"}');
      })
    })
    it('DELETE - Success', () => {
      return chai.request(server)
      .delete('/api/replies/test_database')
      .send({
        threadId: testThreadId1,
        replyId: testReplyId0,
        pass: 'testPass1',
      })
      .then(res => {
        const responseMsg = JSON.parse(res.text);
        assert.equal(res.status, 200);
        assert.equal(responseMsg.msg, 'Success');
      })
    })
  });
});
