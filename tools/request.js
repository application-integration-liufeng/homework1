const axios = require('axios');
const md5 = require('md5');

let requests = {};
const MAX_RECONNECT_TIMES = 10;

let request = axios.create({ timeout: 3000 });

axios.interceptors.response.use(
  function(response) {
    return response.data;
  },
  function(error) {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  function(response) {
    return response.data;
  },
  function(error) {
    return reconnect(Date.now() + md5(error.config), error.config);
  }
);

function reconnect(id, config) {
  if (
    requests.hasOwnProperty(id) &&
    requests[id].hasOwnProperty('reconnect_times')
  ) {
    requests[id].reconnect_times++;
  } else {
    requests[id] = { reconnect_times: 0 };
  }
  if (requests[id].reconnect_times > MAX_RECONNECT_TIMES) {
    console.log();
    console.log('重连次数过多，任务完全中止');
    process.exit();
  }
  process.stdout.write('#');

  return new Promise(resolve => {
    setTimeout(() => {
      axios(config)
        .then(response => {
          console.log();
          resolve(response);
        })
        .catch(e => {
          reconnect(id, config).then(response => {
            resolve(response);
          });
        });
    }, 1000);
  });
}

module.exports = request;
