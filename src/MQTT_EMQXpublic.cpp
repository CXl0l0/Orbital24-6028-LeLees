/**
 * Adapted from Milestone 1.cpp and credentials.h
 */

#include <Arduino.h>
#include <WiFiMulti.h>
#include <WiFiClient.h>    // Essential library to create a Wi-Fi client. Basis of the WiFiClientSecure library which does not support SSL/TLS connections.
#include <ArduinoJson.h>    // A popular library for working with JSON on Arduino: https://arduinojson.org/v7/api/
#include <PubSubClient.h>     // Essential library for MQTT communication on Arduino platforms: https://pubsubclient.knolleary.net/api#include <time.h>

WiFiMulti wifi;
WiFiClient net;
PubSubClient client(net);

const char wifi_ssid[] = "me";
const char wifi_pw[] = "tofu11122004";
const char EMQX_endpoint[] = "broker.emqx.io";    // This is basically the AWS IoT Core broker server address
const int AO = 36;
const char publish_topic[] = "urusai1234";
const char subscribe_topic[] = "urusai12345";
int sound;

void connectWiFi() {
    wifi.addAP(wifi_ssid, wifi_pw);
    Serial.println("");    // So that the serial print below starts in a new line and not with the boot message.
    Serial.println("Wi-Fi not connected, trying to connect...");
    while (wifi.run() != WL_CONNECTED) {    // If Wi-Fi is not connected, the code run wifi.run repeatedly to try to connect to the specified network.
     Serial.println("... ");
     delay(500);
    }
    Serial.println("Connected to Wi-Fi");
}

void subscribeMessage(const char *topic, byte* payload, unsigned int length){    // The callback function that is passed into 'setCallback' function below must have the signature: void callback(const char[] topic, byte* payload, unsigned int length)
    JsonDocument docS;
    deserializeJson(docS, payload);    // This function parses the JSON input 'payload' and stores the result in the JSON document 'docS'.
    Serial.print("Subscription message from ");
    Serial.println(topic);
    const int message = docS["Sound value"];
    Serial.println(message);
}

void connectEMQX() {
    // Connect to the EMQX public MQTT broker (the server) on the address
    client.setServer(EMQX_endpoint, 1883);    // The standard MQTT port for secure communication with TLS is 8883 (1883 is the default and has no encryption - non-secure)
    client.setCallback(subscribeMessage);    // 'subscribeMessage' will be called when a message arrives for a subscription to an MQTT topic.
    Serial.println("Connecting to EMQX...");
    while (!client.connect("ESP32")) {    // Returns Boolean (true: connection succeeded, false: connection failed)
        Serial.println("...");     // The client will keep trying to connect to the server until connection succeeds.
        delay(500);
    }
    Serial.println("EMQX Connected!");

    delay(500);

    // Subscription
    Serial.print("Subscribing to ");
    Serial.print(subscribe_topic);
    Serial.println(" ...");
    while (!client.subscribe(subscribe_topic)) {    // The function returns true: subscription succeeded, false: subscription failed / connection lost / message is too large
        Serial.println("...");                      
        delay(500);
    }
    Serial.print("Subscribed to ");
    Serial.println(subscribe_topic);
}

void publishMessage() {
    JsonDocument docP;    // Creates an empty (null) JSON document called 'docP' and store it in the heap. (The estimated maximum number of bytes of each line of {"Sound value":sound} is 24).
    docP["Sound value"] = sound;    // 'docP' now contains {"Sound value":sound}
    char JSONbuffer[50];
    int n = serializeJson(docP, JSONbuffer);   // To serialise (convert) a JSON object or array ('docP') into a JSON-encoded string (no spaces, line break, etc.), which can be more easily transmitted or stored, and stores (writes) it to a specified output ('char' buffer, 'String' object, a stream, etc.), in this case, it's the 'char' buffer 'JSONbuffer'.
    // The function returns the number of bytes written.
    if (client.publish(publish_topic, JSONbuffer)){
        Serial.println("----------Publish succeeded----------");
    } else {
        Serial.println("----------Publish failed----------");
    }
    // Serial.print("n = ");
    // Serial.println(n);    // From here, we can know that the number of bytes written into JSONbuffer, i.e., the size of the JSON-encoded string is 20 bytes. This allows us to allocate a better size to the JSONbuffer 'char' array. (50 is safe)
}

void setup() {
    Serial.begin(115200);
    connectWiFi();
    delay(500);
    connectEMQX();
}

void loop() {
    Serial.println(client.state());
    if (WiFi.status() != WL_CONNECTED) {
        connectWiFi();
    }

    Serial.println(client.state());
    if (!client.loop()){    // 'loop' allows the client (ESP32) to process incoming messages and maintain its connection to the server (AWS IoT Core).
        Serial.println(client.state());
        connectEMQX();
    }                        // If the client is not connected, attempts to connect again.

    sound = analogRead(AO);
    Serial.print("Sound value: ");
    Serial.println(sound);
    
    publishMessage();
    delay(250);
}