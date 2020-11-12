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
			new_value,
			cl_commandName,
			cL_CL,
			age,
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

		//Configure
		response = response.replace(/({new_value})/g, new_value);
		return response;
	},
};
