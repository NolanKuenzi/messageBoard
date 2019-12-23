import React, { useState, useEffect } from 'react';
import axios from 'axios';
import regeneratorRuntime, { async } from 'regenerator-runtime';

const Thread = () => {
  const threadUrl = window.location.pathname.replace(/\/b\//g, '');
  const [threadDta, setThreadDta] = useState([]);
  const [boardName, setBoardName] = useState('');
  const getThreadInfo = async () => {
    try {
      const request = await axios.get(`http://localhost:3000/api/replies/${threadUrl}`);
      setThreadDta(request.data.data.slice(0));
      if (request.data.data.length !== 0) {
        setBoardName(request.data.data[0].board);
      }
    } catch (error) {
      if (error.response !== undefined && error.response.data.error !== undefined) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert(error);
      }
    }
  };
  const reportThread = async (e, id) => {
    e.preventDefault();
    try {
      const request = await axios.put(`http://localhost:3000/api/threads/${boardName}`, {
        id,
      });
      alert(request.data.msg);
    } catch (error) {
      if (error.response !== undefined && error.response.data.error !== undefined) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert(error);
      }
    }
  };
  const deleteThread = async (e, id) => {
    e.preventDefault();
    if (e.target.thrdDelInput.value === '') {
      alert('Please complete required fields');
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/api/threads/${boardName}`, {
        data: {
          id,
          pass: e.target.thrdDelInput.value,
        },
      });
      getThreadInfo();
    } catch (error) {
      if (error.response !== undefined && error.response.data.error !== undefined) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert(error);
      }
    }
  };
  const reportReply = async (e, thrdId, rplyId) => {
    e.preventDefault();
    try {
      const request = await axios.put(`http://localhost:3000/api/replies/${boardName}`, {
        threadId: thrdId,
        reportId: rplyId,
      });
      alert(request.data.msg);
    } catch (error) {
      if (error.response !== undefined && error.response.data.error !== undefined) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert(error);
      }
    }
  };
  const deleteReply = async (e, thrdId, rplyId) => {
    e.preventDefault();
    if (e.target.rplyDelInput.value === '') {
      alert('Please complete required fields');
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/api/replies/${boardName}`, {
        data: {
          threadId: thrdId,
          replyId: rplyId,
          pass: e.target.rplyDelInput.value,
        },
      });
      getThreadInfo();
    } catch (error) {
      if (error.response !== undefined && error.response.data.error !== undefined) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert(error);
      }
    }
  };
  const submitReply = async (e, id) => {
    e.preventDefault();
    e.persist();
    if (e.target.subReplyTxt.value === '' || e.target.subReplyPass.value === '') {
      alert('Please complete required fields');
      return;
    }
    try {
      await axios.post(`http://localhost:3000/api/replies/${boardName}`, {
        threadId: id,
        text: e.target.subReplyTxt.value,
        pass: e.target.subReplyPass.value,
      });
      const selectForm = document.getElementsByName(e.target.name);
      selectForm[0].reset();
      getThreadInfo();
    } catch (error) {
      if (error.response !== undefined && error.response.data.error !== undefined) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert(error);
      }
    }
  };
  useEffect(() => {
    getThreadInfo();
  }, []); /* eslint-disable-line */
  return (
    <div>
      <h1>{`/b/${threadUrl}`}</h1>
      <div id="threadDiv">
        {threadDta.length === 0 ? null : (
          <div id="threadBody">
            <div id="threadData">
              <span className="idSpan">
                Id: {threadDta[0]._id} ({threadDta[0].BumpedOn})
              </span>
              <form id="threadForm" onSubmit={e => deleteThread(e, threadDta[0]._id)}>
                <button type="button" onClick={e => reportThread(e, threadDta[0]._id)}>
                  Report
                </button>
                <br />
                <span>
                  <input type="text" name="thrdDelInput" placeholder="password"></input>
                  <button type="submit">Delete</button>
                </span>
              </form>
              <span>{threadDta[0].Text}</span>
            </div>
            <div id="repliesData">
              {threadDta[0].replies.length === 0 ? null : (
                <ul>
                  {threadDta[0].replies.map(item => (
                    <li key={item._id}>
                      <span className="idSpan">
                        Id: {item._id} ({item.CreatedOn})
                      </span>
                      <form onSubmit={e => deleteReply(e, threadDta[0]._id, item._id)}>
                        <button
                          type="button"
                          onClick={e => reportReply(e, threadDta[0]._id, item._id)}
                        >
                          Report
                        </button>
                        <br />
                        <span>
                          <input type="text" name="rplyDelInput" placeholder="password"></input>
                          <button type="submit">Delete</button>
                        </span>
                      </form>
                      <span>{item.Text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div id="quickReplyData">
              <form name="newRplyForm" onSubmit={e => submitReply(e, threadDta[0]._id)}>
                <textarea name="subReplyTxt" placeholder="Quick reply..."></textarea>
                <br />
                <span>
                  <input name="subReplyPass" placeholder="Password to delete"></input>
                  <button type="submit">Submit</button>
                </span>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Thread;
