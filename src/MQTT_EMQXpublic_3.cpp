/**
 * Adapted from MQTT_EMQXpublic_2.cppv and MQTT_AWS.cpp
 * ! The main differences of this code with MQTT_EMQXpublic_2.cpp is: 
 * ! 1. The WiFiMulti.h library is used to implement the feature of connecting to the strongest Wi-Fi network from a list of available networks.
 */

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h> 
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char wifi_ssid_1[] = "me";
const char wifi_password_1[] = "tofu11122004";
const char EMQX_endpoint[] = "broker.emqx.io";
const char publish_topic[] = "urusai1234";
const char subscribe_topic[] = "urusai12345";
const char username[] = "emqx";
const char password[] = "public";
const int port = 8883;
const char emqx_root_ca[] = R"CA(
-----BEGIN CERTIFICATE-----
MIIDjjCCAnagAwIBAgIQAzrx5qcRqaC7KGSxHQn65TANBgkqhkiG9w0BAQsFADBh
MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3
d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBH
MjAeFw0xMzA4MDExMjAwMDBaFw0zODAxMTUxMjAwMDBaMGExCzAJBgNVBAYTAlVT
MRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j
b20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IEcyMIIBIjANBgkqhkiG
9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuzfNNNx7a8myaJCtSnX/RrohCgiN9RlUyfuI
2/Ou8jqJkTx65qsGGmvPrC3oXgkkRLpimn7Wo6h+4FR1IAWsULecYxpsMNzaHxmx
1x7e/dfgy5SDN67sH0NO3Xss0r0upS/kqbitOtSZpLYl6ZtrAGCSYP9PIUkY92eQ
q2EGnI/yuum06ZIya7XzV+hdG82MHauVBJVJ8zUtluNJbd134/tJS7SsVQepj5Wz
tCO7TG1F8PapspUwtP1MVYwnSlcUfIKdzXOS0xZKBgyMUNGPHgm+F6HmIcr9g+UQ
vIOlCsRnKPZzFBQ9RnbDhxSJITRNrw9FDKZJobq7nMWxM4MphQIDAQABo0IwQDAP
BgNVHRMBAf8EBTADAQH/MA4GA1UdDwEB/wQEAwIBhjAdBgNVHQ4EFgQUTiJUIBiV
5uNu5g/6+rkS7QYXjzkwDQYJKoZIhvcNAQELBQADggEBAGBnKJRvDkhj6zHd6mcY
1Yl9PMWLSn/pvtsrF9+wX3N3KjITOYFnQoQj8kVnNeyIv/iPsGEMNKSuIEyExtv4
NeF22d+mQrvHRAiGfzZ0JFrabA0UWTW98kndth/Jsw1HKj2ZL7tcu7XUIOGZX1NG
Fdtom/DzMNU+MeKNhJ7jitralj41E6Vf8PlwUHBHQRFXGU7Aj64GxJUTFy8bJZ91
8rGOmaFvE7FBcf6IKshPECBV1/MUReXgRPTqh5Uykw7+U0b6LJ3/iyK5S9kJRaTe
pLiaWN0bfVKfjllDiIGknibVb63dDcY3fe0Dkhvld1927jyNxF1WW6LZZm6zNTfl
MrY=
-----END CERTIFICATE-----
)CA";
const int AO = 36;
int sound;

WiFiMulti WiFiMulti;
WiFiClientSecure net;
PubSubClient client(net);

