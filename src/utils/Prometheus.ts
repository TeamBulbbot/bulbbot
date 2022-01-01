import prom from "prom-client";
import http from "http";
import url from "url";

/*
Guild Data
	- Total Guilds (include unavaible)
	- Most active guilds

User Data
	- Total Users
	- Most active users

Command Data
	 - Command Usage
	 - Commands / hour
	 - Commands / min
	 - Commands / sec
	 - Total Commands

Event Data
	- Event Usage (from raw event)
	- Events / hour
	- Events / min
	- Events / sec
	- Total Events

Computer
	- Memory
	- CPU

Request per Sec

*/

export async function startPrometheus(client: any): Promise<void> {
	client.log.info("[PROMETHEUS] Starting up the prometheus");
	const register = new prom.Registry();
	register.setDefaultLabels({
		app: "bulbbot",
	});

	prom.collectDefaultMetrics({ register });

	const latency = new prom.Gauge({ name: "bulbbot_latency", help: "The bulbbot latency to the Discord Websocket" });
	const cachedUsers = new prom.Gauge({ name: "bulbbot_cached_users", help: "The amount of cached users in the memory" });

	const websocket = new prom.Counter({
		name: "bulbbot_websocket",
		help: "Analytics regarding the websocket",
		labelNames: ["event"],
	});
	const messages = new prom.Counter({
		name: "bulbbot_messages",
		help: "Analytics regarding messages",
		labelNames: ["bulbbot"],
	});

	register.registerMetric(latency);
	register.registerMetric(cachedUsers);
	register.registerMetric(websocket);
	register.registerMetric(messages);

	const server = http.createServer(async (req, res) => {
		const route = url.parse(req.url!).pathname;

		if (route === "/metrics") {
			res.setHeader("Content-Type", register.contentType);
			latency.set(client.ws.ping);
			cachedUsers.set(client.users.cache.size);

			res.write(await register.metrics());
			res.end();
		}
	});

	client.on("raw", (packet: any) => {
		console.log(packet);
		if (packet.t === null) return;
		websocket.inc({ event: packet.t });

		if (packet.t === "MESSAGE_CREATE") {
			if (packet.d.author.id === client.user.id) messages.inc();
		}
	});

	server.listen(process.env.PORT || 8080);
}
