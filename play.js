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
          
          
  //FUNCTION:
  function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();
    
    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect() || message.channel.send("Song ended. Leaving voice channel..")
    })

} //NOTE FUNCTIONNYA KASIH DIATAS COMMANDNYA