void connectWiFi() {
    // Connecting to a WiFi network
    WiFiMulti.addAP(wifi_ssid_1, wifi_password_1);
    Serial.println("");

    int matchingWiFi = 0;
    while (matchingWiFi == 0) {
        int n = WiFi.scanNetworks();                                                 // Scans for available WiFi networks and returns the discovered number.
        if (n == 0) {
            Serial.println("----------No WiFi networks found----------");
        } else {
            Serial.printf("----------%d WiFi networks found----------", n);
            Serial.println("");
            for (int i = 0; i < n; ++i) {
                // Print SSID and RSSI for each network found
                Serial.printf("%d: %s (%d)", i + 1, WiFi.SSID(i), WiFi.RSSI(i));    // WiFi.SSID returns the SSID (string) of the network specified by the wifiAccessPoint.
                Serial.println("");                                                 // WiFi.RSSI returns the signal strength (RSSI: Received Signal Strength Indicator) of the connection specified by the wifiAccessPoint to the router.
                if (WiFi.SSID(i) == wifi_ssid_1) {
                    matchingWiFi = 1;
                }
                delay(10);                                                          
            }
            if (matchingWiFi == 0) {
                Serial.print("---------No matching Wi-Fi found, searching again...---------");
            }
        }
    }
    Serial.println("----------Matching Wi-Fi found----------");
     

    Serial.println("Wi-Fi not connected, trying to connect...");
    while (WiFiMulti.run() != WL_CONNECTED) {                                   // Returns WL_CONNECTED, WL_NO_SSID_AVAIL, WL_CONNECT_FAILED, WL_IDLE_STATUS or WL_DISCONNECTED.                   
        Serial.println("...");
        delay(500);
    }
    Serial.printf("----------Connected to Wi-Fi: %s (%d)----------", WiFi.SSID(), WiFi.RSSI());
    Serial.println("");
}

void callback(const char *topic, byte* payload, unsigned int length) {
    Serial.print("Subscription message from ");
    Serial.println(topic);
    Serial.print("Message: ");
    for (int i = 0; i < length; i++) {
        Serial.print((char) payload[i]);                                        // (char) is a type cast operator that converts the data type of payload[i] to 'char'
    }
    Serial.println();
    Serial.println("-----------------------");
}

void publishMessage() {
    JsonDocument docP;                                                          // Creates an empty (null) JSON document called 'docP' and store it in the heap. (The estimated maximum number of bytes of each line of {"Sound value":sound} is 24).
    docP["Sound value"] = (sound*sound)/(4095);                                                // 'docP' now contains {"Sound value":sound}
    char JSONbuffer[50];
    serializeJson(docP, JSONbuffer);                                            // To serialise (convert) the JSON object ('docP') into a JSON-encoded string (no spaces, line break, etc.), which can be more easily transmitted and stored, and stores (writes) it to the 'char' buffer 'JSONbuffer'.
    if (client.publish(publish_topic, JSONbuffer)){                             // Returns false if publish failed (connection lost or message too large), true if publish succeeded.
        Serial.println("----------Publish succeeded----------");
    } else {
        Serial.println("----------Publish failed----------");
    }
}

void connectEMQX() {
    // Connecting to a EMQX public MQTT broker
    net.setCACert(emqx_root_ca);
    client.setServer(EMQX_endpoint, port);
    client.setCallback(callback);
    while (!client.connected()) {                                               // Returns false if the client is not connected, true if it is
        String client_id = "esp32-client-";
        client_id += String(WiFi.localIP());    
        Serial.println("Connecting to EMQX...");
        if (client.connect(client_id.c_str(), username, password)) {            // Connects the client, returns false if connection failed and true if connection succeeded.
            Serial.println("----------Public EMQX MQTT broker connected----------");
        } else {
            Serial.print("Connection failed with state ");
            Serial.print(client.state());                                       // https://pubsubclient.knolleary.net/api#state
            delay(2000);
        }
    }
    
    Serial.print("Subscribing to ");
    Serial.print(subscribe_topic);
    Serial.println(" ...");
    while (!client.subscribe(subscribe_topic)) {                                // Returns true: subscription succeeded, false: subscription failed / connection lost / message is too large
        Serial.println("...");                      
        delay(500);
    }
    Serial.printf("----------Subscribed to %s----------", subscribe_topic);
    Serial.println("");
}
void setup() {
    Serial.begin(115200);
    connectWiFi();
    delay(500);
    connectEMQX();
}

void loop() {
    Serial.println(client.state()); 
    if (WiFi.status() != WL_CONNECTED) {                                        // See WiFiMulti (Blocking).cpp for all returns of the .status method
        connectWiFi();
    }
    
    Serial.println(client.state()); 
    if (!client.loop()){                                                        // https://pubsubclient.knolleary.net/api#loop
        Serial.println(client.state());
        connectEMQX();    
    }   

    sound = analogRead(AO);
    Serial.print("Sound value: ");
    Serial.println((sound*sound)/(4095));

    publishMessage();
    delay(100);
}