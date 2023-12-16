import { describe, it } from 'mocha';
import { assert } from 'chai';
import '../src/core';

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

describe('Test client request', () => {
  it('fetch json and parse', async () => {
    const response = await request.get(
      'https://jsonplaceholder.typicode.com/todos'
    );
    assert.equal(response.status, 200, 'failed to retrieve valid response');
    const todos: Todo[] = response.json();
    assert.isArray(todos);
  });
});
