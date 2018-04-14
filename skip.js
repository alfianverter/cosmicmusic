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
          if (!server.dispatcher) return message.channel.send("Nothing played right now. | No song in queue")
