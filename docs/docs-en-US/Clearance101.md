# Bulbbot Clearance Levels 101
Instead of the traditional Trusted, Moderator and Administrator roles most other bots use for gating commands Bulbbot uses a **clearance level system** which in theory allows you to use a 100 different roles to gate commands.

## Default clearance levels
Each command has a certain clearance level set by default. These indicate whether the command can be used by everyone, trusted users, mods or admins. Each of these roles has a corresponding clearance level:
- Everyone (`0`)
- Trusted (`25`)
- Moderator (`50`)
- Administrator (`75`)
- Guild Owner only (`100`)

### Special cases
The guild roles themselves can also affect clearance. A user with a role that has the `ADMINISTRATOR` permission granted will automatically be set a clearance level of `75` even if their roles are not configured as **Administrator**
- Guild roles with the `ADMINISTRATOR` permission will be automatically granted a clearance level of `75`
- The Guild owner will automatically be granted a clearance level of `100`

### Custom clearance
To view all of the custom clearance levels set in your server run the following command:
``!override list`` - this will return all of the custom clearance levels for both roles and commands and if the commands are enabled or disabled.

## Custom Role Clearance
If you would like to add a custom clearance level tied to a role run use the following command:
``!override create role <role id> <clearance>`` - this will set the new clearance level to that role.

To modify or edit an existing roles clearance run the following command:
``!override edit role <role id> <new clearance>`` - this will set the clearance level to the new level.

And to remove a roles clearance run the following command:
``!override remove role <role id>`` - this will delete the record of that clearance tied to that role.

## Custom Command Clearance
If you would like to change the default clearance level of a command run the following command:
``!override create command <command name> <clearance>`` - this will set the commands clearance level to that clearance.

To modify or edit an existing commands clearance run the following command:
``!override edit command <command name> <new clearance>`` - this will set the clearance level to the new level.

And to remove a commands clearance run the following command:
``!override remove command <command name>`` - this will delete the record of that clearance tied to that role.

To disable commands from usage in your server run the following command:
``!override disable <command name>`` - this will disable the command for **everyone** in the server.

To enable a command run the following command:
``!override enable <command name>`` - this will enable the command in the server.
