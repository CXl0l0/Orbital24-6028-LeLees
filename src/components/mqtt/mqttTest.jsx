import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import {
  AWS_IOT_ENDPOINT,
  CLIENT_ID,
  TOPIC,
  CERT_PATH,
  PRIVATE_KEY_PATH,
  CA_PATH,
} from "./aws-iot-config";
import AWS from "aws-iot-device-sdk";

AWS.config.update({
  region: "YOUR_AWS_REGION",
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "YOUR_IDENTITY_POOL_ID",
  }),
});

const mqttTest = () => {
  const cert = fetch("/certs/cert.pem.crt").then((res) => res.text());
  const key = fetch("/certs/private.pem.key").then((res) => res.text());
  const ca = fetch("/certs/AmazonRootCA1.pem").then((res) => res.text());

  const client = mqtt.connect({
    host: AWS_IOT_ENDPOINT,
    clientId: CLIENT_ID,
    cert: cert,
    key: key,
    ca: ca,
    protocol: "mqtts",
  });

  client.on("connect", () => {
    console.log("Connected to AWS IoT");
    client.subscribe(TOPIC, (err) => {
      if (!err) {
        console.log(`Subscribed to topic: ${TOPIC}`);
      } else {
        console.error("Subscription error:", err);
      }
    });
  });

  client.on("message", (topic, message) => {
    console.log("Message received:", message.toString());
    // Handle the message received
  });

  return <div>mqttTest</div>;
};

export default mqttTest;

/*
const mqttTest = () => {
  const [client, setClient] = useState(null);
  const [payload, setPayload] = useState("");
  const [isSub, setIsSub] = useState(false);

  useEffect(() => {
    if (client) {
      console.log(client);
      client.on("connect", () => {
        console.log("MQTT Client Connected");
      });
      client.on("error", (err) => {
        console.log("Connection error: ", err);
        client.end();
      });
      client.on("reconnect", () => {
        console.log("MQTT Client Reconnecting");
      });
      client.on("message", (topic, message) => {
        const payload = { topic, message: message.toString() };
        setPayload(payload);
      });
    }
  }, [client]);

  const mqttConnect = (host, mqttOption) => {
    setClient(mqtt.connect(host, mqttOption));
  };

  const mqttDisconnect = () => {
    if (client) {
      client.end(() => {
        console.log("Disconnected");
      });
    }
  };

  //QOT (Quality of Service) is an agreement
  //between sender and receiver on the guarantee
  //of delivering a message.
  //It has three levels:
  //0 - at most once.
  //1 - at least once.
  //2 - exactly once.

  const mqttSub = (subscription) => {
    if (client) {
      const { topic, qos } = subscription;
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log("Subscribe to topics error", error);
          return;
        }
        setIsSub(true);
      });
    }
  };

  const mqttUnSub = (subscription) => {
    if (client) {
      const { topic } = subscription;
      client.unsubscribe(topic, (error) => {
        if (error) {
          console.log("Unsubscribe error", error);
          return;
        }
        setIsSub(false);
      });
    }
  };

  const mqttPublish = (context) => {
    if (client) {
      const { topic, qos, payload } = context;
      client.publish(topic, payload, { qos }, (error) => {
        if (error) {
          console.log("Publish error: ", error);
        }
      });
    }
  };
};*/
