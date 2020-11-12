# Command list

## Botinfo
| Command 	| Aliases 	| Default Clearance Level                             	| Description                                                     	| Usage              	| Bot Permssion                            	|
|---------	|---------	|-----------------------------------------------------	|-----------------------------------------------------------------	|--------------------	|------------------------------------------	|
| about | bot, license, privacypolicy, support, invite, github| 0 | Get some basic information about the bot | ``about`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL | 
| help | N/A| 0 | Super basic helper command so people know which commands exists | ``help <section>`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL | 
| ping | 🏓| 0 | Returns bot and API latency in milliseconds. | ``ping`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL | 
| uptime | status| 0 | Get the current uptime of the bot | ``uptime`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL | 

## Configuration
| Command 	| Aliases 	| Default Clearance Level                             	| Description                                                     	| Usage              	| Bot Permssion                            	|
|---------	|---------	|-----------------------------------------------------	|-----------------------------------------------------------------	|--------------------	|------------------------------------------	|
| configure | cfg, setting, config| 75 | Modify settings on the bot in your guild | ``configure <setting> <new value>`` | SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 
| guild | guildconfig, guilddata| 50 | Get the configuration list of the guild | ``guild`` | SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 
| override | N/A| 75 | Configure the overrides. | ``override <category> <sub category>`` | SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 
| overrides | N/A| 50 | Get the overrides for the giving category | ``overrides <category>`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 

## Information
| Command 	| Aliases 	| Default Clearance Level                             	| Description                                                     	| Usage              	| Bot Permssion                            	|
|---------	|---------	|-----------------------------------------------------	|-----------------------------------------------------------------	|--------------------	|------------------------------------------	|
| charinfo | N/A| 0 | Get information about given unicode characters. | ``charinfo <characters>`` | SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 
| discordstatus | dstatus| 50 | Gets the latest information about Discord status | ``discordstatus`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 
| serverinfo | server| 50 | Gets some useful information about the server | ``serverinfo`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 
| userinfo | info, whois| 0 | Gets some useful information about a user/bot | ``userinfo <user>`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 

## Miscellaneous
| Command 	| Aliases 	| Default Clearance Level                             	| Description                                                     	| Usage              	| Bot Permssion                            	|
|---------	|---------	|-----------------------------------------------------	|-----------------------------------------------------------------	|--------------------	|------------------------------------------	|
| jumbo | N/A| 0 | Sends a bigger version of the given emote(s) | ``jumbo <emotes>`` | ATTACH_FILES, SEND_MESSAGES, VIEW_CHANNEL | 
| remind | reminder, r, 🕰️| 0 | Reminds you of something | ``remind <duration> <reminder>`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL, ADD_REACTIONS, USE_EXTERNAL_EMOJIS | 

## Moderation
| Command 	| Aliases 	| Default Clearance Level                             	| Description                                                     	| Usage              	| Bot Permssion                            	|
|---------	|---------	|-----------------------------------------------------	|-----------------------------------------------------------------	|--------------------	|------------------------------------------	|
| ban | terminate, yeet| 50 | Bans a user from the guild | ``ban <user> [reason]`` | SEND_MESSAGES, VIEW_CHANNEL, BAN_MEMBERS, USE_EXTERNAL_EMOJIS | 
| infraction | inf| 50 | Infraction related commands | ``infraction <option>`` | SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 
| kick | N/A| 50 | Kicks a user from the guild | ``kick <user> [reason]`` | SEND_MESSAGES, VIEW_CHANNEL, KICK_MEMBERS, USE_EXTERNAL_EMOJIS | 
| multiban | mban| 50 | Bans a couple of users inside of guild | ``multiban <user> [user2]...[reason]`` | SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 
| multikick | mkick| 50 | Kicks a couple of users inside of guild | ``multikick <user> [user2]...[reason]`` | SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 
| multiwarn | mwarn| 50 | Warns a couple of users inside of guild | ``multiwarn <user> [user2]...[reason]`` | SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 
| mute | N/A| 50 | Mutes a user from the guild | ``mute <user> <duration> [reason]`` | SEND_MESSAGES, VIEW_CHANNEL, MANAGE_ROLES, USE_EXTERNAL_EMOJIS | 
| purge | clear| 50 | Purge X amount of message in channel | ``purge <amount>`` | SEND_MESSAGES, VIEW_CHANNEL, MANAGE_MESSAGES, USE_EXTERNAL_EMOJIS, ATTACH_FILES | 
| slowmode | | 50 | Sets a slowmode to a chosen channel | ``slowmode <channel> <seconds>`` | SEND_MESSAGES, VIEW_CHANNEL, MANAGE_CHANNELS | 
| softban | cleanban| 50 | Bans and unbans a user from a guild clearing their messages | ``softban <user> [reason]`` | SEND_MESSAGES, VIEW_CHANNEL, BAN_MEMBERS, USE_EXTERNAL_EMOJIS | 
| tempban | tempyeet| 50 | Bans a user from the guild | ``tempban <user> <duration> [reason]`` | SEND_MESSAGES, VIEW_CHANNEL, BAN_MEMBERS, USE_EXTERNAL_EMOJIS | 
| unban | pardon| 50 | Unban a user from the server | ``unban <user> [reason]`` | SEND_MESSAGES, VIEW_CHANNEL, MANAGE_MESSAGES, USE_EXTERNAL_EMOJIS, BAN_MEMBERS | 
| unmute | N/A| 50 | Unmutes a user from the guild | ``unmute <user> [reason]`` | SEND_MESSAGES, VIEW_CHANNEL, MANAGE_ROLES, USE_EXTERNAL_EMOJIS | 
| usermanagement | usermgmt, um| 50 | Moderation command on user | ``usermanagement <user>`` | SEND_MESSAGES, VIEW_CHANNEL, MANAGE_ROLES, USE_EXTERNAL_EMOJIS, KICK_MEMBERS, BAN_MEMBERS | 
| verification | | 50 | Changes the server verification level | ``verification <verificationLevel>`` | SEND_MESSAGES, VIEW_CHANNEL, MANAGE_GUILD | 
| warn | N/A| 50 | Warns a user inside of guild | ``warn <user> [reason]`` | SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 
