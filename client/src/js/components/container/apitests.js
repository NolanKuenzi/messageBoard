import React, { useState } from 'react';
import axios from 'axios';
import regeneratorRuntime, { async } from 'regenerator-runtime';

const ApiTests = () => {
  const [newThreadBoard, setNewThreadBoard] = useState('');
  const [newThreadText, setNewThreadText] = useState('');
  const [newThreadDelete, setNewThreadDelete] = useState('');

  const [reportThreadBoard, setReportThreadBoard] = useState('');
  const [reportThreadId, setReportThreadId] = useState('');

  const [deleteThreadBoard, setDeleteThreadBoard] = useState('');
  const [deleteThreadId, setDeleteThreadId] = useState('');
  const [deleteThreadPass, setDeleteThreadPass] = useState('');

  const [newReplyBoard, setNewReplyBoard] = useState('');
  const [newReplyId, setNewReplyId] = useState('');
  const [newReplyText, setNewReplyText] = useState('');
  const [newReplyPass, setNewReplyPass] = useState('');

  const [reportReplyBoard, setReportReplyBoard] = useState('');
  const [reportReplyThreadId, setReportReplyThreadId] = useState('');
  const [reportReplyId, setReportReplyId] = useState('');

  const [deleteReplyBoard, setDeleteReplyBoard] = useState('');
  const [deleteReplyThreadId, setDeleteReplyThreadId] = useState('');
  const [deleteReplyId, setDeleteReplyId] = useState('');
  const [deleteReplyPass, setDeleteReplyPass] = useState('');

  const newThread = e => {
    e.preventDefault();
    if (newThreadBoard === '' || newThreadText === '' || newThreadDelete === '') {
      alert('Please fill out required fields');
      return;
    }
    try {
      const req = axios.post(`http://localhost:3000/api/threads/${newThreadBoard}`, {
        threadText: newThreadText,
        delPass: newThreadDelete,
      });
      setNewThreadBoard('');
      setNewThreadText('');
      setNewThreadDelete('');
    } catch (error) {
      console.log(error);
    }
  };
  const reportThread = e => {
    e.preventDefault();
  };
  const deleteThread = e => {
    e.preventDefault();
  };
  const newReply = e => {
    e.preventDefault();
  };
  const reportReply = e => {
    e.preventDefault();
  };
  const deleteReply = e => {
    e.preventDefault();
  };

  return (
    <div>
      <div className="formDiv">
        <div className="headerDiv">
          <b>New thread (POST /api/threads/:board)</b>
        </div>
        <form onSubmit={e => newThread(e)}>
          <input
            type="text"
            value={newThreadBoard}
            onChange={e => setNewThreadBoard(e.target.value)}
            placeholder="board"
          />
          <br />
          <textarea
            type="text"
            value={newThreadText}
            onChange={e => setNewThreadText(e.target.value)}
            placeholder="Thread text..."
          />
          <br />
          <input
            type="text"
            value={newThreadDelete}
            onChange={e => setNewThreadDelete(e.target.value)}
            placeholder="password to delete"
          />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="formDiv">
        <div className="headerDiv">
          <b>Report thread (PUT /api/threads/:board)</b>
        </div>
        <form onSubmit={e => reportThread(e)}>
          <input
            type="text"
            value={reportThreadBoard}
            onChange={e => setReportThreadBoard(e.target.value)}
            placeholder="board"
          />
          <br />
          <input
            type="text"
            value={reportThreadId}
            onChange={e => setReportThreadId(e.target.value)}
            placeholder="id to report"
          />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="formDiv">
        <div className="headerDiv">
          <b>Delete thread (DELETE /api/threads/:board)</b>
        </div>
        <form onSubmit={e => deleteThread(e)}>
          <input
            type="text"
            value={deleteThreadBoard}
            onChange={e => setDeleteThreadBoard(e.target.value)}
            placeholder="board"
          />
          <br />
          <input
            type="text"
            value={deleteThreadId}
            onChange={e => setDeleteThreadId(e.target.value)}
            placeholder="id to delete"
          />
          <br />
          <input
            type="text"
            value={deleteThreadPass}
            onChange={e => setDeleteThreadPass(e.target.value)}
            placeholder="password"
          />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="formDiv">
        <div className="headerDiv">
          <b>New reply (POST /api/replies/:board)</b>
        </div>
        <form onSubmit={e => newReply(e)}>
          <input
            type="text"
            value={newReplyBoard}
            onChange={e => setNewReplyBoard(e.target.value)}
            placeholder="board"
          />
          <br />
          <input
            type="text"
            value={newReplyId}
            onChange={e => setNewReplyId(e.target.value)}
            placeholder="thread id"
          />
          <br />
          <textarea
            type="text"
            value={newReplyText}
            onChange={e => setNewReplyText(e.target.value)}
            placeholder="Thread text..."
          />
          <br />
          <input
            type="text"
            value={newReplyPass}
            onChange={e => setNewReplyPass(e.target.value)}
            placeholder="password to delete"
          />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="formDiv">
        <div className="headerDiv">
          <b>Report reply (PUT /api/replies/:board)</b>
        </div>
        <form onSubmit={e => reportReply(e)}>
          <input
            type="text"
            value={reportReplyBoard}
            onChange={e => setReportReplyBoard(e.target.value)}
            placeholder="board"
          />
          <br />
          <input
            type="text"
            value={reportReplyThreadId}
            onChange={e => setReportReplyThreadId(e.target.value)}
            placeholder="thread id"
          />
          <br />
          <input
            type="text"
            value={reportReplyId}
            onChange={e => setReportReplyId(e.target.value)}
            placeholder="id to report"
          />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="formDiv">
        <div className="headerDiv">
          <b>Delete reply (DELETE /api/replies/:board)</b>
        </div>
        <form onSubmit={e => deleteReply(e)}>
          <input
            type="text"
            value={deleteReplyBoard}
            onChange={e => setDeleteReplyBoard(e.target.value)}
            placeholder="board"
          />
          <br />
          <input
            type="text"
            value={deleteReplyThreadId}
            onChange={e => setDeleteReplyThreadId(e.target.value)}
            placeholder="thread id"
          />
          <br />
          <input
            type="text"
            value={deleteReplyId}
            onChange={e => setDeleteReplyId(e.target.value)}
            placeholder="id to delete"
          />
          <br />
          <input
            type="text"
            value={deleteReplyPass}
            onChange={e => setDeleteReplyPass(e.target.value)}
            placeholder="password"
          />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ApiTests;
