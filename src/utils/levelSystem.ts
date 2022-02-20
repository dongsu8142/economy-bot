import DiscordClient from "../client/client";

export default class LevelSystem {
  private _client: DiscordClient;

  constructor(client: DiscordClient) {
    this._client = client;
  }

  async appendXp(userId: string, xp: number) {
    const user = await this.fetch(userId);
    if (!user) return false;
    await this._client.userRepository
      .update(
        { userId },
        { xp: user.xp + xp, level: Math.floor(0.1 * Math.sqrt(user.xp)) }
      )
      .catch((e) => console.error(`Failed to append xp: ${e}`));
    return Math.floor(0.1 * Math.sqrt((user.xp -= xp))) < user.level;
  }

  async fetch(userId: string) {
    return this._client.userRepository.findOne({ userId });
  }

  async fetchAll() {
    return this._client.userRepository.find();
  }

  async fetchLeaderboard(limit: number) {
    const users = (await this.fetchAll()).sort((a, b) => b.xp - a.xp);

    return users.slice(0, limit);
  }
}
