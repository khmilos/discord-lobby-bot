// @ts-check

const { settings } = require('./config');
const App = require('./src/App');

function start() {
  new App(settings).main();
}

start();
