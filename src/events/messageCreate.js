const { Events, ButtonStyle, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const ini = require("../config/bot.json");

const fs = require("fs");
const path = require("path");

const readedRulesPath = path.resolve(__dirname, "../config/readedRules.json");

function extractNickname(text) {
    const match = text.match(/^([\wа-яА-ЯёЁ]+)(?:\s*[({\[][\wа-яА-ЯёЁ]+[)}\]])?$/);
    return match ? match[1] : null;
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        const guildConfig = ini.guilds[message.guild.id];
        if (message.content === "/zayav" && message.author.id === "701440080111337513") {
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

        if (message.content === "/rules" && message.author.id === "701440080111337513") {
            
            fs.readFile(readedRulesPath, 'utf8', async (err, data) => {
                const embedInfo = {
                    color: 0xe74c3c,
                    title: "**Правила гильдии Шестой Дом**",
                    description: "В данном канале вы можете ознакомиться с правилами нашей гильдии **\"Шестой Дом\"**.\n\nДля выбора раздела - выберите необходимый пункт в сплывающем окне снизу.",
                    fields: [
                        { name: "Количество раз прочитано правило:", value: "0", inline: true },
                        { name: "Любит почитать:", value: "Ты!", inline: true }
                    ]
                }
    
                const select = new StringSelectMenuBuilder().setCustomId("rulesSelect").setPlaceholder("Выберите раздел").addOptions(
                    new StringSelectMenuOptionBuilder().setLabel("Общие моменты").setValue("general").setDescription("Общие моменты гильдии").setEmoji("1340614498448441448"),
                    new StringSelectMenuOptionBuilder().setLabel("Правила").setValue("rules").setDescription("Правила гильдии").setEmoji("1340614672696741950"),
                    new StringSelectMenuOptionBuilder().setLabel("Звания").setValue("roles").setDescription("Звания в гильдии").setEmoji("1340614857195520100"),
                    new StringSelectMenuOptionBuilder().setLabel("Активность").setValue("activity").setDescription("Активность гильдии по рейдам").setEmoji("1340615275686526997"),
                    new StringSelectMenuOptionBuilder().setLabel("Распределение лута").setValue("loot").setDescription("Правила распределения лута").setEmoji("1340615395379515462"),
                    new StringSelectMenuOptionBuilder().setLabel("Начисления ЕП").setValue("ep").setDescription("За что можно получить ЕП").setEmoji("1340615949619040308"),
                    new StringSelectMenuOptionBuilder().setLabel("Штрафы").setValue("strafs").setDescription("За что дают штрафы").setEmoji("1340615957177040896"),
                    new StringSelectMenuOptionBuilder().setLabel("Разролл вещей").setValue("roll").setDescription("Правила разролла вещей через аукцион(условия)").setEmoji("1340616122629750854")
                )
    
                const row = new ActionRowBuilder().addComponents(select);

                if (err) {
                    console.error('Error reading file:', err);
                    return;
                }

                const jsonData = JSON.parse(data);
                jsonData.users ||= {};

                if (!jsonData.interactions) {
                    jsonData.interactions = 0;
                }

                let topUser = { id: null, interactions: 0 };
                for (const [id, userData] of Object.entries(jsonData.users)) {
                    if (userData.interactions > topUser.interactions) {
                        topUser = { id, interactions: userData.interactions };
                    }
                }

                fs.writeFile(readedRulesPath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                    }
                });

                embedInfo.fields[0].value = (jsonData.interactions || 0) + 1;
                if (topUser.id) {
                    embedInfo.fields = embedInfo.fields.map(field => {
                        if (field.name === "Любит почитать:") {
                            field.value = `<@${topUser.id}> (${topUser.interactions} раз)`;
                        }
                        return field;
                    });
                }

                await message.channel.send({ 
                    content: "", 
                    embeds: [embedInfo],
                    components: [row]
                });
            });

        }

        if (message.content === "")
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