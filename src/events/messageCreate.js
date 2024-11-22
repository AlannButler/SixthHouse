const { Events, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const ini = require("../config/bot.json");
const puppeteer = require("puppeteer");

function extractNickname(text) {
    const match = text.match(/^([\wа-яА-ЯёЁ]+)(?:\s*[\(\{\[][\wа-яА-ЯёЁ]+[\)\}\]])?$/);
    return match ? match[1] : null;
}

async function fetchCharacterData(nickname) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://metasirus.su/');
    await page.setViewport({ width: 1080, height: 1024 });
    await page.waitForSelector('input.el-input__inner');
    await page.type('input.el-input__inner', nickname);
    await page.waitForSelector('li[role="option"]');
    const targetElementHandle = await page.evaluateHandle((nickname) => {
        const listItems = document.querySelectorAll('li[role="option"]');
        for (const item of listItems) {
            if (item.textContent.includes(nickname)) {
                return item;
            }
        }
        return null;
    }, nickname);
    if (targetElementHandle) await targetElementHandle.click();
    await page.waitForSelector('div.character-card-overlay');
    const characterData = await page.evaluate(() => {
        const card = document.querySelector('div.character-card-overlay');
        if (!card) return null;
        const guildName = card.querySelector('.guild-link__name')?.innerText || 'Гильдия не найдена';
        const itemLevel = card.querySelector('.character-data__ilvl')?.innerText || 'Уровень предметов не найден';
        const category = card.querySelector('.character-data__category')?.innerText || 'Категория не найдена';
        return { guildName, itemLevel, category };
    });
    await page.waitForSelector('div.wrapper[realm="soulseeker-x1"]');
    const id = await page.evaluate(() => document.querySelector('div.wrapper[realm="soulseeker-x1"]')?.getAttribute('id') || null);
    const imageSrc = await page.evaluate(() => document.querySelector('div.el-image.type-icon img')?.src || null);
    await browser.close();
    return { characterData, id, imageSrc };
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        const guildConfig = ini.guilds[message.guild.id];
        if (message.channel.id === guildConfig.requestChannel) {
            if (message.member.roles.cache.has(guildConfig.roleId)) return message.delete();
            const nickname = extractNickname(message.content);
            const embedInfo = {
                color: 0xa87b00,
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
            const msg = await message.channel.send({ content: "", embeds: [embedInfo], components: [buttons] });
            const { characterData, id, imageSrc } = await fetchCharacterData(nickname);
            if (characterData && id && imageSrc) {
                console.log(msg.embeds);
                const newEmbed = msg.embeds[0].data;
                console.log(newEmbed)
                newEmbed.fields = [
                    { name: "Название гильдии:", value: `${characterData.guildName}`, inline: true },
                    { name: "Уровень предметов:", value: `${characterData.itemLevel}`, inline: true },
                    { name: "Категория:", value: `${characterData.category}`, inline: true },
                    { name: "Sirus Base:", value: `[${nickname}](https://sirus.su/base/character/x1/${nickname}/)`, inline: true },
                    { name: "Meta Sirus:", value: `[${nickname}](https://metasirus.su/character/soulseeker-x1/${id})`, inline: true },
                ]
                console.log(newEmbed)
                await msg.edit({ content: "", embeds: [newEmbed] });
            }
        }
        if (message.content.startsWith("/profile")) {
            const nickname = message.content.replace("/profile", "").trim();
            const { characterData, id, imageSrc } = await fetchCharacterData(nickname);
            if (characterData && id && imageSrc) {
                const embedInfo = {
                    color: 0xa87b00,
                    title: `**Профиль ${nickname}:**`,
                    description: `\`\`\`Название гильдии: ${characterData.guildName}\nУровень предметов: ${characterData.itemLevel}\nКатегория: ${characterData.category}\`\`\``,
                    fields: [
                        { name: "Sirus Base:", value: `[${nickname}](https://sirus.su/base/character/x1/${nickname}/)`, inline: true },
                        { name: "Meta Sirus:", value: `[${nickname}](https://metasirus.su/character/soulseeker-x1/${id})`, inline: true }
                    ],
                    timestamp: new Date().toISOString(),
                    thumbnail: { url: `${imageSrc}` },
                    color: 0x118f00
                };
                await message.reply({ content: "", embeds: [embedInfo] });
            } else {
                await message.reply({ content: "Информация о персонаже не найдена." });
            }
        }
    }
};