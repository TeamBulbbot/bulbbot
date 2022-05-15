// en-US source of truth
// Edits to en-US should only be made to this file. The JSON file will be overwritten with
// the contents of this file during compilation and pre-commit

export default {
	global_executed_by: "Executed by {{user.tag}}",
	global_execution_cancel: "{{emote_fail}} Command execution cancelled",
	global_missing_permissions: "{{emote_lock}} Missing permission(s)",
	global_command_disabled: "{{emote_lock}} This command has been disabled by the server administrators",
	global_not_invoked_by_user: "{{emote_lock}} You did not invoke this command",
	global_missing_permissions_bot: "The bot is missing crucial permissions to perform this command. Please check the bot's permissions.\n{{missing}}",
	global_cannot_convert: "{{emote_fail}} Cannot convert `{{arg_provided}}` to `{{arg_expected}}`.\n{{emote_wrench}} **Correct usage:** {{usage}}",
	global_cannot_convert_special: "{{emote_fail}} Cannot convert `{{arg_provided}}` to `{{arg_expected}}`.",
	global_not_found: "{{emote_fail}} Could not find the specified {{type}}. Cannot convert `{{arg_provided}}` to `{{arg_expected}}`.\n{{emote_wrench}} **Correct usage:** {{usage}}",
	global_not_found_types: {
		user: "user",
		member: "member",
		role: "role",
		channel: "channel",
		message: "message",
		lang: "language",
		cmd: "command",
		emoji: "emoji",
		int: "integer",
		bool: "boolean",
		snowflake: "snowflake",
	},

	global_mod_action_log: "{{action}} by: {{moderator.tag}} ({{moderator.id}}) | Target: {{target.tag}} ({{target.id}}) | Reason: {{reason}}",
	global_logging_mod: "`[{{timestamp}}]` {{emoji}} **{{target.tag}}** `({{target.id}})` has been {{action}} by **{{moderator.tag}}** `({{moderator.id}})` for **{{reason}}** `[#{{infraction_id}}]`",
	global_logging_mod_unban_auto:
		"`[{{timestamp}}]` {{emoji}} **{{target.tag}}** `({{target.id}})` has been {{action}} by **{{moderator.tag}}** `({{moderator.id}})` after their temporary punishment expired.`[#{{infraction_id}}]`",
	global_logging_mod_temp:
		"`[{{timestamp}}]` {{emoji}} **{{target.tag}}** `({{target.id}})` has been {{action}} until **{{until}}** by **{{moderator.tag}}** `({{moderator.id}})` for **{{reason}}** `[#{{infraction_id}}]`",
	mod_action_types: {
		warn: "warned",
		mute: "muted",
		unmute: "unmuted",
		auto_unmute: "automatically unmuted",
		kick: "kicked",
		manual_kick: "manually kicked",
		ban: "banned",
		force_ban: "force-banned",
		soft_ban: "soft-banned",
		temp_ban: "temp-banned",
		pool_ban: "pool-banned",
		manual_ban: "manually banned",
		unban: "unbanned",
		auto_unban: "automatically unbanned",
		manual_unban: "manually unbanned",
		deafen: "deafened",
		undeafen: "undeafened",
		voice_kick: "voice-kicked",
		nick_change: "changed",
		nick_remove: "removed",
	},

	global_logging_command: "`[{{timestamp}}]` {{emote_wrench}} **{{user.tag}}** `({{user.id}})` has executed `{{command}}` in <#{{channel}}>.",
	global_no_reason: "No reason given",
	global_loading: "{{emote_loading}} Loading...",
	global_not_in_voice: "{{emote_fail}} User **{{target.tag}}** `({{target.id}})` is currently not connected to any Voice Channels!",
	global_error: {
		unknown: "{{emote_fail}} An unknown error has occurred, please try again later or if the issue persists contact the developers at {{discord_invite}}",
		automod_items_length_undefined: "{{emote_fail}} An error occurred while attempting to parse the selected Automod items. No Automod items have been provided or Automod items length is undefined.",
	},
	global_words: {
		none: "none",
		some: "some",
		all: "all",
		and: "and",
		or: "or",
		yes: "yes",
		no: "no",
		confirm: "confirm",
		cancel: "cancel",
	},

	global_cannot_action_self: "{{emote_warn}} You cannot perform this action on yourself!",
	global_cannot_action_owner: "{{emote_warn}} You cannot perform this action on the server owner!",
	global_cannot_action_role_equal: "{{emote_warn}} You cannot perform this action on **{{target.tag}}** `({{target.id}})` as you do not have a higher role than them!",
	global_cannot_action_role_equal_bot: "{{emote_warn}} I cannot perform this action on **{{target.tag}}** `({{target.id}})` as I don't have a higher role than them!",
	global_cannot_action_bot_self: "{{emote_warn}} You cannot perform this action on the bot!",

	global_premium_only: "This is a premium command. Become a Patron and get access to this command and other exclusive features at <https://www.patreon.com/bulbbot>",

	event_interaction_dm_command: "{{emote_warn}} Slash commands cannot be used in DMs.",

	event_message_args_unexpected: "{{emote_warn}} Unexpected argument `{{argument}}`. Expected `{{arg_expected}}` got `{{arg_provided}}`.\n{{emote_wrench}} **Correct usage:** {{usage}}",
	event_message_args_missing: "{{emote_warn}} Missing argument `{{argument}}`. Expected `{{arg_expected}}`.\n{{emote_wrench}} **Correct usage:** {{usage}}",
	event_message_args_missing_list: "{{emote_warn}} Unexpected argument `{{argument}}`. Expected `{{arg_expected}}`.\n{{emote_wrench}} **Correct arguments:** {{argument_list}}",
	event_message_edit:
		"{{emote_edit}} Message from **{{user_tag}}** `({{user.id}})` has been updated in <#{{channel.id}}>\n`ID (channel-message): {{channel.id}}-{{message.id}}`\n**B:** {{before}}\n**A:** {{after}}",
	event_message_edit_special: "{{emote_edit}} Message from **{{user_tag}}** `({{user.id}})` has been updated in <#{{channel.id}}>\n`ID (channel-message): {{channel.id}}-{{message.id}}`",
	event_message_delete:
		"{{emote_trash}} Message from **{{user_tag}}** `({{user.id}})` has been deleted in <#{{channel.id}}>.\n`ID (channel-message): {{channel.id}}-{{message.id}}`\n{{content}}{{reply}}{{sticker}}{{attachment}}",
	event_message_delete_moderator:
		"{{emote_trash}} Message from **{{user_tag}}** `({{user.id}})` has been deleted in <#{{channel.id}}> by **{{moderator.tag}}** `({{moderator.id}})`.\n`ID (channel-message): {{channel.id}}-{{message.id}}`\n{{content}}{{reply}}{{sticker}}{{attachment}}",
	event_message_delete_special: "{{emote_trash}} Message from **{{user_tag}}** `({{user.id}})` has been deleted in <#{{channel.id}}>.\n`ID (channel-message): {{channel.id}}-{{message.id}}`",

	event_change: "`{{part}}` from `{{before}}` to `{{after}}`",
	event_update_server: "{{emote_wrench}} **{{moderator.tag}}** `({{moderator.id}})` has updated the server settings. Changes:\n> {{changes}}",
	event_update_role: "{{emote_wrench}} The <@&{{role}}> role has been updated. Changes:\n> {{changes}}",
	event_update_role_moderator: "{{emote_wrench}} **{{moderator.tag}}** `({{moderator.id}})` has updated the <@&{{role}}> role. Changes:\n> {{changes}}",
	event_update_channel: "{{emote_wrench}} **{{moderator.tag}}** `({{moderator.id}})` has updated the **{{type}}** <#{{channel.id}}>.\nChanges:\n> {{changes}}",
	event_update_scheduled_event: "{{emote_wrench}} **{{moderator.tag}}** `({{moderator.id}})` has updated the scheduled event **{{event.name}}**.\nChanges:\n> {{changes}}",

	event_channel_create: "{{emote_add}} A new **{{type}}** has been created <#{{channel.id}}> (`{{channel.id}}`).",
	event_channel_create_moderator: "{{emote_add}} A new **{{type}}** has been created by **{{moderator.tag}}** `({{moderator.id}})` <#{{channel.id}}> (`{{channel.id}}`).",
	event_channel_delete: "{{emote_remove}} The **#{{channel.name}}** (`{{channel.id}}`) **{{type}}** has been deleted.",
	event_channel_delete_moderator: "{{emote_remove}} The **#{{channel.name}}** (`{{channel.id}}`) **{{type}}** has been deleted by **{{moderator.tag}}** `({{moderator.id}})`.",

	event_thread_create:
		"{{emote_add}} A new thread has been created **{{thread.name}}** <#{{thread.id}}> `({{thread.id}})` by <@{{thread.ownerId}}> in <#{{thread.parentId}}> and will be archived at **{{thread_archive}}**",
	event_thread_delete: "{{emote_remove}} Thread **{{thread.name}}** `({{thread.id}})` by <@{{thread.ownerId}}> in <#{{thread.parentId}}> has been removed",

	event_invite_create: "{{emote_add}} **{{invite.inviter.tag}}** `({{invite.inviter.id}})` has created a new invite `{{invite.code}}`, expires **{{expire_time}}**, max uses **{{max_uses}}**",
	event_invite_delete: "{{emote_remove}} **{{moderator.tag}}** `({{moderator.id}})` has deleted an invite `{{invite.code}}`",

	event_role_create: "{{emote_add}} A new role has been created <@&{{role.id}}> (`{{role.id}}`)",
	event_role_delete: "{{emote_remove}} The **@{{role.name}}** (`{{role.id}}`) role has been deleted.",

	event_guild_scheduled_event_create_both:
		"{{emote_add}} A new scheduled event has been created **{{scheduledEvent.name}}** (`{{scheduledEvent.id}}`)\nDescription: {{scheduledEvent.description}}\nWill start <t:{{scheduledEvent.scheduledStartTimestamp}}> and end <t:{{scheduledEvent.scheduledEndTimestamp}}>",
	event_guild_scheduled_event_create_timestamp:
		"{{emote_add}} A new scheduled event has been created **{{scheduledEvent.name}}** (`{{scheduledEvent.id}}`)\nWill start <t:{{scheduledEvent.scheduledStartTimestamp}}> and end <t:{{scheduledEvent.scheduledEndTimestamp}}>",
	event_guild_scheduled_event_create_description:
		"{{emote_add}} A new scheduled event has been created **{{scheduledEvent.name}}** (`{{scheduledEvent.id}}`)\nDescription: {{scheduledEvent.description}}",
	event_guild_scheduled_event_create_none: "{{emote_add}} A new scheduled event has been created **{{scheduledEvent.name}}** (`{{scheduledEvent.id}}`)",
	event_guild_scheduled_event_create_moderator_both:
		"{{emote_add}} A new scheduled event has been created by **{{moderator.tag}}** `({{moderator.id}})` **{{scheduledEvent.name}}** (`{{scheduledEvent.id}}`)\nDescription: {{scheduledEvent.description}}\nWill start <t:{{scheduledEvent.scheduledStartTimestamp}}> and end <t:{{scheduledEvent.scheduledEndTimestamp}}>",
	event_guild_scheduled_event_create_moderator_timestamp:
		"{{emote_add}} A new scheduled event has been created by **{{moderator.tag}}** `({{moderator.id}})` **{{scheduledEvent.name}}** (`{{scheduledEvent.id}}`)\nWill start <t:{{scheduledEvent.scheduledStartTimestamp}}> and end <t:{{scheduledEvent.scheduledEndTimestamp}}>",
	event_guild_scheduled_event_create_moderator_description:
		"{{emote_add}} A new scheduled event has been created by **{{moderator.tag}}** `({{moderator.id}})` **{{scheduledEvent.name}}** (`{{scheduledEvent.id}}`)\nDescription: {{scheduledEvent.description}}",
	event_guild_scheduled_event_create_moderator_none:
		"{{emote_add}} A new scheduled event has been created by **{{moderator.tag}}** `({{moderator.id}})` **{{scheduledEvent.name}}** (`{{scheduledEvent.id}}`)",
	event_guild_scheduled_event_delete: "{{emote_remove}} The scheduled event **{{scheduledEvent.name}}** (`{{scheduledEvent.id}}`) has been deleted",
	event_guild_scheduled_event_delete_moderator:
		"{{emote_remove}} The scheduled event **{{scheduledEvent.name}}** (`{{scheduledEvent.id}}`) has been deleted by **{{moderator.tag}}** `({{moderator.id}})`",

	event_member_joined: "{{emote_join}} **{{user.tag}}** `({{user.id}})` has joined the server.\n**Account created:** <t:{{user_age}}:R>",
	event_member_leave: "{{emote_leave}} **{{user.tag}}** `({{user.id}})` has left the server.\n**Account joined:** <t:{{user_joined}}:f>",
	event_member_leave_roles: "{{emote_leave}} **{{user.tag}}** `({{user.id}})` has left the server.\n**Account joined:** <t:{{user_joined}}:f>\n**Roles:** {{user_roles}}",

	event_member_update_nickname: "{{emote_warn}} **{{user.tag}}** `({{user.id}})` has changed their nickname from `{{before}}` to `{{after}}`",
	event_member_update_nickname_moderator:
		"{{emote_warn}} Nickname of **{{target.tag}}** `({{target.id}})` has been {{action}} from `{{nick_old}}` to `{{nick_new}}` by **{{moderator.tag}}** `({{moderator.id}})`",
	event_member_remove_nickname: "{{emote_warn}} **{{user.tag}}** `({{user.id}})` has removed their nickname (was: `{{before}}`)",
	event_member_remove_nickname_moderator: "{{emote_warn}} Nickname {{action}} from **{{target.tag}}** `({{target.id}})` by **{{moderator.tag}}** `({{moderator.id}})`",
	event_member_update_role_add: "{{emote_add}} The **{{role.name}}** Role has been added to **{{user.tag}}** `({{user.id}})`",
	event_member_update_role_add_moderator: "{{emote_add}} The **{{role.name}}** Role has been added to **{{user.tag}}** `({{user.id}})` by **{{moderator.tag}}** `({{moderator.id}})`",
	event_member_update_role_remove: "{{emote_remove}} The **{{role.name}}** Role has been removed from **{{user.tag}}** `({{user.id}})`",
	event_member_update_role_remove_moderator: "{{emote_remove}} The **{{role.name}}** Role has been removed from **{{user.tag}}** `({{user.id}})` by **{{moderator.tag}}** `({{moderator.id}})`",

	channel_types: {
		GUILD_TEXT: "text channel",
		DM: "direct message channel",
		GUILD_VOICE: "voice channel",
		GROUP_DM: "group DM",
		GUILD_CATEGORY: "channel category",
		GUILD_NEWS: "announcement channel",
		GUILD_STORE: "store channel",
		GUILD_NEWS_THREAD: "announcement channel thread",
		GUILD_PUBLIC_THREAD: "thread",
		GUILD_PRIVATE_THREAD: "private thread",
		GUILD_STAGE_VOICE: "stage channel",
		UNKNOWN: "channel",
	},

	config_button_enable: "Enable",
	config_button_disable: "Disable",
	config_button_back: "Back",

	config_main_header: "{{emote_wrench}} Bulbbot Configuration for **{{guild.name}}** `({{guild.id}})`",
	config_main_options: {
		language: "Language",
		actions_on_info: "Actions on Info",
		manual_nickname_inf: "Manual nickname infractions",
		prefix: "Prefix",
		roles_on_leave: "Roles on Leave",
		automod: "Automod",
		autorole: "Autorole",
		logging: "Logging",
		quick_reasons: "Quick Reasons",
		timezone: "Timezone",
	},
	config_main_options_descriptions: {
		language: "Change the language of the bot",
		actions_on_info: "Configure the actions on info setting",
		manual_nickname_inf: "Changing a users nickname results in a infraction",
		prefix: "Configure the prefix of the bot",
		roles_on_leave: "Configure the roles on leave setting",
		automod: "Configure the Automod settings",
		autorole: "Configure the autorole setting",
		logging: "Configure the logging modules",
		quick_reasons: "Add or remove quick reasons",
		timezone: "Configure the timezone for logging",
	},
	config_main_placeholder: "Select a category to modify",

	config_actions_on_info_header: "{{emote_wrench}} **Actions on Info Configuration**\n{{emote_edit}}*This setting controls whether or not action buttons will be displayed when you info a user.*",
	config_roles_on_leave_header: "{{emote_wrench}} **Roles on Leave Configuration**\n{{emote_edit}}*This setting controls whether or not the bot will log user's roles when they leave the server.*",
	config_manual_nickname_infractions:
		"{{emote_wrench}} **Manual nickname infractions Configuration**\n{{emote_edit}}*This settings controls wheter or not the bot will track infractions on users when a mod gives them an nickname*",

	config_language_header: "{{emote_wrench}} **Language Configuration**\n{{emote_edit}}*This setting controls the language that the bot will use when responding to commands.*",
	config_language_placeholder: "Select a language",
	config_language_success: "{{emote_success}} Successfully changed the server language to `{{language}}`",

	config_autorole_header:
		"{{emote_wrench}} **Autorole Configuration**\n{{emote_edit}}*This setting controls whether or not the bot will automatically assign a role to a user when they join the server.*",
	config_autorole_placeholder: "Current Autorole: {{role.name}} ({{role.id}})",
	config_autorole_placeholder_disabled: "Currently disabled",
	config_autorole_prompt: "{{emote_wrench}} Please enter the role ID/mention the new Autorole",
	config_autorole_disable: "{{emote_success}} Successfully disabled the Autorole",
	config_autorole_success: "{{emote_success}} Successfully changed the Autorole to **{{role.name}}**",
	config_autorole_button_change: "Change Autorole",
	config_autorole_button_disable: "Disable Autorole",

	config_quick_reasons_header: "{{emote_wrench}} **Quick Reasons Configuration**\n{{emote_edit}}*This setting controls all the quick reasons shown when using context commands.*",
	config_quick_reasons_placeholder_select: "Select quick reason(s) to remove",
	config_quick_reason_placeholder_none: "No quick reasons found",
	config_quick_reason_prompt: "{{emote_wrench}} Please enter the new quick reason",
	config_quick_reason_too_long: "{{emote_fail}} The quick reason cannot be longer than **100** characters",
	config_quick_reason_already_exists: "{{emote_fail}} The quick reason `{{reason}}` already exists in the list",
	config_quick_reason_success: "{{emote_success}} Successfully added the quick reason `{{reason}}` to the list",
	config_quick_reason_remove_success: "{{emote_success}} Successfully removed the selected quick reason(s) from the list",
	config_quick_reason_button_add: "Add quick reason",
	config_quick_reason_button_remove: "Remove quick reason(s)",

	config_timezone_header: "{{emote_wrench}} **Timezone Configuration**\n{{emote_edit}}*This setting controls the timezone that the bot will use when sending logs.*",
	config_timezone_placeholder: "Current Timezone: {{timezone}}",
	config_timezone_success: "{{emote_success}} Successfully changed the server timezone to `{{timezone}}`",

	config_prefix_header: "{{emote_wrench}} **Prefix Configuration**\n{{emote_edit}}*This setting controls the prefix that the bot will listen to when using commands.*",
	config_prefix_prompt: "{{emote_wrench}} Please enter a new prefix",
	config_prefix_reset: "{{emote_success}} The prefix has been reset to `!`",
	config_prefix_success: "{{emote_success}} Successfully changed the server prefix to `{{prefix}}`",
	config_prefix_too_long: "{{emote_fail}} The selected prefix is too long. Please make the prefix shorter than 255 characters.",
	config_prefix_button_change: "Change Prefix",
	config_prefix_button_reset: "Reset Prefix",

	config_automod_main_header: "{{emote_wrench}} **Automod Configuration**\n{{emote_edit}}*This setting controls the AutoMod settings for the server.*",
	config_automod_main_add_remove_description: "Add or remove an item from the selected Automod category.",
	config_automod_main_enable_disable_description: "Enable or disable the selected Automod category.",
	config_automod_main_limit_description: "Set the limit for the selected Automod category.",
	config_automod_main_punishment_description: "Set the punishment for the selected Automod category.",
	config_automod_main_overview_description: "View the current settings for the Automod.",

	config_automod_add_remove_header: "{{emote_wrench}} **Automod Configuration**\n{{emote_edit}}*This setting allows you to add and remove items from the automod database.*",
	config_automod_add_remove_remove_success: "{{emote_success}} Successfully removed the selected Automod Item(s) from the database",
	config_automod_add_remove_add_success: "{{emote_success}} Successfully added the selected Automod Item to the database",
	config_automod_add_remove_add_prompt: "{{emote_wrench}} Please enter the new Automod Item",
	config_automod_add_remove_add_already_exists: "{{emote_fail}} The Automod Item `{{item}}` already exists in the database",
	config_automod_add_remove_add_invalid_channel: "{{emote_fail}} Invalid automod item `{{item}}` for immune channels",
	config_automod_add_remove_add_invalid_user: "{{emote_fail}} Invalid automod item `{{item}}` for immune users",
	config_automod_add_remove_add_invalid_role: "{{emote_fail}} Invalid automod item `{{item}}` for immune roles",
	config_automod_add_remove_button_add: "Add Items",
	config_automod_add_remove_button_remove: "Remove Items",

	config_automod_limit_header: "{{emote_wrench}} **Automod Limit Configuration**\n{{emote_edit}}*This setting controls the limits and timeouts for AutoMod checks.*",
	config_automod_limit_update_prompt: "{{emote_wrench}} Please enter the new limit in the following format: `items/seconds`",
	config_automod_limit_update_invalid_format: "{{emote_fail}} The format of the limit is invalid. Please use the following format: `items/seconds`",
	config_automod_limit_update_seconds_too_short: "{{emote_fail}} The seconds value is too short. Please use a value greater than **3 seconds**",
	config_automod_limit_update_seconds_too_long: "{{emote_fail}} The seconds value is too long. Please use a value less than **30 seconds**",
	config_automod_limit_update_items_too_short: "{{emote_fail}} The items value is too short. Please use a value greater than **1 item**",
	config_automod_limit_button_update: "Update Limit",

	config_enable_disable_header: "{{emote_wrench}} **Enable/Disable Configuration**\n{{emote_edit}}*This setting controls whether Automod and its corresponding checks are enabled or disabled.*",
	config_enable_disable_enable_success: "{{emote_success}} Successfully enabled the Automod",
	config_enable_disable_disable_generic_success: "{{emote_success}} Successfully disabled the Automod",
	config_enable_disable_disable_success: "{{emote_success}} Successfully disabled the selected Automod category.",

	config_punishment_header: "{{emote_wrench}} **Punishment Configuration**\n{{emote_edit}}*This setting controls the punishment that the bot will use when an AutoMod check is violated.*",
	config_punishment_select_placeholder: "Select a punishment",
	config_punishment_description_log: "Sends an alert in the selected AutoMod logging channel.",
	config_punishment_description_warn: "Sends an alert in the logs and warns the user.",
	config_punishment_description_kick: "Kicks the user whilst keeping all their messages.",
	config_punishment_description_ban: "Bans the user whilst removing all their messages.",

	config_logging_success: "{{emote_success}} Successfully started logging `{{logging_type}}` in <#{{channel}}>",
	config_logging_remove: "{{emote_success}} Successfully removed logging for `{{logging_type}}` from <#{{channel}}>",
	config_logging_remove_all: "{{emote_success}} Successfully removed all logging types from all channels",
	config_logging_unable_to_send_messages: "{{emote_fail}} The bot is missing crucial permissions to send messages in <#{{channel}}>",
	configure_logging_banpool_with_still_pools:
		"{{emote_fail}} You are unable to disable the logging for banpools as you are still in **{{amount}}** banpool(s). Leave or delete them to remove the logging fully.",
	config_logging_all_confirm: "{{emote_warn}} Are you sure you want to add all logging types to <#{{channel}}>? This will begin to log all loggable actions in the selected channel.",
	config_logging_all_remove: "{{emote_warn}} Are you sure you want to remove all logging types from all channels in this server?",

	config_automod_overview_header: "{{emote_wrench}} **Automod Overview**",

	override_clearance_more_than_100: "{{emote_warn}} Clearance level cannot be higher than **100**",
	override_clearance_0_confirmation:
		"{{emote_warn}} You're about to set a restricted command to clearance level `0`.\n\nThis will allow __**anyone**__ to use this command. Are you sure you want to do this?",
	override_clearance_higher_than_self: "{{emote_warn}} You cannot create an override with clearance level higher than your clearance level.",

	override_nonexistent_command: "{{emote_fail}} No command override with the name of `{{command}}` was found! You need to create an override first in order to edit it.",
	override_nonexistent_role: "{{emote_fail}} No role override for the `{{role}}` Role was found. You need to create an override first in order to edit it.",

	override_create_success: "{{emote_success}} Successfully created an override with clearance level of `{{clearance}}`",
	override_already_exists:
		"{{emote_fail}} An override with that name already exists!\n{{emote_wrench}} **Tip:** If you're trying to edit an override use `!configure override edit <part> <name> <clearance>`",

	override_disable_success: "{{emote_success}} Successfully disabled command `{{command}}`",
	override_enable_success: "{{emote_success}} Successfully enabled command `{{command}}`",

	override_edit_success: "{{emote_success}} Successfully updated the override with a new clearance level of `{{clearance}}`",

	override_remove_success: "{{emote_success}} Successfully removed the selected override.",

	automod_less_than_zero: "{{emote_warn}} {{limit}} cannot be less than `0`",

	automod_not_in_database: "{{emote_warn}} Item(s) `{{item}}` has/have not yet been added to the AutoMod database.",
	automod_already_in_database: "{{emote_warn}} Item(s) `{{item}}` is/are already in the AutoMod database.",
	automod_add_success: "{{emote_success}} Successfully added item(s) `{{item}}` to `{{category}}`.",
	automod_remove_success: "{{emote_success}} Successfully removed item(s) `{{item}}` from `{{category}}`",
	automod_invalid_input: "{{emote_warn}} Item `{{item}}` was not a valid input for that automod category",

	automod_updated_limit: "{{emote_success}} Successfully set the limit for `{{category}}` to `{{limit}}`",
	automod_updated_punishment: "{{emote_success}} Successfully updated the punishment for `{{category}}` to `{{punishment}}`",

	automod_enabled: "{{emote_success}} Successfully enabled AutoMod in the server.",
	automod_disabled: "{{emote_success}} Successfully disabled AutoMod in the server.",
	automod_disabled_part: "{{emote_success}} Successfully disabled AutoMod category `{{category}}`",

	automod_timeout_too_large: "{{emote_fail}} The timeout limit cannot be larger than `30 seconds`",
	automod_timeout_too_small: "{{emote_fail}} The timeout limit cannot be lower than `3 seconds`",

	automod_settings_header: "AutoMod settings for {{guild.name}}",
	automod_settings_enabled: "**Enabled:** {{enabled}}",
	automod_settings_websites: "**Websites:** {{enabled}}\n**Blacklisted websites:** {{websites_blacklist}}",
	automod_settings_invites: "**Invites:** {{enabled}}\n**Whitelisted invites:** {{invites_blacklist}}",
	automod_settings_words: "**Words:** {{enabled}}\n**Blacklisted words:** {{word_blacklist}}\n**Token words:** {{word_token_blacklist}}",
	automod_settings_mentions: "**Mentions:** {{enabled}}\n**Limit:** {{limit}}\n**Timeout:** {{timeout}}s",
	automod_settings_messages: "**Messages:** {{enabled}}\n**Limit:** {{limit}}\n**Timeout:** {{timeout}}s",
	automod_settings_avatarbans: "**Banned avatars**: {{enabled}}\n**Blacklisted avatars:** {{avatar_blacklist}}",
	automod_settings_ignored: "**Immune roles:** {{roles}}\n**Immune channels:** {{channels}}\n**Immune users:** {{users}}",
	automod_settings_footer: "Administrators and roles with 25+ clearance are always immune to AutoMod checks",

	automod_violation_max_messages_reason: "Violated `MAX_MESSAGES` check in #{{channel.name}} ({{amount}}/{{limit}}s)",
	automod_violation_max_messages_log: "{{emote_warn}} **{{target.tag}}** `({{target.id}})` has violated the `MAX_MESSAGES` check in <#{{channel.id}}>. Messages ({{amount}}/{{limit}}s)",
	automod_violation_max_mentions_reason: "Violated `MAX_MESSAGES` check in #{{channel.name}} ({{amount}}/{{limit}}s)",
	automod_violation_max_mentions_log: "{{emote_warn}} **{{target.tag}}** `({{target.id}})` has violated the `MAX_MENTIONS` check in <#{{channel.id}}>. Mentions ({{amount}}/{{limit}}s)",
	automod_violation_words_reason: "Violated `FORBIDDEN_WORDS` check in #{{channel.name}}",
	automod_violation_words_log:
		"{{emote_warn}} **{{target.tag}}** `({{target.id}})` has violated the `FORBIDDEN_WORDS` check in <#{{channel.id}}> | Punishment: **{{punishment}}**\n**Blacklisted words:** `{{words}}`\n```{{message}}```",
	automod_violation_invites_reason: "Violated `DISCORD_INVITE` check in #{{channel.name}}",
	automod_violation_invites_log: "{{emote_warn}} **{{target.tag}}** `({{target.id}})` has violated the `DISCORD_INVITE` check in <#{{channel.id}}> | Punishment: **{{punishment}}**\n```{{message}}```",
	automod_violation_website_reason: "Violated `FORBIDDEN_WEBSITE` check in #{{channel.name}}",
	automod_violation_website_log:
		"{{emote_warn}} **{{target.tag}}** `({{target.id}})` has violated the `FORBIDDEN_WEBSITE` check in <#{{channel.id}}> | Punishment: **{{punishment}}**\n```{{message}}```",
	automod_violation_avatar_reason: "Violated `BANNED_AVATARS` check",
	automod_violation_avatar_log: "{{emote_warn}} **{{user.tag}}** `({{user.id}})` has violated the `BANNED_AVATARS` check | Punishment: **{{punishment}}**\n**Hash:** {{hash}}",

	jumbo_start: "{{emote_loading}} Generating emoji... This might take a while",
	jumbo_too_many: "{{emote_warn}} Too many emojis provided. The bot currently only supports a max of 10 emojis at a time.",
	jumbo_too_many_animated: "{{emote_warn}} You can only use 1 animated emoji at a time.",
	jumbo_invalid: "{{emote_fail}} Invalid emoji(s) provided. Please use a valid emoji.",

	userinfo_embed_id: "**ID:** {{user.id}}\n",
	userinfo_embed_username: "**Username:** {{user.username}}\n",
	userinfo_embed_nickname: "**Nickname:** {{user.nickname}}\n",
	userinfo_embed_profile: "**Profile:** <@{{user.id}}> [`Profile`](https://discord.com/users/{{user.id}})\n",
	userinfo_embed_avatar: "**Avatar URL:** [Link]({{user.avatarUrl}})\n",
	userinfo_embed_bot: "**Bot:** {{user.bot}}\n",
	userinfo_embed_created: "**Account Creation:** <t:{{user_age}}:F> (<t:{{user_age}}:R>)\n",
	userinfo_embed_joined: "**Joined Server:** <t:{{user_joined}}:F> (<t:{{user_joined}}:R>)\n",
	userinfo_embed_premium: "**Boosting since:** <t:{{user_premium}}:F> (<t:{{user_premium}}:R>)\n",
	userinfo_embed_roles: "**Roles:** {{user_roles}}\n",
	userinfo_embed_infractions: "\n\n**Infractions:** {{inf_emote}} **{{user_infractions}}** infraction(s) in this server",
	userinfo_embed_bot_info: "\n**__Bot information__**",
	userinfo_embed_bot_tags: "\n**Tags:** {{tags}}\n",
	userinfo_embed_bot_public: "\n**Public:** {{emoji}}",
	userinfo_embed_bot_requires_code: "\n**Requires Code:** {{emoji}}",
	userinfo_embed_bot_presence_intent: "\n**Presence Intent:** {{emoji}}",
	userinfo_embed_server_memebers_intent: "\n**Server Members Intent:** {{emoji}}",
	userinfo_embed_bot_message_content_intent: "\n**Message Content Intent:** {{emoji}}",

	userinfo_interaction_confirm: "{{emote_warn}} For what reason should **{{target.tag}}** `({{target.id}})` be {{action}}?",

	serverinfo_embed_owner: "{{emote_owner}} **Owner:** <@{{guild.ownerId}}> `{{guild.ownerId}}`\n",
	serverinfo_embed_features: "**Features:**\n{{guild_features}}\n",
	serverinfo_embed_region: "**Region:** {{guild_region}}\n",
	serverinfo_embed_verification: "**Verification level:** {{guild.verificationLevel}}\n",
	serverinfo_embed_created: "**Created at:** <t:{{guild_age}}:F> (<t:{{guild_age}}:R>)",

	serverinfo_server_stats: "**Server stats**",
	serverinfo_channel_stats: "**Channel stats**",
	serverinfo_booster_stats: "**Booster stats**",
	serverinfo_server_stats_total: "Total: **{{guild.memberCount}}**/{{guild.maximumMembers}}\n",
	serverinfo_channel_stats_voice: "{{emote_voice}} **{{guild_voice}}**\n",
	serverinfo_channel_stats_text: "{{emote_text}} **{{guild_text}}**\n",
	serverinfo_channel_stats_announcement: "{{emote_announcement}} **{{guild_announcement}}**\n",
	serverinfo_channel_stats_stage: "{{emote_stage}} **{{guild_stage}}**\n",
	serverinfo_channel_stats_category: "{{emote_category}} **{{guild_category}}**\n",
	serverinfo_booster_tier: "Booster Tier: **{{guild.premiumTier}}**\n",
	serverinfo_booster_boosters: "Boosters: **{{guild.premiumSubscriptionCount}}**\n",
	serverinfo_booster_tier_1: "Emote slots: **100**\nAudio quality: **128** kbps\n",
	serverinfo_booster_tier_2: "Emote slots: **150**\nAudio quality: **256** kbps\nUpload limit: **50 MB**\n",
	serverinfo_booster_tier_3: "Emote slots: **250**\nAudio quality: **384** kbps\nUpload limit: **100 MB**\n",
	serverinfo_roles: "Roles ({{guild_amount_roles}})",
	serverinfo_emotes: "Emotes ({{guild_amount_emotes}})",
	serverinfo_roles_too_many: " and **{{guild_roles_left}}** more",
	serverinfo_emotes_too_many: " and **{{guild_emotes_left}}** more",
	serverinfo_emotes_none: "No emotes",

	action_success: "{{emote_success}} **{{target.tag}}** `({{target.id}})` has been {{action}} for **{{reason}}** `[#{{infraction_id}}]`",
	action_success_temp: "{{emote_success}} **{{target.tag}}** `({{target.id}})` has been {{action}} until **{{until}}** for **{{reason}}** `[#{{infraction_id}}]`",

	action_success_multi: "{{emote_success}} {{full_list}} have been {{action}} for **{{reason}}**",
	action_multi_less_than_2: "{{emote_warn}} Selected less than 2 targets. Executing normal {{action}} instead",
	action_multi_no_targets: "{{emote_fail}} No valid targets were found in your message.\n{{emote_wrench}} **Correct usage:** {{usage}}",
	action_multi_types: {
		ban: "ban",
		kick: "kick",
		unban: "unban",
		warn: "warn",
	},

	crossban_success: "{{emote_success}} Successfully banned **{{target.tag}}** `({{target.id}})` in {{totalBans}}/{{totalPossible}} servers. Banpools used: {{usedPools}}",
	crossban_select_pools: "Select the banpools where you want the user to get banned from.",
	crossban_select_subscribed: "{{amount}} server(s) subscribed",
	crossban_reason:
		"{{emoji}} **{{target.tag}}** `({{target.id}})` has been crossbanned from **{{startedGuild.name}}** `({{startedGuild.id}})` by **{{moderator.tag}}** `({{moderator.id}})` for **{{reason}}** `[#{{infraction_id}}]`",
	crossban_reason_audit: "Crossban from: {{startedGuild.name}} ({{startedGuild.id}}) | Moderator: {{moderator.tag}} ({{moderator.id}}) | Reason: {{reason}}",

	banpool_missing_access_not_found: "{{emote_warn}} That pool does not exists our you are missing access to view it",
	banpool_missing_logging:
		"{{emote_fail}} You need to configure a banpool logging channel before running this command. Use the `configure logging banpool_logs <channel>` command to setup a logging channel.",

	banpool_create_name_exists: "{{emote_warn}} That banpool name already exists, please choose another one",
	banpool_create_log: "{{emote_success}} **{{user.tag}}** `({{user.id}})` created a new banpool with the name **{{name}}**",
	banpool_create_success: "{{emote_success}} Successfully created a new banpool with the name of **{{name}}**",

	banpool_delete_message: "{{emote_warn}} Are you sure you want to delete this banpool? This action __**cannot**__ be undone.",
	banpool_delete_success_log: "{{emote_success}} **{{user.tag}}** `({{user.id}})` deleted a banpool with the name **{{name}}**",
	banpool_delete_success: "{{emote_success}} Successfully deleted the banpool",

	banpool_info_top: "Banpool data from {{name}} | Servers subscribed: {{amountOfServers}}",
	banpool_info_desc: "**Server ID:** `{{guildId}}`\n**Joined:** <t:{{createdAt}}> (<t:{{createdAt}}:R>)",

	banpool_list_desc: "**Name:** `{{name}}`\n**Created:** <t:{{createdAt}}> (<t:{{createdAt}}:R>)",

	banpool_invite_message: "Press the green button to generate your banpool invite code",
	banpool_invite_success_log: "{{emote_success}} **{{user.tag}}** `({{user.id}})` created a banpool invite for **{{name}}** that expires <t:{{expireTime}}:R>",
	banpool_invite_reply:
		"Here is your banpool code `{{code}}` for the **{{name}}** banpool. Keep it safe until the other server uses it to join. It will expire <t:{{expireTime}}:R> and only has **one** use. The other server can use the `banpool join {{code}}` command to join the pool",

	banpool_join_unable_to_find: "{{emote_warn}} Unable to find an invite with that code",
	banpool_join_own_guild: "{{emote_warn}} You can't join your own banpool",
	banpool_join_error: "{{emote_fail}} Something went wrong trying to join the banpool, try again or wait a bit",
	banpool_join_log_og:
		"{{emote_success}} **{{user.tag}}** `({{user.id}})` joined our banpool with the name **{{invite.banpool.name}}** in **{{guild.name}}** `({{guild.id}})` invited by **{{invite.inviter.tag}}** `({{invite.inviter.id}})`",
	banpool_join_log:
		"{{emote_success}} **{{user.tag}}** `({{user.id}})` joined a new banpool from **{{invite.guild.name}}** `({{invite.guild.id}})` with the name **{{invite.banpool.name}}** invited by **{{invite.inviter.tag}}** `({{invite.inviter.id}})`",
	banpool_join_success: "{{emote_success}} Successfully joined the banpool",

	banpool_leave_own: "{{emote_warn}} You are not able to leave your own banpool, you have to delete it instead",
	banpool_leave_not_found: "{{emote_warn}} Unable to find a banpool with that name",
	banpool_leave_log_og: "{{emote_warn}} **{{user.tag}}** `({{user.id}})` left the banpool with the name **{{name}}** in **{{guild.name}}** `({{guild.id}})`",
	banpool_leave_log: "{{emote_warn}} **{{user.tag}}** `({{user.id}})` left the banpool with the name **{{name}}**",
	banpool_leave_success: "{{emote_success}} Successfully left the selected banpool",

	banpool_remove_not_found: "{{emote_warn}} Unable to find a banpool with that name",
	banpool_remove_message: "{{emote_warn}} Are you sure you want to remove that server from the banpool?",
	banpool_remove_log_kicked: "{{emote_warn}} Your server has been removed from the banpool with the name **{{name}}**",
	banpool_remove_log: "{{emote_warn}} **{{user.tag}}** `({{user.id}})` removed the server **{{guild.name}}** `({{guild.id}})` from the banpool **{{name}}**",
	banpool_remove_success: "{{emote_success}} Successfully removed the selected server",

	already_banned: "{{emote_warn}} **{{target.tag}}** `({{target.id}})` has already been banned for `{{reason}}`",
	not_banned: "{{emote_fail}} **{{target.tag}}** `({{target.id}})` is not banned from the server!",
	ban_force_confirm: "{{emote_warn}} **{{target.tag}}** `({{target.id}})` is not currently in the server. Do you want me to force-ban them anyway?",

	messageclear_few_than_0days: "{{emote_fail}} You can't clear messages that are younger than 0 days",
	messageclear_more_than_30days: "{{emote_fail}} You can't clear messages that are older than 30 days. (We already do that automatically)",
	messageclear_found_no_message: "{{emote_fail}} Unable to find any messages within that time period",
	messageclear_about_to_clear: "{{emote_fail}} Are you sure you want to remove **{{messages}}** messages from the database?",
	messageclear_success_delete: "{{emote_success}} Successfully deleted **{{messages}}** messages from the database",

	purge_too_many: "{{emote_fail}} Can only purge a max of 500 messages at a time",
	purge_too_few: "{{emote_fail}} You cannot purge less than 2 messages",
	purge_success: "{{emote_success}} Successfully purged **{{count}}** messages",
	purge_message_failed_to_delete: "{{emote_fail}} Was unable to find the message you wanted to delete. No messages were deleted past this point.",

	prune_invalid_time: "{{emote_fail}} The duration can only be a value between 1 and 30 (days)",
	prune_no_users: "{{emote_fail}} There are no users that can be pruned with those settings",
	prune_confirm_prune: "{{emote_warn}} Are you sure you want to prune **{{prunesize}}** members?",
	prune_successful: "{{emote_success}} Successfully pruned **{{prune}}** members",
	prune_log: "{{emote_success}} **{{user.tag}}** `({{user.id}})` pruned **{{prune}}** members for **{{reason}}** with these settings, days **{{days}}**, roles **{{roles}}**",

	verification_level_select: "Please select your verification level then press save",
	verification_level_success: "{{emote_success}} Server verification level changed to `{{level}}`",

	nickname_success: "{{emote_success}} Nickname of **{{target.tag}}** `({{target.id}})` has been changed from `{{nick_old}}` to `{{nick_new}}` for **{{reason}}** `[#{{infraction_id}}]`",
	nickname_remove_success: "{{emote_success}} Nickname removed from **{{target.tag}}** `({{target.id}})` for **{{reason}}** `[#{{infraction_id}}]`",
	nickname_mod_log:
		"{{emote_warn}} Nickname of **{{target.tag}}** `({{target.id}})` has been {{action}} from `{{nick_old}}` to `{{nick_new}}` by **{{moderator.tag}}** `({{moderator.id}})` for **{{reason}}** `[#{{infraction_id}}]`",
	nickname_remove_mod_log: "{{emote_warn}} Nickname {{action}} from **{{target.tag}}** `({{target.id}})` by **{{moderator.tag}}** `({{moderator.id}})` for **{{reason}}** `[#{{infraction_id}}]`",
	nickname_fail: "{{emote_fail}} Unable to change nickname of **{{target.tag}}** `({{target.id}})`",
	nickname_no_nickname: "{{emote_warn}} **{{target.tag}}** `({{target.id}})` does not have a nickname to remove",
	nickname_same_nickname: "{{emote_warn}} **{{target.tag}}** `({{target.id}})` is already nicknamed `{{nickname}}`",
	nickname_too_long: "{{emote_warn}} Nickname has too many characters (`{{length}}`). Nicknames are limited to 32 characters",

	ping_latency: "Bot latency is **{{latency_bot}}ms**\nWebSocket latency is **{{latency_ws}}ms**",

	uptime_uptime: "The current uptime is **{{uptime}}**",

	license_license:
		"📜 This bot is licensed under the Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) license, for more info see the full license **[here](https://github.com/TeamBulbbot//Bulbbot/blob/master/LICENSE)**",

	privacy_policy: "📜 View the privacy policy of the bot **[here](https://docs.bulbbot.rocks/privacy-policy/)**",

	github_source_code: "{{emote_github}} Bulbbot is a fully open source project. You can find the source code at our GitHub repository **[here](https://github.com/TeamBulbbot//Bulbbot)**",

	invite_content: "Links to invite Bulbbot to your server",

	remind_list_none: "{{emote_warn}} You have not set any reminders",
	remind_placeholder: "No Reminders Selected",
	remind_prompt: "{{emote_remind}} **{{user.tag}}'s** `({{user.id}})` active reminders",
	remind_remove_unable_to_find: "{{emote_fail}} Unable to find a reminder with the ID of `{{reminderId}}`",
	remind_remove_removed: "{{emote_success}} Successfully removed the reminder with the ID of `{{reminderId}}`",
	remind_set_how_to_get_reminded: "How would you like to get reminded?",
	remind_set_dm: "Send reminder in DM",
	remind_set_channel: "Send reminder in channel",
	remind_set_select_dm: "Will notify you in your dms **<t:{{duration}}:R>**",
	remind_set_select_channel: "Will notify you in this channel **<t:{{duration}}:R>**",
	remind_no_permissions: "{{emote_lock}} You cannot view another users reminders!",
	remind_not_found: "{{emote_warn}} Unable to find that reminder",

	remind_desc_header: "Reminder #{{reminder.id}}",
	remind_desc_reason: "**Reminder:** {{reminder.reason}}\n",
	remind_desc_expire: "**Expires:** <t:{{reminder.expireTime}}:R>\n",
	remind_desc_created: "**Created:** <t:{{createdAt}}> [`Link`]({{message}})",

	inviteinfo_error: "{{emote_warn}} Unable to find a server with that invite",
	inviteinfo_groupdm: "{{emote_warn}} We are currently not supporting inviteinfo for group DMs",
	inviteinfo_verification_level: "Verification Level: `{{guild.verificationLevel}}`\n",
	inviteinfo_large: "Large: `{{guild.large}}`\n",
	inviteinfo_code: "Code: `{{invite.code}}`\n",
	inviteinfo_inviter_id: "ID: `{{invite.inviter.id}}`\n",
	inviteinfo_inviter_tag: "Tag: `{{invite.inviter.tag}}`\n",
	inviteinfo_inviter_avatar: "Avatar: [`Link (4096)`]({{user_avatar}})\n",
	inviteinfo_channel_id: "ID: `{{invite.channel.id}}`\n",
	inviteinfo_channel_name: "Name: `{{invite.channel.name}}`\n",
	inviteinfo_channel_nsfw: "NSFW: `{{invite.channel.nsfw}}`\n",

	id_no_found: "{{emote_warn}} Was unable to find any IDs in the provided message.",

	deafen_already_deaf: "{{emote_fail}} **{{target.tag}}** `({{target.id}})` is already deafened!",
	undeafen_not_deaf: "{{emote_fail}} **{{target.tag}}** `({{target.id}})` is not deafened!",

	slowmode_success_remove: "{{emote_success}} Successfully removed slowmode from <#{{channel}}>",
	slowmode_success: "{{emote_success}} Successfully set slowmode in <#{{channel}}> to **{{slowmode}}**",
	slowmode_missing_perms: "{{emote_fail}} The bot is missing permissions to manage <#{{channel}}>",

	duration_invalid_0s: "{{emote_fail}} Duration cannot be lower than **0 seconds**!",
	duration_invalid_6h: "{{emote_fail}} Duration cannot be longer than **6 hours**",
	duration_invalid_28d: "{{emote_fail}} Duration cannot be longer than **28 days**",
	duration_invalid_1y: "{{emote_fail}} Duration cannot be longer than **1 year**!",

	lockdown_locked: "{{emote_locked}} Successfully locked down channel <#{{channel}}>",
	lockdown_unlocked: "{{emote_unlocked}} Successfully unlocked channel <#{{channel}}>",

	mute_muterole_not_found: "{{emote_warn}} This server does not have a mute role configured!\n{{emote_wrench}} **Tip:** You can configure the mute role using the `!configure mute_role` command",
	mute_not_muted: "{{emote_warn}} **{{target.tag}}** `({{target.id}})` is not currently muted!",
	mute_rejoin: "{{emote_warn}} **{{user.tag}}** `({{user.id}})` has rejoined the server before their mute expired and has been automatically muted again.",
	mute_rejoin_reason: "{{user.tag}} ({{user.id}}) has rejoined the server before their mute expired and has been automatically muted again.",
	mute_already_muted: "{{emote_warn}} **{{target.tag}}** `({{target.id}})` is already muted!",
	unmute_confirm:
		"{{emote_warn}} **{{target.tag}}** `({{target.id}})` has not been muted by Bulbbot. Are you sure you want to unmute them?\n*Unmuting a user not muted by Bulbbot will only remove the mute from them without creating an infraction*",
	unmute_special: "{{emote_success}} **{{target.tag}}** `({{target.id}})` has been unmuted for **{{reason}}** ",

	infraction_not_found: "{{emote_fail}} Infraction **#{{infraction_id}}** could not be found!",
	infraction_delete_confirm:
		"{{emote_warn}} Are you sure you want to delete infraction **#{{infraction_id}}**? This action __**cannot**__ be undone.\n**Offender:** {{target.tag}} `({{target.id}})`\n**Moderator:** {{moderator.tag}} `({{moderator.id}})`\n**Reason:** {{reason}}",
	infraction_delete_success: "{{emote_success}} Infraction **#{{infraction_id}}** has been successfully deleted!",
	infraction_info_inf_id: "**Infraction ID:** {{infraction_id}}\n",
	infraction_info_target: "**Target:** {{target.tag}} `({{target.id}})`\n",
	infraction_info_moderator: "**Moderator:** {{moderator.tag}} `({{moderator.id}})`\n",
	infraction_info_created: "**Created:** {{created}}\n",
	infraction_info_active: "**Active:** {{active}}",
	infraction_info_expires: "**Expires:** {{expires}}",
	infraction_info_reason: "\n\n**Reason:** {{reason}}",
	infraction_search_not_found: "{{emote_warn}} **{{target.tag}}** `({{target.id}})` has no infractions!",
	infraction_list_not_found: "{{emote_warn}} This server does not seem to have any infractions!",
	infraction_claim_success: "{{emote_success}} You have claimed responsibility over infraction **#{{infraction_id}}**",
	infraction_update_success: "{{emote_success}} Infraction **#{{infraction_id}}** has been updated!",

	archive_too_much: "{{emote_fail}} You can only request a max of 5000 entries",
	archive_header_format: "Time, channelId-messageId | AuthorTag (AuthorId): Content/Embeds/Stickers/Attachments\n",
	archive_success: "{{emote_success}} Archived data from `{{place}}` found **{{amountOfMessages}}** messages (search amount: {{searchAmount}})",
	archive_no_data_found: "{{emote_warn}} No data was found",
	archive_started_search: "{{emote_loading}} Started the searching this might take a while",

	infraction_interaction_reply: "{{emote_warn}} **{{target.tag}}'s** `({{target.id}})` infractions",
	infraction_interaction_placeholder: "No Infractions Selected",
	infraction_interaction_description: "Click to view more info",

	commands_help: "You can find all the commands Bulbbot offers over **[here](https://docs.bulbbot.rocks/command-list)**",

	help_unable_to_find_command: "`{{commandName}}` is not a valid command, for a full list of commands visit our website <https://docs.bulbbot.rocks/command-list>",
} as const;
