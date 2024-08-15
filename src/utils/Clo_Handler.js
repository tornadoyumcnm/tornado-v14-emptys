

class Bot_Handler {
    /**
     * Bir Komut İşleyici örneği oluşturur.
     * @param {*} [data={}]
     * @memberof Bot_Handler
     */

    constructor(data = {}) {
        if (!data.folder) throw new Error("Klasör belirtilmedi.");

        this.folder = data.folder;
        this.globalCommandRefresh = data.globalCommandRefresh
            ? data.globalCommandRefresh
            : false;
        this.guildCommandRefresh = data.guildCommandRefresh
            ? data.guildCommandRefresh
            : false;

        this._loadFrom(data.folder);
    }

    async _loadFrom(folder) {
        const commands = new Map();

        const fs = require("fs");
        var clc = require("cli-color");

        const files = fs.readdirSync(folder);
        files
            .filter((f) => fs.statSync(folder + f).isDirectory())
            .forEach((nested) =>
                fs
                    .readdirSync(folder + nested)
                    .forEach((f) => files.push(nested + "/" + f))
            );
        const jsFiles = files.filter((f) => f.endsWith(".js"));

        if (files.length <= 0) throw new Error("- Yüklenecek komut yok!");
        const fileAmount = `${jsFiles.length}`;
        console.log(clc.blue(`- Yüklenecek (${fileAmount}) dosya bulundu!\n`));
        let jsonCommands = [];
        for (const f of jsFiles) {
            const file = require(folder + f);
            const cmd = new file();

            const name = cmd.name;
            commands.set(name, cmd);
            jsonCommands = jsonCommands.concat(cmd.slashCommand);
            console.log(clc.green(`- Komutlar Kuruldu: '${name}'`));
        }

        this.commands = commands;
        const { REST } = require("@discordjs/rest");
        const { Routes } = require("discord-api-types/v10")

        require("dotenv").config();
        const rest = new REST({ version: "10" }).setToken(
            process.env.TAGOS_TOKEN
        );

        if (this.guildCommandRefresh == true) {
            rest
                .put(
                    Routes.applicationGuildCommands(
                        process.env.CLIENT_ID,
                        process.env.GUILD_ID
                    ),
                    {
                        body: jsonCommands,
                    }
                )
                .then(() =>
                    console.log(clc.green("- Tüm sunucu komutları başarıyla yenilendi."))
                )
                .catch(console.error);
        }

        if (this.globalCommandRefresh == true) {
            try {
                console.log(clc.blue("Uygulama (/) komutları yenilenmeye başlandı."));
                await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
                    body: jsonCommands,
                });
            } catch (err) {
                console.log(err);
            }
        }

        console.log(clc.green("- Komutların kurulumu tamamlandı!"));
    }

    getCommand(string) {
        if (!string) return null;
        let cmd = this.commands.get(string);
        if (!cmd) return null;
        return cmd;
    }

    getCategory() {
        const categories = {};
        let totalCommands = 0;
        for (const [commandName, command] of this.commands) {
            const category = command.category;
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(commandName);
            totalCommands++;
        }


        const categoryCount = Object.keys(categories).length;
        const commandsPerCategory = {};
        for (const category in categories) {
            commandsPerCategory[category] = categories[category].length;
        }

        return {
            categoryCount,
            commandsPerCategory,
            categories,
            totalCommands,
        };
    }

    getCategoryName(categoryName) {
        const commandsInCategory = [];
        for (const [cmdName, cmd] of this.commands) {
            const ctgr = cmd.category;
            if (ctgr === categoryName) {
                commandsInCategory.push(cmdName);
            }
        }
        return commandsInCategory;
    }
}

module.exports = {
    Bot_Handler,
};