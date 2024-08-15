

const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = class test {
    constructor() {
        (this.cooldown = 10),
            (this.category = "test2"),
            (this.name = "test2"),
            (this.slashCommand = new SlashCommandBuilder()
                .setName("test2")
                .setDescription("Test komutu2")
                .setDMPermission(false));
    }

    async run(client, interaction) {
        await interaction.reply(this.name + " çalışıyor");
    }
};