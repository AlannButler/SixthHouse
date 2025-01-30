const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const ini = require("../config/bot.json");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        console.log(`[InteractionCreate] CustomId: ${interaction.customId}`);
        if (interaction.isModalSubmit()) {
            if (interaction.customId === "requestGuildModal") {
                const name = interaction.fields.getTextInputValue("requestGuildName");
                const nickname = interaction.fields.getTextInputValue("requestGuildNickname");
                const userClass = interaction.fields.getTextInputValue("requestGuildClass");
                const ilvl = interaction.fields.getTextInputValue("requestGuildIlvl");
                const workShift = interaction.fields.getTextInputValue("requestGuildWorkShift");
    
                const embedInfo = {
                    title: "**Заявка в гильдию Шестой Дом**",
                    description: `**Имя:** \`${name}\`\n**Никнейм и уровень:** \`${nickname}\`\n**Класс (+твинки):** \`${userClass}\`\n**ILVL и ДПС:** \`${ilvl}\`\n**График работы:** \`${workShift}\`\n\n**Пользователь:** <@${interaction.user.id}>`,
                    color: 0xe74c3c,
                    timestamp: new Date().toISOString(),
                    author: { name: interaction.user.username, icon_url: interaction.user.displayAvatarURL(), url: interaction.user.displayAvatarURL() }
                }

                const buttons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`acceptRequestGuild_${interaction.user.id}`).setEmoji({ name: "✅" }).setStyle("Success"),
                    new ButtonBuilder().setCustomId(`deleteRequestGuild`).setEmoji({ name: "🗑️" }).setStyle("Danger")
                )

                await interaction.channel.send({ embeds: [embedInfo], components: [buttons] });
                await interaction.reply({
                    content: "Заявка отправлена!",
                    ephemeral: true
                })
            }
        }

        if (interaction.isButton()) {
            const guildConfig = ini.guilds[interaction.guild.id];
            const hasRole = interaction.member.roles.cache.some(role => guildConfig.accessRoles.includes(role.id));
    
            const [action, userId] = interaction.customId.split("_");
            console.log(`[InteractionCreate] Action: ${action}, UserId: ${userId}`);
            const member = await interaction.guild.members.fetch(userId);
            console.log(`[InteractionCreate] Member: ${member}`);
            if (!member) return interaction.reply({ content: "Пользователь не найден", ephemeral: true });
    
            const role = interaction.guild.roles.cache.get(guildConfig.roleId);
            const logChannel = interaction.guild.channels.cache.get(guildConfig.logChannel);

            if (action === "requestGuild") {
                if (interaction.member.roles.cache.has(guildConfig.roleId)) return;

                const modal = new ModalBuilder()
                    .setCustomId("requestGuildModal")
                    .setTitle("Заявка в гильдию Шестой Дом")
                
                const name = new TextInputBuilder()
                    .setCustomId("requestGuildName")
                    .setLabel("Имя")
                    .setPlaceholder("Тамик")
                    .setMaxLength(32)
                    .setStyle(TextInputStyle.Short)
    
                const nickname = new TextInputBuilder()
                    .setCustomId("requestGuildNickname")
                    .setLabel("Никнейм и уровень")
                    .setPlaceholder("Donotworry - 80")
                    .setMaxLength(64)
                    .setStyle(TextInputStyle.Short)
    
                const userClass = new TextInputBuilder()
                    .setCustomId("requestGuildClass")
                    .setLabel("Класс (+твинки)")
                    .setPlaceholder("ГДК Танк (ШД Рога)")
                    .setMaxLength(64)
                    .setStyle(TextInputStyle.Short)
                
                const ilvl = new TextInputBuilder()
                    .setCustomId("requestGuildIlvl")
                    .setLabel("ILVL и ДПС")
                    .setPlaceholder("235 - 13k ДПС")
                    .setMaxLength(32)
                    .setStyle(TextInputStyle.Short)
    
                const workShift = new TextInputBuilder()
                    .setCustomId("requestGuildWorkShift")
                    .setLabel("График работы")
                    .setPlaceholder("5:2 с 9 до 16")
                    .setMaxLength(64)
                    .setStyle(TextInputStyle.Short)
    
                const actionRow1 = new ActionRowBuilder().addComponents(name);
                const actionRow2 = new ActionRowBuilder().addComponents(nickname);
                const actionRow3 = new ActionRowBuilder().addComponents(userClass);
                const actionRow4 = new ActionRowBuilder().addComponents(ilvl);
                const actionRow5 = new ActionRowBuilder().addComponents(workShift);
    
                modal.addComponents(actionRow1, actionRow2, actionRow3, actionRow4, actionRow5);
    
                return await interaction.showModal(modal);
            }

            if (!hasRole) return interaction.reply({ content: "\`[❌] У вас нет доступа к выдачи роли!\`", ephemeral: true });
    
            if (action === "acceptRequestGuild") {
                if (!role) return interaction.reply({ content: "Роль не найдена", ephemeral: true });
                await member.roles.add(role);
                await interaction.message.edit({ components: [] });
    
                if (logChannel) {
                    logChannel.send({
                        embeds: [{
                            title: "**Заявка в гильдию:**",
                            description: `**Запросил: <@${userId}>\nРоль: <@&${role.id}>\nПроверил: ${interaction.user}\n\nВердикт: Одобрено**`,
                            timestamp: new Date().toISOString(),
                            thumbnail: { url: member.user.displayAvatarURL() },
                            color: 0xe74c3c
                        }]
                    });
                }
    
                await interaction.reply({ content: `**Роль <@&${role.id}> выдана пользователю <@${member.id}>.**`, ephemeral: true })
                    .then(m => setTimeout(async () => {
                        await interaction.message.delete();
                        await m.delete();
                    }, 30000));
            }

            if (action === "deleteRequestGuild") {
                await interaction.message.delete();
    
                if (logChannel) {
                    logChannel.send({
                        embeds: [{
                            title: "**Заявка в гильдию:**",
                            description: `**Запросил: <@${userId}>\nРоль: <@&${guildConfig.roleId}>\nПроверил: ${interaction.user}\n\nВердикт: Удалено**`,
                            timestamp: new Date().toISOString(),
                            thumbnail: { url: member.user.displayAvatarURL() },
                            color: 0xe74c3c
                        }]
                    });
                }
            }
            
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
                            color: 0xe74c3c
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
                            color: 0xe74c3c
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
                            color: 0xe74c3c
                        }]
                    });
                }
            }
    
            
        }
    }
}