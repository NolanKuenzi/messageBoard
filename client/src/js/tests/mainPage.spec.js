import React from 'react';
import { render, cleanup, fireEvent, waitForDomChange, act } from '@testing-library/react';
import MainPage from '../components/container/mainPage';

afterEach(cleanup);

describe('<MainPage Component />', () => {
  test('It displays default text', () => {
    const { container } = render(<MainPage />);
    const apiTestsDiv = container.querySelector('[id="apiTestsDiv"]');
    expect(apiTestsDiv.textContent).toContain('New thread (POST /api/threads/:board)');
    expect(apiTestsDiv.textContent).toContain('Report thread (PUT /api/threads/:board)');
    expect(apiTestsDiv.textContent).toContain('Delete thread (DELETE /api/threads/:board)');
    expect(apiTestsDiv.textContent).toContain('New reply (POST /api/replies/:board)');
    expect(apiTestsDiv.textContent).toContain('Report reply (PUT /api/replies/:board)');
    expect(apiTestsDiv.textContent).toContain('Delete reply (DELETE /api/replies/:board)');
    const usrStoriesToggle = container.querySelector('[id="usrStoriesToggle"]');
    const usrStoriesDiv = container.querySelector('[id="usrStoriesDiv"]');
    expect(usrStoriesDiv.textContent).not.toContain(
      'Only allow your site to be loading in an iFrame on your own pages.'
    );
    fireEvent.click(usrStoriesToggle);
    expect(usrStoriesDiv.textContent).toContain(
      'Only allow your site to be loading in an iFrame on your own pages.'
    );
    expect(usrStoriesDiv.textContent).toContain(
      `I can GET an entire thread with all it's replies from /api/replies/{board}?thread_id={thread_id}. Also hiding the same fields.`
    );
    expect(usrStoriesDiv.textContent).toContain(
      'Complete functional tests that wholely test routes and pass.'
    );
    expect(usrStoriesDiv.textContent).toContain('/api/threads{board}');
    expect(usrStoriesDiv.textContent).toContain('/api/replies{board}');
  });
});
