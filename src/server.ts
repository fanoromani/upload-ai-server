import "dotenv/config";
import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { generateAICompletionRoute } from "./routes/generate-ai-completion";
import { youtubeDownloadRoute } from "./routes/youtube-download";

const app = fastify();

app.register(fastifyCors, {
  origin: process.env.CORS_ORIGIN,
});
app.register(getAllPromptsRoute);
app.register(uploadVideoRoute);
app.register(youtubeDownloadRoute);
app.register(createTranscriptionRoute);
app.register(generateAICompletionRoute);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("HTTP server running");
  });
