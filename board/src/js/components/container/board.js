import React from 'react';

const Board = () => {
  const boardName = 'apitest';
  //  const boardName = window.location.pathname.replace(/\/b\//g, '');
  return (
    <div>
      <h2>
        <b>Welcome to /b/{boardName}/</b>
      </h2>
      <div id="boardSection">
        <span id="boardSecHeader">
          <b>Submit a new thread:</b>
        </span>
        <form>
          <textarea type="text" id="submitTxtArea" placeholder="Thread text..." />
          <br />
          <input type="text" placeholder="password to delete" />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Board;
