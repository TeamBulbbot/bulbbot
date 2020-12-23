const Event = require("../structures/Event");
const { SendEventLog } = require("../utils/moderation/log");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(oldChannel, newChannel) {
		let msg = "**Channel update:** ";

		// name change
		if (oldChannel.name !== newChannel.name) msg += `<#${newChannel.id}> name was changed from \`#${oldChannel.name}\` to \`#${newChannel.name}\`\n`;
		// type change
		if (oldChannel.type !== newChannel.type) msg += `<#${newChannel.id}> type was changed from \`${oldChannel.type}\` to \`${newChannel.type}\`\n`;
		//  nsw change
		if (oldChannel.nsfw !== newChannel.nsfw) {
			if (newChannel.nsfw) msg += `<#${newChannel.id}> nsfw was \`enabled\`\n`;
			else msg += `<#${newChannel.id}> nsfw was \`disabled\`\n`;
		}

		SendEventLog(this.client, newChannel.guild, "channel", msg);
	}
};

/*
// was moved (a bit spam)
if (oldChannel.rawPosition !== newChannel.rawPosition)
	console.log(`Chanel update in <#${newChannel.id}> position was moved from \`${oldChannel.rawPosition}\` to \`${newChannel.rawPosition}\``);
*/
