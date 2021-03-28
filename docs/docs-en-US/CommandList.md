# Bulbbot Command List

Now that you're a Command master you'll need some commands to use ;) Here's the full list sorted by categories

### minArgs and maxArgs

minArgs and maxArgs values are expressed in the MIN/MAX column as `MIN:MAX`

**Example:** The ban command requires at least `1` argument and allows an `infinite` amount of arguments after that as a reason. It's **MIN/MAX**
value would be `1:-1`

> **MIN/MAX value of `N/A` means the command will reject all arguments by default**

## Bot

|    Command    |       Aliases        | Default Clearance |                        Description                        |      Usage      |    Arguments     | MIN/MAX |
| :-----------: | :------------------: | :---------------: | :-------------------------------------------------------: | :-------------: | :--------------: | :-----: |
|    github     | `code`, `sourcecode` |         0         |          Return a link to the github repository           |     !github     |       N/A        |   0:0   |
|     help      |         N/A          |         0         |       Gets useful information about a given command       | !help <command> | `command:string` |  1:-1   |
|    invite     |      `support`       |         0         | Returns the invite link for the bot and the support guild |     !invite     |       N/A        |   0:0   |
|    license    |         N/A          |         0         | Returns the license file for the Github repo for the bot  |    !license     |       N/A        |   0:0   |
|     ping      |         N/A          |         0         |           Return the Websocket and API latency            |      !ping      |       N/A        |   0:0   |
| privacypolicy |         N/A          |         0         |          Returns the privacy policy for the bot           | !privacypolicy  |       N/A        |   0:0   |
|    uptime     |         N/A          |         0         |           Return the current uptime of the bot            |     !uptime     |       N/A        |   0:0   |

## Configuration

|  Command  |              Aliases               | Default Clearance |             Description              |       Usage        |    Arguments     | MIN/MAX |
| :-------: | :--------------------------------: | :---------------: | :----------------------------------: | :----------------: | :--------------: | :-----: |
|  automod  |                `am`                |        75         | Configure the automod in your server | !automod <action>  | `action:string`  |  1:-1   |
| configure | `cfg`, `conf`, `config`, `setting` |        75         |   Configure the bot in your server   | !configure <part>  | `setting:string` |  1:-1   |
| override  |                `ov`                |        75         |     Configure command overrides      | !override <action> | `action:Action`  |  1:-1   |
| settings  |            `overrides`             |        75         |    Get the settings for the guild    |     !settings      |       N/A        |   0:0   |

## Information

|    Command    |         Aliases         | Default Clearance |                         Description                         |          Usage           |      Arguments      | MIN/MAX |
| :-----------: | :---------------------: | :---------------: | :---------------------------------------------------------: | :----------------------: | :-----------------: | :-----: |
|    badges     |           N/A           |         0         |         Returns the amount of badges in the server          |         !badges          |         N/A         |   0:0   |
|   charinfo    |           N/A           |         0         |      Returns information about the characters provided      |  !charinfo <characters>  | `characters:string` |  1:-1   |
| discordstatus |        `dstatus`        |         0         |      Gets the latest information about Discord status       |      !discordstatus      |         N/A         |   0:0   |
|  inviteinfo   |          `inv`          |         0         | Returns some useful info about a guild from the invite link | !inviteinfo <invitecode> | `invitecode:string` |  1:-1   |
|  serverinfo   |        `server`         |        50         |   Returns some useful information about the current Guild   |       !serverinfo        |         N/A         |   0:0   |
|   userinfo    | `whois`, `info`, `user` |        50         |            Returns some useful info about a user            |     !userinfo [user]     |         N/A         |   0:1   |

## Miscellaneous

|  Command  | Aliases | Default Clearance |                 Description                  |         Usage          |      Arguments      | MIN/MAX |
| :-------: | :-----: | :---------------: | :------------------------------------------: | :--------------------: | :-----------------: | :-----: |
|  avatar   |   N/A   |         0         |         Gets a users avatar picture          |     !avatar [user]     |     `user:User`     |   0:1   |
|   jumbo   |   N/A   |         0         | Sends a bigger version of the given emote(s) |     !jumbo <emote>     |    `emote:Emote`    |  1:-1   |
|  search   |   N/A   |         0         |  Search the current guild for a given query  |    !search <query>     |   `query:string`    |  1:-1   |
| snowflake |   N/A   |         0         |   Gets information about a given snowflake   | !snowflake <snowflake> | `snowflake:integer` |  1:-1   |

