const lang = require("../../languages/en.json");
const Emotes = require("../../emotes.json");

module.exports = {
	Translate: (
		key,
		{
			uptime,
			role,
			role_id,
			guild,
			user,
			user_discriminator,
			user_id,
			moderator,
			moderator_discriminator,
			moderator_id,
			old_value,
			new_value,
			cl_commandName,
			cL_CL,
			age,
			reason,
			time,
			nick_old,
			nick_new,
			channel_id
		} = {}
	) => {
		let response = JSON.parse(JSON.stringify(lang))[key].toString();
		//Uptime
		response = response.replace(/({uptime})/g, uptime);

		//Discord variables
		response = response.replace(/({role})/g, role);
		response = response.replace(/({role_id})/g, role_id);
		response = response.replace(/({guild})/g, guild);
		response = response.replace(/({user})/, user);
		response = response.replace(/({user_discriminator})/, user_discriminator);
		response = response.replace(/({user_id})/, user_id);
		response = response.replace(/({moderator})/, moderator);
		response = response.replace(/({moderator_discriminator})/, moderator_discriminator);
		response = response.replace(/({moderator_id})/, moderator_id);
		response = response.replace(/({reason})/, reason);
		response = response.replace(/({time})/, time);

		//Events
		response = response.replace(/({nick_new})/, nick_new);
		response = response.replace(/({nick_old})/, nick_old);
		response = response.replace(/({channel_id})/, channel_id);
		response = response.replace(/({channel_id})/, channel_id);
		response = response.replace(/({old_value})/g, old_value);

		// Clearance
		response = response.replace(/({cl_commandName})/g, cl_commandName);
		response = response.replace(/({cL_CL})/g, cL_CL);

		//Events
		response = response.replace(/({age})/g, age);

		//Emotes
		response = response.replace(/({emote_loading})/g, Emotes.other.loading);
		response = response.replace(/({emote_warn})/g, Emotes.actions.warn);
		response = response.replace(/({emote_tools})/g, Emotes.other.tools);
		response = response.replace(/({emote_success})/g, Emotes.actions.confirm);
		response = response.replace(/({emote_switchOn})/g, Emotes.other.switchOn);
		response = response.replace(/({emote_switchOff})/g, Emotes.other.switchOff);
		response = response.replace(/({emote_plus})/g, Emotes.other.plus);
		response = response.replace(/({emote_minus})/g, Emotes.other.minus);
		response = response.replace(/({emote_ban})/g, Emotes.actions.ban);
		response = response.replace(/({emote_unban})/g, Emotes.actions.unban);
		response = response.replace(/({emote_kick})/g, Emotes.actions.kick);
		response = response.replace(/({emote_trash})/g, Emotes.other.trash);
		response = response.replace(/({emote_wrench})/g, Emotes.other.wrench);
		response = response.replace(/({emote_mute})/g, Emotes.actions.mute);
		response = response.replace(/({emote_unban})/g, Emotes.actions.unban);

		//Configure
		response = response.replace(/({new_value})/g, new_value);
		return response;
	},
};
