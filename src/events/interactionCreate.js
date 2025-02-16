const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const ini = require("../config/bot.json");

const fs = require("fs")
const path = require("path")

const readedRulesPath = path.join(__dirname, '../config/readedRules.json');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        console.log(`[InteractionCreate] CustomId: ${interaction.customId}`);

        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === "rulesSelect") {
                const selectedValue = interaction.values[0];

                let responseMessage = "";
                let titleMessage = "";

                console.log(selectedValue)

                switch (selectedValue) {
                    case 'general':
                        titleMessage = "Общие моменты";
                        responseMessage = `Мы - сообщество игроков, чья цель - **успешно проходить рейды и инсты, создавая при этом дружественную и поддерживающую атмосферу**. Мы готовы преодолевать сложности, вайпы и трудности вместе, поддерживая друг друга и избегая конфликтов и негатива.

В нашей гильдии каждый голос имеет значение, и мы ценим мнение каждого члена, независимо от его статуса. Мы открыты для обсуждений и конструктивной критики, поскольку верим, что именно в разнообразии мнений заключается наша сила.

Несмотря на написанное выше, окончательное решение всегда принимается **ГМом/Старшими офицерами/РЛами**. Мы уважаем их авторитет и признаем необходимость общих правил и руководства для эффективной игровой деятельности.

Правила гильдии - это не пустой звук, но и не жесткие догмы. Они служат ориентиром для нашего поведения и взаимодействия, однако мы готовы адаптировать их в соответствии с конкретными ситуациями и потребностями нашего сообщества. Вместе мы создаем здоровую и поддерживающую среду для игры и общения.

**Глава гильдии:** <@873885485741781013>
**Заместитель Главы Гильдии:** <@316497631755108354> и <@1273577203824726090>`
                        break;
                    case 'rules':
                        titleMessage = "Правила";
                        responseMessage = `**Наши основные правила это всего несколько запретов:**
1. **Запрещается**:
• Буллинг
• Хантинг
• Троллинг (черезмерный)
• И прочие оскорбления
2. **Запрещаются** любые разговоры на острые сейчас политические темы
3. **Запрещается** игнорирование Главы Гильдии, страшных офицеров, рейд лидеров

Все остальное, что не попадает под определение запрета - разрешено. Но в меру!`
                        break;
                    case 'roles':
                        titleMessage = "Звания";
                        responseMessage = `\`\`\`ch
1. Архитектор - Глава Гильдии, ведущий архитектор, который управляет структурой дома и всей гильдии.
2. Мастера - Старшие офицеры, поддерживают порядок и укрепляют дом на всех уровнях.
3. Стражи - Рейд Лидеры больших рейдов, они защищают основы, ведут самые сложные и опасные рейды.
4. Тайная - Никто не видел, никто не знает. Человек о котором шепчутся по углам Дома, его никто не видел.
5. Кузнецы - Рейд Лидеры малых рейдов. Те, кто кует победы в малых подземельях, укрепляя Дом в его деталях.
6. Привратники - Люди, которые ищут новых участников.
7. Опоры - Люди, закрепленные за составами (статиками).
8. Скитальцы - Люди, не закреплённые за составами (статиками).
9. Тамада - Человек, который добавляет чуточку веселья в нашм будни.
\`\`\``
                        break;
                    case 'activity':
                        titleMessage = "Активность";
                        responseMessage = `||(необходимо в дальнейшем для описание работы системы ЕП/ГП в нашей Гильдии)||

Данное правило объясняет как в нашей Гильдии работает Система ЕП/ГП.
Первоначально необходимо заметить, что мы разделяем все рейды на два класса - Ключевые рейды и не основные.
К ключевым относятся рейды, добыча с которых в текущем обновлении является наиболее актуально. На текущий момент времени это рейды на 25 человек - ***ИК-25, ИВК-25, Г/М-25, Г/М-25 гер***
Не основные рейды - это все остальные. 

Статусы рейдов постоянно будут пересматриваться рейд лидерами и страшными офицерами Гильдии. По мере роста иЛвл персонажей в статиках и актуальная информация о рейдах будет отражаться в данном сообщении.`
                        break;
                    case 'loot':
                        titleMessage = "Распределение лута";
                        responseMessage = `На данный момент **мы психически не готовы к полноценной системе использования ЕП/ГП**. Поэтому мы применяем часть этой системы в спайке с Консул-лутом. 
Разрол лута в неосновных и второстепенных рейдах происходит по системе свободного ролла по мейн спеку. Если вещь никому не нужна на мейн-спек, то можно ролить на офф-спек. 
На этом с этими двумя типами рейдов все. 

**В Ключевых рейдах начинает действовать система ЕП/Консул-лут с приоритетом. И касается она только предметов которые мы знаем под названием Токены и Печенье (далее Т/П). **

### **Далее основные моменты:**
 
• Вводится порог ЕП при котором Рейдер получает возможность участвовать в распределении Т/П. Порог равен - 600 ЕП
• За каждого пройденного босса в ключевом рейде Рейдеру начисляется - 100 ЕП
• При выдаче рейд-лидером Т/П Рейдеру, начисляет 100 очков ГП.
• После получения Т/П, Рейдер попадает в систему приоритетов, в которой высшим приоритетом обладают игроки с 3 Т/П и 1 Т/П, 2 Т/П, 0 Т/П
• Прочий лут ролится в свободном ролле по мейн спеку

### **Способы дополнительного набора ЕП:**
 
• Участие во второстепенных рейдах приносит Рейдеру по 50 очков ЕП за каждого пройденного босса. Участие в неосновных рейдах ЕП не приносит
• Если Рейдер не "влазит" в статик, но готов быть на замене, то он тоже получает ЕП - по 50 очков за каждого пройденного босса в ключевом рейде. Обязательное условие - На момент завершения рейда, Рейдер-на-Замене должен быть онлайн и подтвердить Рейд-Лидеру то, что он "в сети"

### **Способы потери набранных очков ЕП:**
 
• Прийти в ключевой рейд без потов, масел, фласок - по -50ЕП за каждый пункт.
• Опоздать в рейд - -50ЕП
• Ливнуть без причины из рейда (молча) - - 600ЕП
• Записаться и не прийти не предупредив Рейд-Лидера или Страшных Офицеров - -200ЕП.
• Прочее: сильно пьян, сильно туп, сильно громкий, не слушает РЛ - количество штрафных ЕП на усмотрение Рейд-Лидера.

**Еженедельно, в день сброса КД, будет проводиться срез ЕП - -25%. Т.е. господа и Дамы надеется на то, что один раз сходил в ключевой рейд и получил проходку к луту навсегда не придётся.**

||Данные правила не отлиты в бетоне. И будут корректироваться по мере необходимости.||`
                        break;
                    case 'ep':
                        titleMessage = "Начисления ЕП";
                        responseMessage = `**Распределение вещей: Аукцион ЕП**  

Мы пришли к пониманию, что в нашей Гильдии на данном этапе распределение вещей в ключевых рейдах будет происходить методом "**Аукцион ЕП**". Игроки смогут тратить заработанные ЕП, чтобы "выиграть" нужную им вещь.  

---

### **Способы получения ЕП:**

**За проходку рейдов:**
- **ИК-25** — по **100 ЕП** за босса  
- **Г/М-25** — по **150 ЕП** за босса  
- **ИВК-25** — по **200 ЕП** за босса  
- **Г/М-25 гер** — по **250 ЕП** за босса  

**Дополнительные начисления:**  
- За приход вовремя — **100 ЕП**  
- За завершение рейда — **150 ЕП**  
- За освоение (каждые 30 минут) — **50 ЕП**  

*Премирование за освоение:*  
— На усмотрение РЛ, включая решение о необходимости премии и её размера.  

**За нахождение на скамейке запасных:**  
- **50% от стоимости босса** конкретного рейда  
(*Важно!* Запасной игрок должен быть в игре весь рейд, чтобы при необходимости быстро присоединиться.)

---

### **ЕП для должностей:**

**Привратники:**  
- За приём людей — **200 ЕП** за КД  
- За проведение рейдов для "**Скитальцев**" (Кара, ИК-10):  
  - Привратники получают — **100 ЕП** за босса  
  - Скитальцы получают — **25 ЕП** за босса (*Приветственные ЕП*)  

*ЕП Привратникам начисляется только во время проведения мероприятий.*

**Тамада:**  
- За проведение конкурсов — **200 ЕП** в КД  

---

**Начисления для "Привратников" и "Тамад"** проводит **"Архитектор"**.`
                        break;
                    case "strafs":
                        titleMessage = "Штрафы";
                        responseMessage = `**Штрафы:**

- **АФК без предупреждения**: от **-5** до **-100 ЕП**  
- **АФК во время боя**: от **-10** до **-100 ЕП**  
- **Флуд во время рейда**: от **-10** до **-300 ЕП**  
- **Отсутствие актуальной химии в рейде** (за каждую проверку): **-50 ЕП**  
- **Игнорирование команд РЛа**: от **-50** до **-300 ЕП**  
- **Пул босса без команды РЛа**: от **-30** до **-200 ЕП**  
- **Вайп рейда**: от **-50** до **-100 ЕП**  
- **Грубое нарушение рейдтайма** (*гера, бр без команды РЛа*): от **-50** до **-200 ЕП**  
- **Перепродажа вещей согильдийцам за ЕП**: *Исключение из гильдии.*

*Решения о штрафах принимает РЛ и ответственные за систему ЕП аукцион офицеры.*`
                        break;
                    case "roll":
                        titleMessage = "Разролл вещей";
                        responseMessage = `**Срезы еженедельные, 20% (с 6-го февраля)**

**Аукцион непосредственно:**

   **а) За Вещи 245 иЛвл (стартовые цены):**
   - *Шмот* — стартовая цена **100 ЕП**, размер шага — **50 ЕП**  
   - *Оружие 1Р* — стартовая цена **150 ЕП**, размер шага — **50 ЕП**  
   - *Аксессуары* — стартовая цена **200 ЕП**, размер шага — **50 ЕП**  
   - *Оружие 2Р* — стартовая цена **250 ЕП**, размер шага — **50 ЕП**  
   - *Трофеи Авангард* — стартовая цена **100 ЕП**, размер шага — **50 ЕП**  

   **б) За Вещи 258 и Плащи 271 иЛвл (стартовые цены):**  
   - *Шмот* — стартовая цена **200 ЕП**, размер шага — **50 ЕП**  
   - *Оружие 1Р* — стартовая цена **250 ЕП**, размер шага — **50 ЕП**  
   - *Аксессуары* — стартовая цена **300 ЕП**, размер шага — **50 ЕП**  
   - *Оружие 2Р* — стартовая цена **350 ЕП**, размер шага — **50 ЕП**  
   - *Трофеи для Т9.3* — стартовая цена **200 ЕП**, размер шага — **50 ЕП**  

**Токены 4.1 (с 13 февраля):**  
- *Стартовая цена* — **500 ЕП**, размер шага — **100 ЕП**  
*Если желающих нет — удаляем.*

**Будущие Токены 5 и Текущие "Печеньки" с Г/М:**  
- *Идут по Консул-Луту.*

**Правила аукциона:**  
- *Аукцион действует только в рейдах на 25 человек.*  
- В рейдах на 10 человек система разрола вещей выбирается статиком самостоятельно.  
- Если ставок на вещь нет, она отдается желающему за базовую ставку или распыляется.
- В актуальный рейдах аукцион проводится по мейн спеку. Если на мейн спек нет ставок, то проводится по офф-спеку.`;
                        break;
                    default:
                        titleMessage = "Неизвестный раздел";
                        responseMessage = 'Неизвестный раздел.';
                        break;
                }

                const embedInfo = {
                    color: 0xe74c3c,
                    title: `**${titleMessage}**`,
                    description: responseMessage,
                }

                await interaction.reply({
                    content: "",
                    embeds: [embedInfo],
                    ephemeral: true
                });

                fs.readFile(readedRulesPath, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading file:', err);
                        return;
                    }

                    const jsonData = JSON.parse(data);
                    jsonData.users ||= {};

                    if (!jsonData.users[interaction.user.id]) {
                        jsonData.users[interaction.user.id] = { interactions: 0 };
                    }
                    jsonData.users[interaction.user.id].interactions += 1;

                    jsonData.interactions = (jsonData.interactions || 0) + 1;

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

                    const embed = interaction.message.embeds[0];
                    embed.fields[0].value = (jsonData.interactions || 0) + 1;

                    embed.fields = embed.fields.map(field => {
                        if (field.name === "Любит почитать:") {
                            field.value = `<@${topUser.id}> (${topUser.interactions} раз)`;
                        }
                        return field;
                    });

                    interaction.message.edit({ embeds: [embed] });
                });
            }
        }

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