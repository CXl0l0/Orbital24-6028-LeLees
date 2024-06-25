const mqtt = require("mqtt");
var client = mqtt.connect("wss://broker.emqx.io:8084/mqtt");
//var client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

client.on("connect", function () {
  setInterval(() => {
    var random = Math.round(Math.random() * 4096);
    const jsonData = {
      "Sound value": random,
    };
    const msg = JSON.stringify(jsonData);
    console.log(msg);
    client.publish("urusai1234", msg);
  }, 200);
});
