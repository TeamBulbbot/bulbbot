const Guild = require("../../models/guild");
const Discord = require("discord.js");
const clc = require("cli-color");
const Logger = require("../../utils/other/winston");

function sendEmbed(client, channelId, text) {
	if (channelId === "") return;
	let embed = new Discord.MessageEmbed()
		.setColor(process.env.COLOR)
		.setTimestamp()
		.setTitle(text);
	client.channels.cache.get(channelId).send(embed);
}

module.exports = {
	Change_Mod_Action: async (client, guildId, channelId) => {
		Guild.findOneAndUpdate(
			{ guildID: guildId },
			{
				$set: { "logChannels.modAction": channelId },
			},
			function (err) {
				if (err) Logger.error(err);
			}
		);
		sendEmbed(client, channelId, "This channel is setup to log mod actions");
	},
	Change_Message: async (client, guildId, channelId) => {
		Guild.findOneAndUpdate(
			{ guildID: guildId },
			{
				$set: { "logChannels.message": channelId },
			},
			function (err) {
				if (err) Logger.error(err);
			}
		);
		sendEmbed(
			client,
			channelId,
			"This channel is setup to log message updates"
		);
	},
	Change_Role: async (client, guildId, channelId) => {
		Guild.findOneAndUpdate(
			{ guildID: guildId },
			{
				$set: { "logChannels.role": channelId },
			},
			function (err) {
				if (err) Logger.error(err);
			}
		);
		sendEmbed(client, channelId, "This channel is setup to log role updates");
	},
	Change_Member: async (client, guildId, channelId) => {
		Guild.findOneAndUpdate(
			{ guildID: guildId },
			{
				$set: { "logChannels.member": channelId },
			},
			function (err) {
				if (err) Logger.error(err);
			}
		);
		sendEmbed(client, channelId, "This channel is setup to log member updates");
	},
	Change_Channel: async (client, guildId, channelId) => {
		Guild.findOneAndUpdate(
			{ guildID: guildId },
			{
				$set: { "logChannels.channel": channelId },
			},
			function (err) {
				if (err) Logger.error(err);
			}
		);
		sendEmbed(
			client,
			channelId,
			"This channel is setup to log channel changes"
		);
	},
	Change_Join_Leave: async (client, guildId, channelId) => {
		Guild.findOneAndUpdate(
			{ guildID: guildId },
			{
				$set: { "logChannels.join_leave": channelId },
			},
			function (err) {
				if (err) Logger.error(err);
			}
		);
		sendEmbed(
			client,
			channelId,
			"This channel is setup to log join leave logs"
		);
	},
};
