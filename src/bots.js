

require('dotenv').config();
const {
    Client,
    Partials,
    Options,
    IntentsBitField
} = require('discord.js');
const { DefaultRestOptions, DefaultUserAgentAppendix } = require('@discordjs/rest');
const { version } = require('../package.json');
const fs = require('node:fs');
const path = require('node:path');
const clc = require('cli-color');
const { Bot_Handler } = require('./utils/Clo_Handler');
module.exports = class Bots extends Client {
    constructor() {
        super({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers
            ],
            partials: [
                Partials.User,
                Partials.Channel,
                Partials.Message,
                Partials.GuildMember
            ],
            allowedMentions: {
                parse: ['users'],
                repliedUser: true
            },
            sweepers: {
                ...Options.DefaultSweeperSettings, messages: { interval: 1000, lifetime: 300 }, threads: {
                    interval: 3600,
                    lifetime: 1600,
                },
                users: {
                    lifetime: 1800,
                    interval: 1400,
                    filter: () => user => user.bot && user.id !== process.env.CLIENT_ID
                }
            },
            makeCache: Options.cacheWithLimits({
                ...Options.DefaultMakeCacheSettings, MessageManager: 0, GuildMemberManager: {
                    maxSize: 10,
                    keepOverLimit: (member) => member.id === process.env.CLIENT_ID
                }
            }),
            closeTimeout: 1_000,
            failIfNotExists: true,
            rest: {
                ...DefaultRestOptions,
                userAgentAppendix: `discord.js/${version} ${DefaultUserAgentAppendix}`.trimEnd()
            },
            ws: {
                large_threshold: 50,
                version: 10
            }
        });
    }
    loadEvents() {
        const eventsPath = path.join(__dirname, 'events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if (event.once) {
                this.once(event.name, (...args) => event.execute(...args));
            } else {
                this.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
    loadCommands() {
        const CLhandler = new Bot_Handler({
            folder: __dirname + "/commands/",
            globalCommandRefresh: true,
        });
        this.cl_handler = CLhandler;
    }

async connect() {
void await this.login(process.env.TAGOS_TOKEN);
}


}