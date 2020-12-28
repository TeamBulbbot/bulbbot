# Bulbbot Command List

Now that you're a Command master you'll need some commands to use ;) Here's the full list sorted by categories

### minArgs and maxArgs

minArgs and maxArgs values are expressed in the MIN/MAX column as `MIN:MAX`

**Example:** The ban command requires at least `1` argument and allows an `infinite` amount of arguments after that as a reason. It's **MIN/MAX**
value would be `1:-1`

> **MIN/MAX value of `N/A` means the command will reject all arguments by default**

## Bot

| Command | Aliases | Default Clearance |                        Description                        |  Usage   | Arguments | MIN/MAX |
| :-----: | :-----: | :---------------: | :-------------------------------------------------------: | :------: | :-------: | :-----: |
| github  |   N/A   |         0         |          Return a link to the GitHub repository           | !github  |    N/A    |   N/A   |
| invite  |   N/A   |         0         | Returns the invite link for the bot and the support guild | !invite  |    N/A    |   N/A   |
| license |   N/A   |         0         | Returns the license file for the Github repo for the bot  | !license |    N/A    |   N/A   |
|  ping   |   N/A   |         0         |           Return the Websocket and API latency            |  !ping   |    N/A    |   N/A   |
| uptime  |   N/A   |         0         |           Return the current uptime of the bot            | !uptime  |    N/A    |   N/A   |

## Configuration

WIP

## Information

|  Command   |         Aliases         | Default Clearance |                         Description                         |         Usage          |    Arguments    | MIN/MAX |
| :--------: | :---------------------: | :---------------: | :---------------------------------------------------------: | :--------------------: | :-------------: | :-----: |
| inviteinfo |          `inv`          |        50         | Returns some useful info about a guild from the invite link | !inviteinfo \<invite\> | `invite:string` |   1:1   |
| serverinfo |        `server`         |        50         |   Returns some useful information about the current Guild   |      !serverinfo       |       N/A       |   N/A   |
|  userinfo  | `info`, `user`, `whois` |        50         |            Returns some useful info about a user            |    !userinfo [user]    |   `user:User`   |   0:1   |

## Miscellaneous

|  Command  | Aliases | Default Clearance |                Description                 |          Usage           |       Arguments       | MIN/MAX |
| :-------: | :-----: | :---------------: | :----------------------------------------: | :----------------------: | :-------------------: | :-----: |
|  avatar   |   M/A   |         0         |        Gets a users avatar picture         |      !avatar [user]      |      `user:User`      |   0:1   |
|  search   |   N/A   |         0         | Search the current guild for a given query |    !search \<query\>     |    `query:string`     |  1:-1   |
| snowflake |   N/A   |         0         |  Gets information about a given snowflake  | !snowflake \<snowflake\> | `snowflake:Snowflake` |  1:-1   |

## Moderation

|   Command    |       Aliases       | Default Clearance |                         Description                          |                    Usage                     |                     Arguments                     | MIN/MAX |
| :----------: | :-----------------: | :---------------: | :----------------------------------------------------------: | :------------------------------------------: | :-----------------------------------------------: | :-----: |
|     ban      | `terminate`, `yeet` |        50         |           Bans or forcebans a user from the guild            |            !ban \<user\> [reason]            |           `user:User`, `reason:string`            |  1:-1   |
|    deafen    |         N/A         |        50         |  Deafens a member from a Voice Channel they're connected to  |          !deafen \<user\> [reason]           |           `user:User`, `reason:string`            |  1:-1   |
|     kick     |         N/A         |        50         |                 Kicks a user from the guild                  |          !kick \<member\> [reason]           |         `member:Member`, `reason:string`          |  1:-1   |
|   lockdown   |         N/A         |        50         |               Locks/unlocks a selected channel               |          !lock \<channel\> \<lock\>          |         `channel:Channel`, `lock:boolean`         |   1:1   |
|   multiban   |       `mban`        |        50         |        Bans or forcebans multiple people from a guild        |   !multiban \<user\> \<user2\>... [reason]   |           `user:User`, `reason:string`            |  1:-1   |
|  multikick   |       `mkick`       |        50         |              Kicks multiple people from a guild              | !multiban \<member\> \<member2\>... [reason] |         `member:Member`, `reason:string`          |  1:-1   |
|  multiunban  |      `munban`       |        50         |             Unbans multiple people from a guild              |  !multiunban \<user\> \<user2\>... [reason]  |           `user:User`, `reason:string`            |  1:-1   |
|  multikick   |       `mkick`       |        50         |                Warns multiple selected users                 | !multiban \<member\> \<member2\>... [reason] |         `member:Member`, `reason:string`          |  1:-1   |
|    purge     |       `clear`       |        50         |                 Purges messages from a chat                  |              !purge \<amount\>               |                 `amount:integer`                  |   1:1   |
|   slowmode   |         N/A         |        50         |           Sets a slowmode to the selected channel            |       !slowmode \<duration\> [channel]       |      `duration:Duration`, `channel:Channel`       |   1:2   |
|   softban    |     `cleanban`      |        50         |            Bans and unbans a user from the guild             |          !softban \<user\> [reason]          |           `user:User`, `reason:string`            |  1:-1   |
|   tempban    |         N/A         |        50         |     Temporarily bans or forcebans a user from the guild      |   !tempban \<user\> \<duration\> [reason]    | `user:User`, `duration:Duration`, `reason:string` |  2:-1   |
|    unban     |      `pardon`       |        50         |                 Unban a user from the guild                  |           !unban \<user\> [reason]           |           `user:User`, `reason:string`            |  1:-1   |
|   undeafen   |         N/A         |        50         | Undeafens a member from a Voice Channel they're connected to |        !undeafen \<member\> [reason]         |         `member:Member`, `reason:string`          |  1:-1   |
| verification |         N/A         |        75         |            Changes the server verification level             |           !verification \<level\>            |                  `level:integer`                  |   1:1   |
|  voicekick   |      `vckick`       |        50         |  Kicks a member from the Voice Channel they're connected to  |        !voicekick \<member\> [reason]        |         `member:Member`, `reason:string`          |  1:-1   |
|     warn     |         N/A         |        50         |               Warns the selected guild member                |          !warn \<member\> [reason]           |         `member:Member`, `reason:string`          |  1:-1   |
