import prom from "prom-client";
import http from "http";
import url from "url";

const latency = new prom.Gauge({ name: "bulbbot_latency", help: "The bulbbot latency to the Discord Websocket" });
const cachedUsers = new prom.Gauge({ name: "bulbbot_cached_users", help: "The amount of cached users in the memory" });
const guildCount = new prom.Gauge({ name: "bulbbot_guild_count", help: "The amount of guilds that Bulbbot serves" });
const guildMemberCount = new prom.Gauge({ name: "bulbbot_guild_member_count", help: "The amount of users Bulbbot serves" });

const websocket = new prom.Counter({
	name: "bulbbot_websocket",
	help: "Analytics regarding the websocket",
	labelNames: ["event"],
});
const userMessages = new prom.Counter({
	name: "bulbbot_user_messages",
	help: "Analytics regarding user messages",
	labelNames: ["authorId"],
});
const guildMessages = new prom.Counter({
	name: "bulbbot_guild_messages",
	help: "Analytics regarding guild messages",
	labelNames: ["guildId"],
});

export async function startPrometheus(client: any): Promise<void> {
	client.log.info("[PROMETHEUS] Starting up the prometheus");
	const register = new prom.Registry();
	register.setDefaultLabels({
		app: "bulbbot",
	});

	prom.collectDefaultMetrics({ register });

	const metric = [latency, cachedUsers, websocket, userMessages, guildMessages, guildCount, guildMemberCount];
	metric.forEach(metric => {
		register.registerMetric(metric);
	});

	const server = http.createServer(async (req, res) => {
		const route = url.parse(req.url!).pathname;

		if (route === "/metrics") {
			res.setHeader("Content-Type", register.contentType);
			latency.set(client.ws.ping);
			cachedUsers.set(client.users.cache.size);
			guildCount.set(client.guilds.cache.size);
			guildMemberCount.set(client.guilds.cache.reduce((a: any, g: { memberCount: any }) => a + g.memberCount, 0));

			res.write(await register.metrics());
			res.end();
		}
	});

	client.on("raw", (packet: any) => {
		if (packet.t === null) return;
		websocket.inc({ event: packet.t });

		if (packet.t === "MESSAGE_CREATE") {
			userMessages.inc({ authorId: packet.d.author.id });
			guildMessages.inc({ guildId: packet.d.guild_id });
		}
	});

	server.listen(process.env.PORT || 8080);
}
