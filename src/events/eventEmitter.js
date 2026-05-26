// src/events/eventEmitter.js
const EventEmitter = require("events");

// Um único emissor compartilhado por toda a aplicação
const appEmitter = new EventEmitter();

module.exports = appEmitter;