## Moderation

|    Command     |           Aliases           | Default Clearance |                            Description                             |                     Usage                      |              Arguments               | MIN/MAX |
| :------------: | :-------------------------: | :---------------: | :----------------------------------------------------------------: | :--------------------------------------------: | :----------------------------------: | :-----: |
|      ban       |     `terminate`, `yeet`     |        50         |              Bans or forcebans a user from the guild               |              !ban <user> [reason]              |             `user:User`              |  1:-1   |
|     deafen     |             N/A             |        50         |     Deafens a member from a Voice Channel they're connected to     |            !deafen <user> [reason]             |             `user:User`              |  1:-1   |
|   infraction   |            `inf`            |        50         |                          Infraction Desc                           |              !infraction <action>              |           `action:string`            |  1:-1   |
|      kick      |             N/A             |        50         |                    Kicks a user from the guild                     |            !kick <member> [reason]             |           `member:Member`            |  1:-1   |
|    lockdown    |             N/A             |        50         |                  Locks/unlocks a selected channel                  |           !lockdown <channel> <lock>           |  `channel:Channel`, `lock:boolean`   |   2:2   |
|    multiban    |           `mban`            |        50         |           Bans or forcebans multiple people from a guild           |     !multiban <user> <user2>.... [reason]      |             `user:User`              |  1:-1   |
|   multikick    |           `mkick`           |        50         |                 Kicks multiple people from a guild                 |   !multikick <member> <member2>.... [reason]   |           `member:Member`            |  1:-1   |
|   multiunban   |          `munban`           |        50         |                Unbans multiple people from a guild                 |     !multiunban <user> <user2>... [reason]     |             `user:User`              |  1:-1   |
| multivoicekick |          `mvckick`          |        50         | Kicks multiple members from the Voice Channel they're connected to | !multivoicekick <member> <member2>... [reason] |           `member:Member`            |  1:-1   |
|   multiwarn    |           `mwarn`           |        50         |                   Warns multiple selected users                    |   !multiwarn <member> <member2>... [reason]    |             `user:User`              |  1:-1   |
|      mute      |         `tempmute`          |        50         |                      Mutes the selected user                       |       !mute <member> <duration> [reason]       | `member:Member`, `duration:Duration` |  2:-1   |
|     purge      |            clear            |        50         |                    Purges messages from a chat                     |                !purge <amount>                 |           `amount:integer`           |  1:-1   |
|    slowmode    |             N/A             |        50         |              Sets a slowmode to the selected channel               |         !slowmode [channel] <duration>         |         `duration:Duration`          |   1:2   |
|    softban     |         `cleanban`          |        50         |               Bans and unbans a user from the guild                |            !softban <user> [reason]            |             `user:User`              |  1:-1   |
|    tempban     | `tempterminate`, `tempyeet` |        50         |        Temporarily bans or forcebans a user from the guild         |      !tempban <user> <duration> [reason]       |   `user:User`, `duration:Duration`   |  2:-1   |
|     unban      |          `pardon`           |        50         |                    Unban a user from the guild                     |             !unban <user> [reason]             |             `user:User`              |  1:-1   |
|    undeafen    |             N/A             |        50         |    Undeafens a member from a Voice Channel they're connected to    |           !undeafen <user> [reason]            |           `member:Member`            |  1:-1   |
|     unmute     |             N/A             |        50         |                      Unutes the selected user                      |           !unmute <member> [reason]            |           `member:Member`            |  1:-1   |
|  verification  |             N/A             |        75         |               Changes the server verification level                |             !verification <level>              |             `level:int`              |  1:-1   |
|   voicekick    |          `vckick`           |        50         |     Kicks a member from the Voice Channel they're connected to     |          !voicekick <member> [reason]          |           `member:Member`            |  1:-1   |
|      warn      |             N/A             |        50         |                  Warns the selected guild member                   |            !warn <member> [reason]             |           `member:Member`            |  1:-1   |
