const API = "https://btcedge-3.onrender.com/api/dashboard";

async function update() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    document.getElementById("price").innerText =
      "$" + Number(data.price).toFixed(2);

    function show(prefix, obj) {
      document.getElementById("buy" + prefix).innerText =
        "$" + Number(obj.buy).toLocaleString();

      document.getElementById("sell" + prefix).innerText =
        "$" + Number(obj.sell).toLocaleString();

      document.getElementById("delta" + prefix).innerText =
        "$" + Number(obj.delta).toLocaleString();
    }

    show("30", data.s30);
    show("1", data.m1);
    show("3", data.m3);
    show("5", data.m5);
    show("10", data.m10);

  } catch (err) {
    console.error(err);
  }
}

update();
setInterval(update, 1000);
