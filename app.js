let buy = 0;
let sell = 0;

const priceEl = document.getElementById("price");
const buyEl = document.getElementById("buy");
const sellEl = document.getElementById("sell");
const deltaEl = document.getElementById("delta");

const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

ws.onmessage = (event) => {
    const trade = JSON.parse(event.data);

    const price = parseFloat(trade.p);
    const qty = parseFloat(trade.q);
    const value = price * qty;

    priceEl.textContent = "$" + price.toFixed(2);

    if (trade.m) {
        sell += value;
    } else {
        buy += value;
    }

    buyEl.textContent = "$" + Math.round(buy).toLocaleString();
    sellEl.textContent = "$" + Math.round(sell).toLocaleString();

    const delta = buy - sell;
    deltaEl.textContent = "$" + Math.round(delta).toLocaleString();
};
