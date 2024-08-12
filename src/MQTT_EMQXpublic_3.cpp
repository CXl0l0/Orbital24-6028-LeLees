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
//const char username[] = "emqx";
//const char password[] = "public";
const int port = 8883;
const char emqx_root_ca[] = R"CA(
-----BEGIN CERTIFICATE-----
MIIFyzCCBLOgAwIBAgIQCgWbJfVLPYeUzGYxR3U4ozANBgkqhkiG9w0BAQsFADBh
MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3
d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBD
QTAeFw0yMjA1MDQwMDAwMDBaFw0zMTExMDkyMzU5NTlaMFwxCzAJBgNVBAYTAlVT
MRcwFQYDVQQKEw5EaWdpQ2VydCwgSW5jLjE0MDIGA1UEAxMrUmFwaWRTU0wgR2xv
YmFsIFRMUyBSU0E0MDk2IFNIQTI1NiAyMDIyIENBMTCCAiIwDQYJKoZIhvcNAQEB
BQADggIPADCCAgoCggIBAKY5PJhwCX2UyBb1nelu9APen53D5+C40T+BOZfSFaB0
v0WJM3BGMsuiHZX2IHtwnjUhLL25d8tgLASaUNHCBNKKUlUGRXGztuDIeXb48d64
k7Gk7u7mMRSrj+yuLSWOKnK6OGKe9+s6oaVIjHXY+QX8p2I2S3uew0bW3BFpkeAr
LBCU25iqeaoLEOGIa09DVojd3qc/RKqr4P11173R+7Ub05YYhuIcSv8e0d7qN1sO
1+lfoNMVfV9WcqPABmOasNJ+ol0hAC2PTgRLy/VZo1L0HRMr6j8cbR7q0nKwdbn4
Ar+ZMgCgCcG9zCMFsuXYl/rqobiyV+8U37dDScAebZTIF/xPEvHcmGi3xxH6g+dT
CjetOjJx8sdXUHKXGXC9ka33q7EzQIYlZISF7EkbT5dZHsO2DOMVLBdP1N1oUp0/
1f6fc8uTDduELoKBRzTTZ6OOBVHeZyFZMMdi6tA5s/jxmb74lqH1+jQ6nTU2/Mma
hGNxUuJpyhUHezgBA6sto5lNeyqc+3Cr5ehFQzUuwNsJaWbDdQk1v7lqRaqOlYjn
iomOl36J5txTs0wL7etCeMRfyPsmc+8HmH77IYVMUOcPJb+0gNuSmAkvf5QXbgPI
Zursn/UYnP9obhNbHc/9LYdQkB7CXyX9mPexnDNO7pggNA2jpbEarLmZGi4grMmf
AgMBAAGjggGCMIIBfjASBgNVHRMBAf8ECDAGAQH/AgEAMB0GA1UdDgQWBBTwnIX9
op99j8lou9XUiU0dvtOQ/zAfBgNVHSMEGDAWgBQD3lA1VtFMu2bwo+IbG8OXsj3R
VTAOBgNVHQ8BAf8EBAMCAYYwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMC
MHYGCCsGAQUFBwEBBGowaDAkBggrBgEFBQcwAYYYaHR0cDovL29jc3AuZGlnaWNl
cnQuY29tMEAGCCsGAQUFBzAChjRodHRwOi8vY2FjZXJ0cy5kaWdpY2VydC5jb20v
RGlnaUNlcnRHbG9iYWxSb290Q0EuY3J0MEIGA1UdHwQ7MDkwN6A1oDOGMWh0dHA6
Ly9jcmwzLmRpZ2ljZXJ0LmNvbS9EaWdpQ2VydEdsb2JhbFJvb3RDQS5jcmwwPQYD
VR0gBDYwNDALBglghkgBhv1sAgEwBwYFZ4EMAQEwCAYGZ4EMAQIBMAgGBmeBDAEC
AjAIBgZngQwBAgMwDQYJKoZIhvcNAQELBQADggEBAAfjh/s1f5dDdfm0sNm74/dW
MbbsxfYV1LoTpFt+3MSUWvSbiPQfUkoV57b5rutRJvnPP9mSlpFwcZ3e1nSUbi2o
ITGA7RCOj23I1F4zk0YJm42qAwJIqOVenR3XtyQ2VR82qhC6xslxtNf7f2Ndx2G7
Mem4wpFhyPDT2P6UJ2MnrD+FC//ZKH5/ERo96ghz8VqNlmL5RXo8Ks9rMr/Ad9xw
Y4hyRvAz5920myUffwdUqc0SvPlFnahsZg15uT5HkK48tHR0TLuLH8aRpzh4KJ/Y
p0sARNb+9i1R4Fg5zPNvHs2BbIve0vkwxAy+R4727qYzl3027w9jEFC6HMXRaDc=
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
    docP["Sound value"] = (sound*sound)/(4095);                                 // 'docP' now contains {"Sound value":sound}
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
        if (client.connect(client_id.c_str())) {            // Connects the client, returns false if connection failed and true if connection succeeded.
            Serial.println("----------Public EMQX MQTT broker connected----------");
        } else {
            Serial.print("Connection failed with state ");
            Serial.println(client.state());                                       // https://pubsubclient.knolleary.net/api#state
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