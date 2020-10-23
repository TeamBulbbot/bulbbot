# Command list

## Botinfo

| Command 	| Aliases                                             	| Description                                                     	| Usage              	| Bot Permssion                             |
|---------	|-----------------------------------------------------	|-----------------------------------------------------------------	|--------------------	|------------------------------------------	|
| about | bot, license, privacypolicy, support, invite, github | Get some basic information about the bot | ``about`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL | 
| help | N/A | Super basic helper command so people know which commands exists | ``help <section>`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL | 
| ping | 🏓 | Returns bot and API latency in milliseconds. | ``ping`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL | 
| uptime | status | Get the current uptime of the bot | ``uptime`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL | 

## Configuration

| Command 	| Aliases                                             	| Description                                                     	| Usage              	| Bot Permssion                             |
|---------	|-----------------------------------------------------	|-----------------------------------------------------------------	|--------------------	|------------------------------------------	|
| configure | cfg, setting, config | Modify settings on the bot in your guild | ``configure <setting> <new value>`` | SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 
| guild | guildconfig, guilddata | Get the configuration list of the guild | ``guild`` | SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 

## Information

| Command 	| Aliases                                             	| Description                                                     	| Usage              	| Bot Permssion                             |
|---------	|-----------------------------------------------------	|-----------------------------------------------------------------	|--------------------	|------------------------------------------	|
| serverinfo | server | Gets some useful information about the server | ``serverinfo`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 
| userinfo | info, whois | Gets some useful information about a user/bot | ``userinfo <user>`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 

## Miscellaneous

| Command 	| Aliases                                             	| Description                                                     	| Usage              	| Bot Permssion                             |
|---------	|-----------------------------------------------------	|-----------------------------------------------------------------	|--------------------	|------------------------------------------	|
| jumbo | N/A | Sends a bigger version of the given emotes  | ``jumbo <emotes>`` | ATTACH_FILES, SEND_MESSAGES, VIEW_CHANNEL | 
| remind | reminder, r, 🕰️ | Reminds you something | ``remind <duration> <reminder>`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL, ADD_REACTIONS, USE_EXTERNAL_EMOJIS | 

## Developer

| Command 	| Aliases                                             	| Description                                                     	| Usage              	| Bot Permssion                             |
|---------	|-----------------------------------------------------	|-----------------------------------------------------------------	|--------------------	|------------------------------------------	|
| analytics | N/A | Analytics about the bot | ``analytics`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL | 
| createdocs | N/A | Create the new docs for the bot | ``createdocs`` | SEND_MESSAGES, VIEW_CHANNEL | 
| eval | N/A | Eval some javascript code | ``eval <code>`` | SEND_MESSAGES, VIEW_CHANNEL | 
| inviteinfo | N/A | Currently in development | ``inviteinfo <invite code>`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL | 
| reverseinvite | N/A | Currently in development | ``reverseinvite <url>`` | EMBED_LINKS, SEND_MESSAGES, VIEW_CHANNEL | 

## Moderation

| Command 	| Aliases                                             	| Description                                                     	| Usage              	| Bot Permssion                             |
|---------	|-----------------------------------------------------	|-----------------------------------------------------------------	|--------------------	|------------------------------------------	|
| ban | terminate | Bans a user from the guild | ``ban <user> [reason]`` | SEND_MESSAGES, VIEW_CHANNEL, BAN_MEMBERS, USE_EXTERNAL_EMOJIS | 
| infraction | inf | Infraction logs | ``infraction <option>`` | SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 
| kick | N/A | Kicks a user from the guild | ``kick <user> [reason]`` | SEND_MESSAGES, VIEW_CHANNEL, KICK_MEMBERS, USE_EXTERNAL_EMOJIS | 
| mute | N/A | Mutes a user from the guild | ``mute <user> [reason]`` | SEND_MESSAGES, VIEW_CHANNEL, MANAGE_ROLES, USE_EXTERNAL_EMOJIS | 
| purge | clear | Purge X amount of message in channel | ``purge <amount>`` | SEND_MESSAGES, VIEW_CHANNEL, MANAGE_MESSAGES, USE_EXTERNAL_EMOJIS, ATTACH_FILES | 
| softban | cleanban | Bans and unbans a user from a guild clearing their messages | ``softban <user> [reason]`` | SEND_MESSAGES, VIEW_CHANNEL, BAN_MEMBERS, USE_EXTERNAL_EMOJIS | 
| unban | pardon | Unban a user from the server | ``unban <user> [reason]`` | SEND_MESSAGES, VIEW_CHANNEL, MANAGE_MESSAGES, USE_EXTERNAL_EMOJIS, BAN_MEMBERS | 
| unmute | N/A | Unmutes a user from the guild | ``unmute <user> [reason]`` | SEND_MESSAGES, VIEW_CHANNEL, MANAGE_ROLES, USE_EXTERNAL_EMOJIS | 
| usermanagement | usermgmt, um | Moderation command on user | ``usermanagement <user>`` | SEND_MESSAGES, VIEW_CHANNEL, MANAGE_ROLES, USE_EXTERNAL_EMOJIS, KICK_MEMBERS, BAN_MEMBERS | 
| warn | N/A | Warns a user inside of guild | ``warn <user> [reason]`` | SEND_MESSAGES, VIEW_CHANNEL, USE_EXTERNAL_EMOJIS | 
