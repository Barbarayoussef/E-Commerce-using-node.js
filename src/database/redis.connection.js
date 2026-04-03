import { createClient } from "redis";

export const client = createClient({
  url: "rediss://default:gQAAAAAAAWRoAAIncDFkYjkwZGYzOGE4MTI0ZDMzOTQ1ODRlYjI2YzYxZTJmMHAxOTEyNDA@hot-tahr-91240.upstash.io:6379",
});

client.on("error", function (err) {
  throw err;
});
await client.connect();
