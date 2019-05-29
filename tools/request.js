const axios = require('axios');
const { ConcurrencyManager } = require('axios-concurrency');
const md5 = require('md5');

let reconnect_requests = {};
let use_cookies = {};
const MAX_CONCURRENT_REQUESTS = 5;
const MAX_RECONNECT_TIMES = 10;

function responseHandler (response) {
  //保存需要的Cookie
  if (response.headers.hasOwnProperty('set-cookie')) {
    response_use_cookies = response.headers['set-cookie'];
    response_use_cookies.map(cookie => {
      let cookie_key = cookie.split(';')[0].split('=')[0];
      let cookie_value = cookie.split(';')[0].split('=')[1];
      for (let key in use_cookies) {
        if (key === cookie_key) {
          use_cookies[key] = cookie_value;
        }
      }
    });
  }
  reconnecting = 0;
  return response.data;
}

function requestHandler (config) {
  //设置Cookie
  if (!config.headers.hasOwnProperty('Cookie')) {
    config.headers.Cookie = '';
  }
  for (let key in use_cookies) {
    config.headers.Cookie += `;${key}=${use_cookies[key]}`;
  }
  return config;
}

let ax_request = axios.create({ timeout: 3000 });
axios.defaults.timeout = 3000;

axios.interceptors.request.use(requestHandler, error => Promise.reject(error));
axios.interceptors.response.use(responseHandler, error => Promise.reject(error));
ax_request.interceptors.request.use(requestHandler, error => Promise.reject(error));
ax_request.interceptors.response.use(responseHandler, error =>
  reconnect(Date.now() + md5(error.config), error.config)
);

ConcurrencyManager(ax_request, MAX_CONCURRENT_REQUESTS);

function reconnect (id, config) {
  if (
    reconnect_requests.hasOwnProperty(id) &&
    reconnect_requests[id].hasOwnProperty('reconnect_times')
  ) {
    reconnect_requests[id].reconnect_times++;
  } else {
    reconnect_requests[id] = { reconnect_times: 0 };
  }
  if (reconnect_requests[id].reconnect_times > MAX_RECONNECT_TIMES) {
    console.log();
    console.log('重连次数过多，任务完全中止');
    process.exit();
  }

  return new Promise(resolve => {
    setTimeout(() => {
      axios(config)
        .then(response => resolve(response))
        .catch(e => {
          reconnect(id, config).then(response => resolve(response));
        });
    }, 3000);
  });
}

//设置需要保存的Cookie
ax_request.setUseCookie = function (key) {
  if (!use_cookies.hasOwnProperty(key)) {
    use_cookies[key] = '';
  }
};

module.exports = ax_request;
