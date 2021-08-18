require('dotenv').config();

if (!process.env.SETTINGS) {
  throw new Error(`Required .env variables: SETTINGS as minified JSON`);
}

module.exports = {
  settings: JSON.parse(process.env.SETTINGS),
};
