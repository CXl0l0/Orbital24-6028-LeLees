#include <Arduino.h>

int range1;
int range2;
int SEN;
int KY;

void setup() {
    Serial.begin(115200);
}

void loop() {
    /*
    SEN = analogRead(36);
    KY = analogRead(4);
    Serial.printf("SEN: %d; KY: %d", SEN, KY);
    Serial.println("");
    delay(500);
   */
   Serial.print(analogRead(36));
   Serial.print(" ");
   // Serial.print(analogRead(4));
   Serial.print(((analogRead(36)*analogRead(36))*4095)/(4095*4095));
   Serial.print(" ");
   if (range1 == 2200){
      range1 = 3800;
   } else {
      range1 = 2200;
   }
   Serial.print(range1);
   Serial.print(" ");
   if (range2 == 1200){
      range2 = 2800;
   } else {
      range2 = 1200;
   }
   Serial.println(range2);
   delay(2);
   
}