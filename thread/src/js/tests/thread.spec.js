import React from 'react';
import { render, cleanup, waitForDomChange } from '@testing-library/react';
import regeneratorRuntime, { async } from 'regenerator-runtime';
import axiosMock from 'axios';
import Thread from '../components/container/thread';

afterEach(cleanup);
jest.mock('axios');

describe('<Thread /> component', () => {
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
            board: 't0',
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
        ],
      },
    });
    const { container } = render(<Thread />);
    await waitForDomChange();
    const threadDiv = container.querySelector('[id="threadBody"]');
    expect(threadDiv.textContent).toContain('Thread0');
    expect(threadDiv.textContent).toContain('Reply0');
    expect(threadDiv.textContent).toContain('Reply1');
    expect(threadDiv.textContent).toContain('Reply2');
    expect(threadDiv.textContent).toContain('GAhm56Qripf7CBeTw6x3DLhT6');
    expect(threadDiv.textContent).toContain('ui3ripf7asdfCBeTw6x3DLhT6');
    expect(threadDiv.textContent).toContain('pm3ripf7Cpmml09mkBeTw6x3oD');
    expect(threadDiv.textContent).toContain('fj30ripf723CBeTw6x3DLhT6');
  });
});
