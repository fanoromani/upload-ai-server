import { FastifyInstance } from "fastify";
import { z } from "zod";
import ytdl from "ytdl-core";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma";

interface YoutubeResponseBody {
  title: string;
}

export async function youtubeDownloadRoute(app: FastifyInstance) {
  app.post("/youtube", async (request, reply) => {
    const bodySchema = z.object({
      url: z.string(),
    });
    const { url } = bodySchema.parse(request.body);
    const fileUploadName = `audio-${randomUUID()}.mp3`;
    const uploadDestination = path.resolve(
      __dirname,
      "../../temp",
      fileUploadName
    );

    const response = await new Promise<YoutubeResponseBody>(
      (resolve, reject) => {
        let responseBody = {
          ok: false,
          title: "",
        };

        ytdl(url, {
          quality: "lowestaudio",
          filter: "audioonly",
        })
          .on("info", (info) => {
            responseBody.title = info.videoDetails.title;
          })
          .on("end", () => {
            responseBody.ok = true;
            resolve(responseBody);
          })
          .on("error", () => {
            responseBody.ok = false;
            reject(responseBody);
          })
          .pipe(fs.createWriteStream(uploadDestination));
      }
    );

    const video = await prisma.video.create({
      data: {
        name: response.title,
        path: uploadDestination,
      },
    });
    return video.id;
  });
}
