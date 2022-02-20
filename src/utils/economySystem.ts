import DiscordClient from "../client/client";

export default class EconomySystem {
  private _client: DiscordClient;

  constructor(client: DiscordClient) {
    this._client = client;
  }

  async setMoney(userId: string, money: number) {
    await this._client.userRepository.update({ userId }, { money });
  }

  async fetch(userId: string) {
    return this._client.userRepository.findOne({ userId });
  }

  async fetchAll() {
    return this._client.userRepository.find();
  }

  async fetchLeaderboard(limit: number) {
    const users = (await this.fetchAll()).sort((a, b) => b.money - a.money);

    return users.slice(0, limit);
  }
}
