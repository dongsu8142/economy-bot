import DiscordClient from "../client/client";
import { User } from "./entities/user";

export default class EconomySystem {
  private _client: DiscordClient;

  constructor(client: DiscordClient) {
    this._client = client;
  }

  async setMoney(userId: string, money: number) {
    return this._client.userRepository.update({ userId }, { money });
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

  async buy(user: User, kind: string, count: number) {
    const price = this._client.crypto[kind];
    const total = price * count;
    if (user.money >= total) {
      user[kind] += count;
      user["money"] -= total;
      const newUser = await this._client.userRepository.save(user);
      return { user: newUser, price, total };
    }
  }

  async create(userId: string) {
    const newMoney = await this._client.userRepository.create({ userId });
    return this._client.userRepository.save(newMoney);
  }

  async sell(user: User, kind: string, count: number) {
    const price = this._client.crypto[kind];
    const total = price * count;
    if (user[kind] >= count) {
      user[kind] -= count;
      user["money"] += total;
      const newUser = await this._client.userRepository.save(user);
      return { user: newUser, price, total };
    }
  }
}
