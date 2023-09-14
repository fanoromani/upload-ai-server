import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import path from "node:path";

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, { limits: { fileSize: 1048576 * 25 } });
  app.post("/videos", async (request, reply) => {
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ error: "Missing file input" });
    }
    const extension = path.extname(data.filename);
    if (extension !== ".mp3") {
      return reply
        .status(400)
        .send({ error: "Invalid input type, please upload an MP3" });
    }
  });
}
