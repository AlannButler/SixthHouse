const { Events } = require("discord.js");
const ini = require("../config/bot.json");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;
        console.log(`[InteractionCreate] CustomId: ${interaction.customId}`);
        const guildConfig = ini.guilds[interaction.guild.id];
        const hasRole = interaction.member.roles.cache.some(role => guildConfig.accessRoles.includes(role.id));

        if (!hasRole) return interaction.reply({ content: "\`[❌] У вас нет доступа к выдачи роли!\`", ephemeral: true });

        const [action, userId] = interaction.customId.split("_");
        console.log(`[InteractionCreate] Action: ${action}, UserId: ${userId}`);
        const member = interaction.guild.members.cache.get(userId);
        console.log(`[InteractionCreate] Member: ${member}`);
        if (!member) return interaction.reply({ content: "Пользователь не найден", ephemeral: true });

        const role = interaction.guild.roles.cache.get(guildConfig.roleId);
        const logChannel = interaction.guild.channels.cache.get(guildConfig.logChannel);

        if (action === "acceptRole") {
            if (!role) return interaction.reply({ content: "Роль не найдена", ephemeral: true });
            await member.roles.add(role);
            await interaction.message.edit({ components: [] });

            if (logChannel) {
                logChannel.send({
                    embeds: [{
                        title: "**Выдача роли:**",
                        description: `**Запросил: <@${userId}>\nРоль: <@&${role.id}>\nПроверил: ${interaction.user}\n\nВердикт: Одобрено**`,
                        timestamp: new Date().toISOString(),
                        thumbnail: { url: member.user.displayAvatarURL() },
                        color: 0x118f00
                    }]
                });
            }

            const nickname = interaction.message.embeds[0].description.replace(/```/g, "");
            await member.setNickname(nickname);

            await interaction.reply({ content: `**Роль <@&${role.id}> выдана пользователю <@${member.id}>.**`, ephemeral: true })
                .then(m => setTimeout(async () => {
                    await interaction.message.delete();
                    await m.delete();
                }, 30000));
        }

        if (action === "declineRole") {
            await interaction.message.edit({ components: [] });

            if (logChannel) {
                logChannel.send({
                    embeds: [{
                        title: "**Выдача роли:**",
                        description: `**Запросил: <@${userId}>\nРоль: <@&${guildConfig.roleId}>\nПроверил: ${interaction.user}\n\nВердикт: Отказано**`,
                        timestamp: new Date().toISOString(),
                        thumbnail: { url: member.user.displayAvatarURL() },
                        color: 0x8f0000
                    }]
                });
            }

            await interaction.reply({ content: `**Роль не выдана пользователю <@${member.id}>**`, ephemeral: true })
                .then(m => setTimeout(async () => {
                    await interaction.message.delete();
                    await m.delete();
                }, 30000));
        }

        if (action === "delete") {
            await interaction.message.delete();

            if (logChannel) {
                logChannel.send({
                    embeds: [{
                        title: "**Выдача роли:**",
                        description: `**Запросил: <@${userId}>\nРоль: <@&${guildConfig.roleId}>\nПроверил: ${interaction.user}\n\nВердикт: Удалено**`,
                        timestamp: new Date().toISOString(),
                        thumbnail: { url: member.user.displayAvatarURL() },
                        color: 0xa87b00
                    }]
                });
            }
        }
    }
}