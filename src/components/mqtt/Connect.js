// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
var awsIot = require("aws-iot-device-sdk");

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT.
// NOTE: client identifiers must be unique within your AWS account; if a client attempts
// to connect with a client identifier which is already in use, the existing
// connection will be terminated.
//
var device = awsIot.device({
  keyPath:
    "./cert/17fb561e39b7fd541ef1c011dc61b4702bdc14d88ecec655c8495d7c1500d260-private.pem.key",
  certPath:
    "./cert/17fb561e39b7fd541ef1c011dc61b4702bdc14d88ecec655c8495d7c1500d260-certificate.pem.crt",
  caPath: "./cert/AmazonRootCA1.pem",
  clientId: "urusai-web-app",
  host: "a3fh404lk71g2d-ats.iot.ap-southeast-1.amazonaws.com",
});

//
// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//
device.on("connect", function () {
  console.log("connect");
  device.subscribe("topic_2");
  device.publish("topic_2", JSON.stringify({ test_data: "Hello from urusai" }));
});

device.on("message", function (topic, payload) {
  console.log("message", topic, payload.toString());
});
