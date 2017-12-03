const Discord = require('discord.js');
const client = new Discord.Client();
//client.commands = new Discord.Collection();

client.on("ready", () => {
    console.log("UltraBot Armed and Ready to Fire!")
    client.user.setGame("u:help | Version Alpha 0.1.4");
});

client.on("message", async message => {
    if (message.author.bot) return;
    let array = message.content.split(" ");
    var prefix = 'u:'; // choose prefix
    let command = array[0];
    let args = array.slice(1);

//Call the JSON file for the help command and require fs
const fs = require("fs")
const commandList = JSON.parse(fs.readFileSync("Storage/commandList.json", "utf8"));

//Hi command
    if (command === prefix + "hi") {
        message.channel.send(`Hi, ${message.author}!`);
    }

//Ping / Pong command
    if (command === prefix + "ping") {
        message.channel.send(`:ping_pong: Pong! Your current ping is ${Math.round(client.ping)}ms.`);
    }

//Help command
    if (command === prefix + "help") {
        const embed = new Discord.RichEmbed()
            .setColor(0x0d2dbc)
        let commandsFound = 0;
        for (var cmd in commandList) {
            if (commandList[cmd].group.toUpperCase() === 'USER') {
              commandsFound++
              embed.addField(`${commandList[cmd].name}`, `**Description:** ${commandList[cmd].desc} **Usage:** ${prefix + commandList[cmd].usage}`);
            }

    }
    embed.setFooter(`Version Alpha 0.1.4`)
    embed.setDescription(`**${commandsFound} commands found** - <> means required, [] means optional`)
    message.author.send({embed})
    message.channel.send({embed: {
      color: 0x0d2dbc,
      description: `**Check your DMs ${message.author}!**`
    }})

}

//Say command
    if (command === prefix + "say") {
        const sayMessage = args.join(" ");
        message.delete().catch(O_o=>{});
        message.channel.send(sayMessage);
    }

//Kick command
if(command === prefix + "kick") {
    if(!message.member.roles.some(r=>["Owner", "Administrator", "Mod"].includes(r.name)) )
    return message.reply("Sorry, you don't have permissions to use this!");
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable)
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
      let reason = args.slice(1).join(' ');
      if(!reason)
        return message.reply("Please indicate a reason for the kick!");
        await member.kick(reason)
        .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
      message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

}

//Ban command
if(command === prefix + "ban") {
    if(!message.member.roles.some(r=>["Owner", "Administrator"].includes(r.name)) )
    return message.reply("Sorry, you don't have permissions to use this!");
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable)
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the ban!");
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }

//Purge command
if(command === prefix + "purge") {
    if(!message.member.roles.some(r=>["Owner", "Administrator", "Mod"].includes(r.name)) )
    return message.reply("Sorry, you don't have permissions to use this!");
    const deleteCount = parseInt(args[0], 10);
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
    return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }

});
client.login("Token hidden, sorry!");
