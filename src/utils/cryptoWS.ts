import WebSocket from "ws";
import { CryptoCode } from "./enums";
import { CryptoType } from "./types";

export default class CryptoWS {
  private _BTC: number;
  private _ETH: number;
  private _ETC: number;
  private _DOGE: number;
  private _XRP: number;
  private _BCH: number;
  private _FLOW: number;
  private _SAND: number;
  private _WAVES: number;

  constructor() {
    const ws = new WebSocket("wss://api.upbit.com/websocket/v1");
    ws.on("open", () => {
      ws.send(
        JSON.stringify([
          { ticket: "economy-bot" },
          {
            type: "trade",
            codes: [
              "KRW-BTC",
              "KRW-ETH",
              "KRW-ETC",
              "KRW-DOGE",
              "KRW-XRP",
              "KRW-BCH",
              "KRW-FLOW",
              "KRW-SAND",
              "KRW-WAVES",
            ],
            isOnlyRealtime: "true",
          },
        ])
      );
    });
    ws.on("message", (data) => {
      const crypto: CryptoType = JSON.parse(data.toString());
      Object.keys(CryptoCode).map((coin) => {
        if (crypto.code === CryptoCode[coin]) {
          this["_" + coin] = crypto.trade_price;
        }
      });
    });
  }

  get BTC() {
    return this._BTC;
  }
  get ETH() {
    return this._ETH;
  }
  get ETC() {
    return this._ETC;
  }
  get DOGE() {
    return this._DOGE;
  }
  get XRP() {
    return this._XRP;
  }
  get BCH() {
    return this._BCH;
  }
  get FLOW() {
    return this._FLOW;
  }
  get SAND() {
    return this._SAND;
  }
  get WAVES() {
    return this._WAVES;
  }
}
