module.exports = {
	Master: async (client, string) => {
		string = await Remove_Mentions(client, string);
		string = await Remove_AtEveryone(string);

		return string;
	},
};

async function Remove_Mentions(client, string) {
	let mentions = string.match(/<@![0-9>]+/g);

	if (mentions === null) return string;

	for (var i = 0; i < mentions.length; i++) {
		let user = await client.users.fetch(mentions[i].replace(/\D/g, ``));

		string = string.replace(
			mentions[i],
			`@${user.username}#${user.discriminator}`
		);
	}
	return string;
}

async function Remove_AtEveryone(string) {
	let mentions = string.match(/@everyone|@here+/g);

	if (mentions === null) return string;

	for (var i = 0; i < mentions.length; i++) {
		if (mentions[i] === "@here")
			string = string.replace(mentions[i], `@\u04BBere`);
		else string = string.replace(mentions[i], `@\u0435veryone`);
	}

	return string;
}
