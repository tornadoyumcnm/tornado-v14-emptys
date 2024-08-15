

const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = class test {
    constructor() {
        (this.cooldown = 10),
            (this.category = "test"),
            (this.name = "test"),
            (this.slashCommand = new SlashCommandBuilder()
                .setName("test")
                .setDescription("Test komutu")
                .setDMPermission(false));
    }

    async run(client, interaction) {
        await interaction.reply(this.name + " çalışıyor");
    }
};