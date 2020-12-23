const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(oldChannel, newChannel) {
		// TODO
		// If you are bored one day check for perm changes

		// name change
		if (oldChannel.name !== newChannel.name)
			console.log(`Chanel update in <#${newChannel.id}> name was changed from \`#${oldChannel.name}\` to \`#${newChannel.name}\``);
		// type change
		else if (oldChannel.type !== newChannel.type)
			console.log(`Chanel update in <#${newChannel.id}> type was changed from \`${oldChannel.type}\` to \`${newChannel.type}\``);
		//  nsw change
		else if (oldChannel.nsfw !== newChannel.nsfw) {
			if (newChannel.nsfw) console.log(`Chanel update in <#${newChannel.id}> nsfw was \`enabled\``);
			else console.log(`Chanel update in <#${newChannel.id}> nsfw was \`disabled\``);
		}
	}
};

/*
// was moved (a bit spam)
if (oldChannel.rawPosition !== newChannel.rawPosition)
	console.log(`Chanel update in <#${newChannel.id}> position was moved from \`${oldChannel.rawPosition}\` to \`${newChannel.rawPosition}\``);
*/
