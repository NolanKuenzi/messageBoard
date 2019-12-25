import React, { useState, useEffect } from 'react';
import axios from 'axios';
import regeneratorRuntime, { async } from 'regenerator-runtime';

const Board = () => {
  const boardName = window.location.pathname.replace(/\/b\//g, '');
  const [threadInfo, setThreadInfo] = useState([]);
  const [subThreadTxtArea, setSubThreadTxtArea] = useState('');
  const [subThreadPass, setSubThreadPass] = useState('');
  const getBoardInfo = async () => {
    try {
      const request = await axios.get(
        `https://shielded-coast-12579.herokuapp.com/api/threads/${boardName}`
      );
      setThreadInfo(request.data.data.slice(0));
    } catch (error) {
      if (error.response !== undefined && error.response.data.error !== undefined) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert(error);
      }
    }
  };
  const submitThread = async e => {
    e.preventDefault();
    if (subThreadTxtArea === '' || subThreadPass === '') {
      alert('Please complete required fields');
      return;
    }
    try {
      await axios.post(`https://shielded-coast-12579.herokuapp.com/api/threads/${boardName}`, {
        text: subThreadTxtArea,
        pass: subThreadPass,
      });
      setSubThreadTxtArea('');
      setSubThreadPass('');
      getBoardInfo();
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
      const request = await axios.put(
        `https://shielded-coast-12579.herokuapp.com/api/threads/${boardName}`,
        {
          id,
        }
      );
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
      await axios.delete(`https://shielded-coast-12579.herokuapp.com/api/threads/${boardName}`, {
        data: {
          id,
          pass: e.target.thrdDelInput.value,
        },
      });
      getBoardInfo();
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
      const request = await axios.put(
        `https://shielded-coast-12579.herokuapp.com/api/replies/${boardName}`,
        {
          threadId: thrdId,
          reportId: rplyId,
        }
      );
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
      await axios.delete(`https://shielded-coast-12579.herokuapp.com/api/replies/${boardName}`, {
        data: {
          threadId: thrdId,
          replyId: rplyId,
          pass: e.target.rplyDelInput.value,
        },
      });
      getBoardInfo();
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
      await axios.post(`https://shielded-coast-12579.herokuapp.com/api/replies/${boardName}`, {
        threadId: id,
        text: e.target.subReplyTxt.value,
        pass: e.target.subReplyPass.value,
      });
      const selectForm = document.getElementsByName(e.target.name);
      selectForm[0].reset();
      getBoardInfo();
    } catch (error) {
      if (error.response !== undefined && error.response.data.error !== undefined) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert(error);
      }
    }
  };
  useEffect(() => {
    getBoardInfo();
  }, []); /* eslint-disable-line */
  return (
    <div id="boardDiv">
      <h2>
        <b>Welcome to /b/{boardName}/</b>
      </h2>
      <div id="newThread">
        <span id="boardSecHeader">
          <b>Submit a new thread:</b>
        </span>
        <form onSubmit={e => submitThread(e)}>
          <textarea
            type="text"
            id="submitTxtArea"
            placeholder="Thread text..."
            value={subThreadTxtArea}
            onChange={e => setSubThreadTxtArea(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="password to delete"
            value={subThreadPass}
            onChange={e => setSubThreadPass(e.target.value)}
          />
          <br />
          <button type="submit" id="submitBtn0">
            Submit
          </button>
        </form>
      </div>
      <div>
        {threadInfo.length === 0 ? null : (
          <ul>
            {threadInfo.map((item, index) => (
              <li key={item._id} className="threadsLi">
                <div className="threadsTopDiv">
                  <span className="idSpan">
                    Id: {item._id} ({item.BumpedOn})
                  </span>
                  <br />
                  <form onSubmit={e => deleteThread(e, item._id)}>
                    <button type="button" onClick={e => reportThread(e, item._id)}>
                      Report
                    </button>
                    <br />
                    <span>
                      <input
                        type="text"
                        name="thrdDelInput"
                        className="topFormInput"
                        placeholder="password"
                      />
                      <button type="submit">Delete</button>
                    </span>
                  </form>
                  <span className="TextSpan">{item.Text}</span>
                </div>
                <div className="repliesDiv">
                  <div className="threadDivLink">
                    {item.TotalReplies} replies total (
                    {item.TotalReplies < 3 ? 0 : item.TotalReplies - 3} hidden)-{' '}
                    <a
                      href={`https://shielded-coast-12579.herokuapp.com/b/${boardName}/${item._id}`}
                    >
                      See the full thread here.
                    </a>
                  </div>
                  {item.Replies.length === 0 ? null : (
                    <ul>
                      {item.Replies.map(reply => (
                        <li className="replyLi" key={reply._id}>
                          <span className="idSpan">
                            Id: {reply._id} ({reply.CreatedOn})
                          </span>
                          <form onSubmit={e => deleteReply(e, item._id, reply._id)}>
                            <button
                              type="button"
                              onClick={e => reportReply(e, item._id, reply._id)}
                            >
                              Report
                            </button>
                            <br />
                            <span>
                              <input
                                type="text"
                                name="rplyDelInput"
                                className="replyLiInput"
                                placeholder="password"
                              />
                              <button type="submit">Delete</button>
                            </span>
                          </form>
                          <span className="TextSpan">{reply.Text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="submitReplyDiv">
                  <form
                    name={`newRplyForm${index.toString()}`}
                    className="threadForm1"
                    onSubmit={e => submitReply(e, item._id)}
                  >
                    <textarea
                      name="subReplyTxt"
                      className="threadForm1TxtArea"
                      placeholder="Quick reply..."
                    />
                    <br />
                    <span>
                      <input
                        type="text"
                        name="subReplyPass"
                        placeholder="password to delete"
                      ></input>
                      <button type="submit">Submit</button>
                    </span>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default Board;
