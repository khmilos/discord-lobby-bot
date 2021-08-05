require('dotenv').config();

const requiredEnvVars = [
  'BOT_TOKEN',
  'SETTINGS',
];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  throw new Error(`Required .env variables: ${missingEnvVars.join(', ')}`)
}

module.exports = {
  token: process.env.BOT_TOKEN,
  settings: JSON.parse(process.env.SETTINGS),
};
