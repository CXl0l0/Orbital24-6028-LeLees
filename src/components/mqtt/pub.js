const mqtt = require("mqtt");
//var client = mqtt.connect("wss://broker.emqx.io:8084/mqtt");
var client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

client.on("connect", function () {
  setInterval(() => {
    var random = Math.round(Math.random() * 4096);
    console.log(random);
    client.publish("urusai1234", random.toString());
  }, 1100);
});
