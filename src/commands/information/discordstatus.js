const Discord = require("discord.js");
const axios = require("axios");

const Translator = require("../../utils/lang/translator");

module.exports = {
	name: "discordstatus",
	aliases: ["dstatus"],
	category: "information",
	description: "Gets the latest information about Discord status",
	usage: "discordstatus",
	clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "VIEW_CHANNEL"],
	userPermissions: [],
	clearanceLevel: 0,
	run: async (client, message, _args) => {
		const url = "https://discordstatus.com/api/v2/incidents.json";
		const latency = Math.floor(new Date().getTime() - message.createdTimestamp);
		const apiLatency = Math.round(client.ws.ping);

		axios.get(url).then(function (res) {
			message.channel
				.send(Translator.Translate("global_loading"))
				.then((m) => {
					const incident = res.data.incidents[0];
					let msg = "";

					msg += `**Incident: ** ${incident.name} (${incident.id})\n`;
					msg += `**Status: ** ${incident.status}\n`;
					msg += `**Link: ** [Link](${incident.shortlink})\n`;
					msg += `**Started: ** ${incident.created_at}\n`;
					msg += `**Latest Update: ** ${incident.updated_at}\n`;

					const inciUpdates = incident.incident_updates[0];
					if (inciUpdates !== null) {
						msg += "\n\n**Updates**\n ";

						msg += `**Status Update: ** ${inciUpdates.status}\n`;
						msg += `**Information:** ${inciUpdates.body}\n`;
						msg += `**Date:** ${inciUpdates.created_at}\n`;
					}

					embed = new Discord.MessageEmbed()
						.setColor(process.env.COLOR)
						.setTitle("Discord Status Updates")
						.setTimestamp()
						.setFooter(
							`Executed by ${message.author.username}#${message.author.discriminator}`,
							message.author.avatarURL()
						)
						.setDescription(
							`**Latency:** ${latency} ms\n**API Latency:** ${apiLatency} ms\n\n**Latest incident**\n${msg}`
						);

					m.edit("", { embed });
				})
				.catch(function (err) {
					console.log(err);
				});
		});
	},
};
