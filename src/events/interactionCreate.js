const { Events, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.inGuild()) { return; }
        if (interaction.isChatInputCommand()) {
            const client = interaction.client;
            if (!interaction.guild.members.me.permissions.has([
                PermissionFlagsBits.UseApplicationCommands,
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageRoles,
                PermissionFlagsBits.ManageNicknames,
                PermissionFlagsBits.SendMessages
            ])) {
                return interaction.reply({ content: `yetkin yok`, ephemeral: true });
            } else {
                let CL_commands = client.cl_handler.getCommand(interaction.commandName);
                if (!CL_commands) return;
            }
        }
    },
};