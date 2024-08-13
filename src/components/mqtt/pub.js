const mqtt = require("mqtt");
var client = mqtt.connect("wss://broker.emqx.io:8084/mqtt");

client.on("connect", function () {
  setInterval(() => {
    var random = Math.round(Math.random() * (4096 - 1700) + 1700);
    const jsonData = {
      "Sound value": random,
    };
    const msg = JSON.stringify(jsonData);
    console.log(msg);
    client.publish("urusai1234", msg);
  }, 200);
});
