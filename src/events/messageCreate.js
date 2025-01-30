const { Events, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const ini = require("../config/bot.json");

function extractNickname(text) {
    const match = text.match(/^([\wа-яА-ЯёЁ]+)(?:\s*[({\[][\wа-яА-ЯёЁ]+[)}\]])?$/);
    return match ? match[1] : null;
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        const guildConfig = ini.guilds[message.guild.id];
        if (message.content === "/zayav") {
            const embedInfo = {
                color: 0xe74c3c,
                title: "**Подача заявок в гильдию Шестой Дом**",
                description: "Приветствуем новоприбывших, если вы желаете стать частью нашей гильдии **\"Шестой Дом\"** - воспользуйтесь кнопкой ниже для заполнения заявки.\n\nОт вас требуется лишь активность в игре, мы же в свою очередь предоставляем следующие возможности:\n\`\`\`• Помощь в прокачке/вопросах по геймплею\n• Постоянные гильдейские рейды(берем вагончиков)\n• Конкурсы на голду/предметы\`\`\`"
            }

            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("requestGuild").setLabel("Подать заявку").setStyle(ButtonStyle.Danger).setEmoji({ name: "📝" })
            )

            await message.channel.send({ 
                content: "", 
                embeds: [embedInfo],
                components: [buttons]
            });
        }
        if (message.channel.id === guildConfig.requestChannel) {
            if (message.member.roles.cache.has(guildConfig.roleId)) return message.delete();
            const nickname = extractNickname(message.content);
            const embedInfo = {
                color: 0xe74c3c,
                title: `**Запрос на выдачу роли:**`,
                description: `\`\`\`${message.content}\`\`\``,
                fields: [{ name: "Профиль:", value: `[${nickname}](https://sirus.su/base/character/x1/${nickname}/)` }],
                timestamp: new Date().toISOString(),
                author: { name: message.author.username, icon_url: message.author.displayAvatarURL(), url: message.author.displayAvatarURL() }
            };
            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(`acceptRole_${message.author.id}`).setEmoji({ name: "✅" }).setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId(`declineRole_${message.author.id}`).setEmoji({ name: "❎" }).setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId(`delete_${message.author.id}`).setEmoji({ name: "🗑️" }).setStyle(ButtonStyle.Secondary)
            );
            await message.delete(1);
            await message.channel.send({ content: "", embeds: [embedInfo], components: [buttons] });
        }
    }
};