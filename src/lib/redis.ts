/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, RedisClientType } from "redis";

class RedisService {
  private client: RedisClientType | null = null;
  private isConnected: boolean = false;

  async connect(): Promise<void> {
    if (this.isConnected && this.client) {
      return;
    }

    try {
      // Try to get Redis URL from environment variables
      const redisUrl = process.env.REDIS_URL;

      if (!redisUrl) {
        console.warn("REDIS_URL is not defined in environment variables. Falling back to local configuration.");
      }

      console.log("Initializing Redis connection attempt...");

      if (redisUrl) {
        this.client = createClient({
          url: redisUrl,
          socket: {
            reconnectStrategy: (retries) => {
              if (retries > 10) {
                console.error("Redis reconnection failed after 10 retries");
                return new Error("Redis reconnection failed");
              }
              return Math.min(retries * 50, 500);
            },
            // Add connect timeout for serverless
            connectTimeout: 10000,
          },
        });
      } else {
        // Fallback to individual parameters
        const host = process.env.REDIS_HOST || "localhost";
        const port = parseInt(process.env.REDIS_PORT || "6379", 10);
        const password = process.env.REDIS_PASSWORD || undefined;

        this.client = createClient({
          socket: {
            host,
            port,
            connectTimeout: 5000,
          },
          ...(password && { password }),
        });
      }

      // Handle connection events
      this.client.on("error", (err) => {
        console.error("Redis Client Error:", err);
        this.isConnected = false;
      });

      this.client.on("connect", () => {
        console.log("Redis Client Connected Successfully");
        this.isConnected = true;
      });

      this.client.on("ready", () => {
        console.log("Redis Client Ready");
        this.isConnected = true;
      });

      this.client.on("end", () => {
        console.log("Redis Client Disconnected");
        this.isConnected = false;
      });

      // Reconnect strategy
      this.client.on("reconnecting", () => {
        console.log("Redis Client Reconnecting...");
      });

      await this.client.connect();
    } catch (error) {
      console.error("Failed to connect to Redis during connect() call:", error);
      this.isConnected = false;
      this.client = null; // Reset client so next attempt can start fresh
    }
  }

  private async ensureConnection(): Promise<RedisClientType> {
    if (!this.client || !this.isConnected) {
      await this.connect();
    }

    if (!this.client || !this.isConnected) {
      throw new Error(`Redis connection failed. status: ${this.isConnected ? 'connected' : 'disconnected'}, client: ${this.client ? 'initialized' : 'null'}. Please check your REDIS_URL and Vercel environment variables.`);
    }

    return this.client;
  }

  async get(key: string): Promise<string | null> {
    try {
      const client = await this.ensureConnection();
      return await client.get(key);
    } catch (error) {
      console.error("Redis GET error:", error);
      return null;
    }
  }

  async set(key: string, value: any, ttlInSeconds: number): Promise<void> {
    try {
      const client = await this.ensureConnection();
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      await client.set(key, stringValue, { EX: ttlInSeconds });
    } catch (error) {
      console.error("Redis SET error:", error);
    }
  }

  async update(key: string, value: any, ttlInSeconds: number): Promise<void> {
    // Update is the same as set in Redis
    await this.set(key, value, ttlInSeconds);
  }

  async delete(key: string): Promise<void> {
    try {
      const client = await this.ensureConnection();
      await client.del(key);
    } catch (error) {
      console.error("Redis DELETE error:", error);
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const client = await this.ensureConnection();
      await client.ping();
      return true;
    } catch (error) {
      console.log("Redis availability check failed:", error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  }
}

// Export a singleton instance
export const redisService = new RedisService();
