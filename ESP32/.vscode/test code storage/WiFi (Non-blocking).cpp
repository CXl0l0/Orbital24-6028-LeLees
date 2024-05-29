#include <Arduino.h>
#include <WiFi.h>

#define BLUE 14
#define SSID "me"
#define PW "tofu11122004"
bool isConnected = false;

void setup() {
  Serial.begin(115200);     
  pinMode(BLUE, OUTPUT);
  WiFi.begin(SSID, PW);
}

void loop() {
  if (WiFi.status() == 3 && isConnected == false) {
    Serial.println("Connected");
    digitalWrite(BLUE, 1);
    isConnected = true;
  }

  if (WiFi.status() != 3) {
    Serial.println("Disconnected, trying to connect...");
    digitalWrite(BLUE, !digitalRead(BLUE));  // This is the most efficient way to blink an LED, no need if statements or other convoluted shit
    delay(1000);
    isConnected = false;
  }
}

// This method does not "block" the code when there's no Wi-Fi connection, hence it's known as "non-blocking"