const puppeteer = require('puppeteer');

const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const customPage = new CustomPage(page);
    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || browser[property] || page[property];
      },
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('http://localhost:3000/blogs');
    await this.page.waitForSelector('a[href="/auth/logout"]');
  }

  async get(path) {
    return this.page.evaluate((path) => {
      return fetch(path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then(res => res.json());
    }, path);
  }

  async post(path, body) {
    return this.page.evaluate((_path, _body) => {
      return fetch(_path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(_body),
      })
        .then(res => res.json());
    }, path, body);
  }

  async execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, body }) => {
        return this[method](path, body);
      })
    );
  }
}

module.exports = CustomPage;
