// @ts-check
const { Client } = require('discord.js');
const { token, settings } = require('./config');
const init = require('./src');

// ENV SETTINGS EXAMPLE
// const settings = {
//   categoryId: '123',
//   channelId: '123',
//   lobbies: [
//     {
//       creatorId: '123',
//       name: 'Лобби zxc',
//       limit: 2, 
//     },
//     {
//       creatorId: '123',
//       name: 'Лобби 2ppl',
//       limit: 2, 
//     },
//     {
//       creatorId: '123',
//       name: 'Лобби 3ppl',
//       limit: 3, 
//     },
//     {
//       creatorId: '123',
//       name: 'Лобби 5ppl',
//       limit: 5, 
//     },
//     {
//       creatorId: '123',
//       name: 'Лобби TURBO',
//       limit: 5, 
//     },
//     {
//       creatorId: '123',
//       name: 'Лобби UNRANKED',
//       limit: 5, 
//     },
//   ],
// };

function main() {
  const client = new Client();
  init(client, settings);
  client.login(token);
}

main();
