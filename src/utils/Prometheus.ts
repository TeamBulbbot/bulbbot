import prom from "prom-client";
import Command from "../structures/ApplicationCommand";
import express, { Request } from "express";

const latency = new prom.Gauge({ name: "bulbbot_latency", help: "The bulbbot latency to the Discord Websocket" });
const cachedUsers = new prom.Gauge({ name: "bulbbot_cached_users", help: "The amount of cached users in the memory" });
const guildCount = new prom.Gauge({ name: "bulbbot_guild_count", help: "The amount of guilds that Bulbbot serves" });
const guildMemberCount = new prom.Gauge({ name: "bulbbot_guild_member_count", help: "The amount of users Bulbbot serves" });

const websocket = new prom.Counter({
	name: "bulbbot_websocket",
	help: "Analytics regarding the websocket",
	labelNames: ["event"],
});
const userCommandUsage = new prom.Counter({
	name: "bulbbot_command_usage",
	help: "Analytics regarding  commands",
	labelNames: ["commandName"],
});
const api = new prom.Counter({
	name: "bulbbot_api_requests",
	help: "Analytics regarding the communication between the Discord API and Bulbbot",
	labelNames: ["route", "method", "status"],
});

export function commandUsage(command: Command) {
	userCommandUsage.inc({ commandName: command.name });
}

export async function startPrometheus(client: any): Promise<void> {
	client.log.info("[PROMETHEUS] Starting up the prometheus");
	const register = new prom.Registry();
	const PORT = process.env.PORT || 8080;
	const app = express();

	register.setDefaultLabels({
		app: "bulbbot",
	});

	prom.collectDefaultMetrics({ register });

	const metric = [latency, cachedUsers, websocket, guildCount, guildMemberCount, userCommandUsage, api];
	metric.forEach((metric) => {
		register.registerMetric(metric);
	});

	app.get("/metrics", async (_: Request, res: any) => {
		res.set("Content-Type", prom.register.contentType);
		latency.set(client.ws.ping);
		cachedUsers.set(client.users.cache.size);
		guildCount.set(client.guilds.cache.size);
		guildMemberCount.set(client.guilds.cache.reduce((a: any, g: { memberCount: any }) => a + g.memberCount, 0));

		res.write(await register.metrics());
		res.end();
	});

	//client.on("apiResponse", (request: APIRequest, response: Response) => {
	//	api.inc({ route: request.route, method: request.method, status: response.status });
	//});

	client.on("raw", (packet: any) => {
		if (packet.t === null) return;
		websocket.inc({ event: packet.t });
	});

	app.listen(PORT, () => {
		client.log.info(`[PROMETHEUS] Running server on port ${PORT}`);
	});
}
