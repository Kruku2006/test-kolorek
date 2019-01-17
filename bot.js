const Discord = require("discord.js");
const bot = new Discord.Client();

const prefix = '$'
const kolory = ["#5782ff", "#ff00ff", "#ff3300", "#ff9900", "#00ffff", "#990099"];

const token = `bQJT7l91JkIWlNCAtDlw27ywwjr0PbPc`;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

bot.on("ready", () => {
    console.log(`${bot.user.username} jest gotowy!`);
    bot.user.setActivity(`Kolorowanie`, {type: "PLAYING"});
});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "DM") return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);  

    if (cmd === prefix+`help`) {
        return message.channel.send(`Jestem botem stworzonym tylko do komendy ${prefix}zakoloruj\n*i jeszcze mozesz sprawdzic ping uzywajac ${prefix}ping*`);
    }
    if (cmd === prefix+`ping`) {
        return message.channel.send("Ping bota (API): "+bot.ping+"ms");
    }
    if (cmd === prefix+`zakoloruj`) {
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("Nie masz uprawnien do tej komendy!");
        
        let colorrole = message.guild.roles.find(`name`, `[KL] ${message.author.name}`);
        if (!colorrole) {
            try {
                colorrole = await message.guild.createRole({
                    name: `[KL] ${message.author.username}`,
                    permissions: []
                });
            } catch (e) {
                return message.channel.send(e);
            }
        }

        async function zmienianie()
        {
            if (!message.guild.roles.find(`name`, `[KL] ${message.author.username}`)) return;

            for (var i=1; i<=kolory.length; i++) {
                colorrole.edit({color: kolory[i]});
                await sleep(5000);
            }
            zmienianie();
        }
        await(message.member.addRole(colorrole.id).catch(err => message.channel.send(err)));
        message.channel.send("Kolorowanie rozpoczeto! aby anulowac wpisz "+prefix+"stop");
        zmienianie();
    }
    if (cmd === prefix+`stop`) {
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("Nie masz uprawnien do tej komendy!");
        let colorrole = message.guild.roles.find(`name`, `[KL] ${message.author.username}`);
        colorrole.delete().catch();
        message.channel.send("Kolorowanie zostalo zakonczone.");
    }
});

bot.login(token);
