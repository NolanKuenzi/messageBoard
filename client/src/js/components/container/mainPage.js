import React, { useState } from 'react';
import Header from '../presentational/header';
import ApiTests from './apitests';
import UserStories from '../presentational/userStories';

const MainPage = () => {
  const [usrStories, setUsrStories] = useState(false);
  const [apiTests, setApiTests] = useState(true);
  const usToggle = () => {
    if (usrStories === false) {
      setUsrStories(true);
      return;
    }
    setUsrStories(false);
  };
  const apiTestsToggle = () => {
    if (apiTests === false) {
      setApiTests(true);
      return;
    }
    setApiTests(false);
  };
  return (
    <div>
      <Header />
      <div id="usrStoriesToggle" onClick={() => usToggle()}>
        User Stories: <span id="usDivSpan">{usrStories === false ? '▼' : '▲'}</span>
      </div>
      <div id="usrStoriesDiv">{usrStories === false ? null : <UserStories />}</div>
      <br />
      <div id="apiTestsToggle" onClick={() => apiTestsToggle()}>
        Api Tests: <span id="usDivSpan">{apiTests === false ? '▼' : '▲'}</span>
      </div>
      <div id="apiTestsDiv">{apiTests === false ? null : <ApiTests />}</div>
    </div>
  );
};

export default MainPage;
