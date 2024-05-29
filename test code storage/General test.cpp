#include <Arduino.h>

void setup() {
    Serial.begin(115200);
}

void loop() {
    char buffer[] = "";
    Serial.println(sizeof(buffer));
    snprintf(buffer, 50, "Sound value:%u", 4095);
    Serial.println(buffer.c_str());
    Serial.println(sizeof(buffer));
    delay(1000);
}