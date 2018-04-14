const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const opusscript = require("opusscript");
const ffmpeg = require("ffmpeg");
const prefix = "c.";
const token = `${process.env.BOT_TOKEN}`;

var bot = new Discord.Client();

var servers = {};

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();
    
    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect() || message.channel.send("Song ended. Leaving voice channel..")
    })

}

bot.on("ready", async () => {
    console.log(`Logged in as : ${bot.user.tag}`)
    console.log(`${bot.user.tag} is ready!`)
});

bot.on("message", async message => {
    if (message.channel.type === `dm`) return;

    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) return;
    
    var args = message.content.substring(prefix.length).split(" ")

    switch (args[0].toLocaleLowerCase()) {
        case "play":
        var urlsong = args.slice(1).join(' ')
        if (!args[1]) {
            message.channel.send(`Please provide a link!`)
            return;
        }
        if (!message.member.voiceChannel) {
            message.channel.send(`Please join a voice channel!`)
            return;
        }

        if (!servers[message.guild.id]) servers[message.guild.id] = {
            queue: []
        }
        
        var server = servers[message.guild.id];

        server.queue.push(args[1]);

        if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
            play(connection, message);
            message.channel.send(`Playing : <${urlsong}>`)
        }) 
        break;

        case "skip":
        var server = servers[message.guild.id];

        if (server.dispatcher) { 
          try {
              server.dispatcher.end()
          } catch (e) {
              console.log(e)
          } finally {
              message.channel.send("Skipped 1 song.")
          }
          return
        }
        if (!server.dispatcher) {
         message.channel.send("Nothing played right now. | No song in queue"), (err) => {
             if (err) message.channel.send("Nothing played right now. | No song in queue")
         }
        return;    
        }
        break;

        case "stop":
        var server = servers[message.guild.id];

        if (message.guild.voiceConnection) {
            message.guild.voiceConnection.disconnect();
        }
        break;
    }
});

bot.login(token)