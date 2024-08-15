
const Bots = require('./bots');
const client = new Bots();
client.loadEvents();
client.loadCommands();
client.connect();