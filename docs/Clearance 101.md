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

## Custom Role Clearance

## Custom Command Clearance