import React from 'react';
import { render, cleanup, waitForDomChange } from '@testing-library/react';
import regeneratorRuntime, { async } from 'regenerator-runtime';
import axiosMock from 'axios';
import Board from '../components/container/board';

jest.mock('axios');
afterEach(cleanup);

describe('<Board /> component', () => {
  test('It displays default text', () => {
    const { container } = render(<Board />);
    const defaultTxt = container.querySelector('[id="boardDiv"]');
    expect(defaultTxt.textContent).toContain('Welcome to');
    expect(defaultTxt.textContent).toContain('Submit a new thread:');
  });
  test('It displays get request text', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        data: [
          {
            _id: 'GAhm56Qripf7CBeTw6x3DLhT6',
            BumpedOn: '2019-11-21T07:17:32.453Z',
            CreatedOn: '2019-11-21T07:17:32.453Z',
            Text: 'Thread0',
            ThreadId: 'GAhm56Qripf7CBeTw6x3DLhT6',
            Type: 'Thread',
            TotalReplies: 3,
            Replies: [
              {
                _id: 'ui3ripf7asdfCBeTw6x3DLhT6',
                CreatedOn: '2019-11-21T07:17:32.453Z',
                Text: 'Reply0',
                ThreadId: 'GAhm56Qripf7CBeTw6x3DLhT6',
                Type: 'Reply',
              },
              {
                _id: 'pm3ripf7Cpmml09mkBeTw6x3oD',
                CreatedOn: '2019-11-21T07:17:32.453Z',
                Text: 'Reply1',
                ThreadId: 'GAhm56Qripf7CBeTw6x3DLhT6',
                Type: 'Reply',
              },
              {
                _id: 'fj30ripf723CBeTw6x3DLhT6',
                CreatedOn: '2019-11-21T07:17:32.453Z',
                Text: 'Reply2',
                ThreadId: 'GAhm56Qripf7CBeTw6x3DLhT6',
                Type: 'Reply',
              },
            ],
          },
          {
            _id: 'fmbm56QripftCBeTo6x3DLhT6',
            BumpedOn: '2019-11-21T07:17:32.453Z',
            CreatedOn: '2019-11-21T07:17:32.453Z',
            Text: 'Thread1',
            ThreadId: 'fmbm56QripftCBeTo6x3DLhT6',
            Type: 'Thread',
            TotalReplies: 0,
            Replies: [],
          },
        ],
      },
    });
    const { container } = render(<Board />);
    const boardDiv = container.querySelector('[id="boardDiv"]');
    await waitForDomChange();
    expect(boardDiv.textContent).toContain('Thread0');
    expect(boardDiv.textContent).toContain('Thread1');
    expect(boardDiv.textContent).toContain('Reply0');
    expect(boardDiv.textContent).toContain('Reply1');
    expect(boardDiv.textContent).toContain('Reply2');
    expect(boardDiv.textContent).toContain('GAhm56Qripf7CBeTw6x3DLhT6');
    expect(boardDiv.textContent).toContain('ui3ripf7asdfCBeTw6x3DLhT6');
    expect(boardDiv.textContent).toContain('pm3ripf7Cpmml09mkBeTw6x3oD');
    expect(boardDiv.textContent).toContain('fj30ripf723CBeTw6x3DLhT6');
    expect(boardDiv.textContent).toContain('fmbm56QripftCBeTo6x3DLhT6');
  });
});
