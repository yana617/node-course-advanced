const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

describe('When logged in', () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('Can see blog create form', async () => {
    const label = await page.$eval('form label', el => el.innerHTML);
    expect(label).toBe('Blog Title');
  });

  describe('Using invalid inputs', () => {
    beforeEach(async () => {
      await page.click('form button');
    });

    test('the form shows an error message', async () => {
      const titleError = await page.$eval('.title .red-text', el => el.innerHTML);
      const contentError = await page.$eval('.content .red-text', el => el.innerHTML);

      expect(titleError).toBe('You must provide a value');
      expect(contentError).toBe('You must provide a value');
    });
  });

  describe('Using valid inputs', () => {
    let myTitle = 'My title';
    let myContent = 'My content';

    beforeEach(async () => {
      await page.type('.title input', myTitle);
      await page.type('.content input', myContent);
      await page.click('form button');
    });

    test('Submitting takes user to review screen', async () => {
      const text = await page.$eval('h5', el => el.innerHTML);
      expect(text).toBe('Please confirm your entries');
    });
    test('Submitting then saving adds blog to index page', async () => {
      await page.click('button.green');
      await page.waitForSelector('.card');

      const title = await page.$eval('.card-title', el => el.innerHTML);
      const content = await page.$eval('p', el => el.innerHTML);

      expect(title).toBe(myTitle);
      expect(content).toBe(myContent);
    });
  });
});

describe('User is not logged in', () => {
  const actions = [{
    method: 'get',
    path: '/api/blogs',
  }, {
    method: 'post',
    path: '/api/blogs',
    body: { title: 'My title', content: 'My content' },
  }];

  test('Blog related actions are prohibited', async () => {
    const results = await page.execRequests(actions);
    for(let result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
    }
  });
});
