const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

let currentPrice = 0;

// Keep only the last 10 minutes of trades
const trades = [];

//const //ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
const ws = new WebSocket("wss://ws-feed.exchange.coinbase.com");

/*ws.on("open", () => {
  console.log("Connected to Binance");
});*/

ws.on("open", () => {
  console.log("Connected to Coinbase");

  ws.send(JSON.stringify({
    type: "subscribe",
    product_ids: ["BTC-USD"],
    channels: ["matches"]
  }));
});

ws.on("message", (msg) => {
  const t = JSON.parse(msg);

  // Ignore non-trade messages
  if (t.type !== "match") return;

  const price = parseFloat(t.price);
  const qty = parseFloat(t.size);
  const value = price * qty;

  currentPrice = price;

  trades.push({
    time: Date.now(),
    side: t.side, // "buy" or "sell"
    value
  });

  // Keep only the last 10 minutes
  const cutoff = Date.now() - 10 * 60 * 1000;
  while (trades.length && trades[0].time < cutoff) {
    trades.shift();
  }
});

function calculate(seconds) {
  const cutoff = Date.now() - seconds * 1000;

  let buy = 0;
  let sell = 0;
  let largestBuy = 0;
  let largestSell = 0;

  for (const t of trades) {
    if (t.time >= cutoff) {
      if (t.side === "buy") {
        buy += t.value;
        if (t.value > largestBuy) largestBuy = t.value;
      } else {
        sell += t.value;
        if (t.value > largestSell) largestSell = t.value;
      }
    }
  }

  return {
    buy: Math.round(buy),
    sell: Math.round(sell),
    delta: Math.round(buy - sell),
    ratio: buy + sell > 0 ? ((buy / (buy + sell)) * 100).toFixed(1) : "0.0",
    largestBuy: Math.round(largestBuy),
  largestSell: Math.round(largestSell)
};
}

app.get("/api/dashboard", (req, res) => {
  res.json({
    price: currentPrice,
    s30: calculate(30),
    m1: calculate(60),
    m3: calculate(180),
    m5: calculate(300),
    m10: calculate(600)
  });
});

app.get("/", (req, res) => {
  res.send("BTC Edge Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
