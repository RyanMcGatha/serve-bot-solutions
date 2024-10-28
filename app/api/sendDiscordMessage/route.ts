import { Client, GatewayIntentBits, TextChannel } from "discord.js";

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!DISCORD_TOKEN) {
  throw new Error("Discord bot token is not set in the environment variables.");
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

async function loginWithRetry(retryInterval = 5000) {
  try {
    await client.login(DISCORD_TOKEN);
    console.log("Discord bot logged in successfully!");
  } catch (error) {
    console.error(
      "Failed to login to Discord, retrying in",
      retryInterval,
      "ms:",
      error
    );
    setTimeout(() => loginWithRetry(retryInterval), retryInterval);
  }
}

loginWithRetry();

client.once("ready", () => {
  console.log("Discord bot is ready!");
});

client.on("error", (error) => {
  console.error("Discord client encountered an error:", error);
  client.destroy();
  loginWithRetry();
});

client.on("disconnect", () => {
  console.log("Bot disconnected, attempting to reconnect...");
  client.destroy();
  loginWithRetry();
});

export async function POST(req: Request) {
  try {
    const { message, channelId } = await req.json();

    if (!channelId) {
      return new Response(JSON.stringify({ error: "Channel ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const channel = (await client.channels.fetch(channelId)) as TextChannel;
    if (channel && channel.isTextBased()) {
      await channel.send(message);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      console.error("Channel not found or bot lacks permissions.");
      return new Response(JSON.stringify({ error: "Channel not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Failed to send message:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send message to Discord" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
