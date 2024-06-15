#include <Arduino.h>

#define AO 36
int range;

void setup(){
  Serial.begin(115200);
}

void loop(){
  int sound_value;
  sound_value = analogRead(A0);
  Serial.print(sound_value);
  if (range == 2200){
      range = 3800;
  } else {
      range = 2200;
  }
  Serial.print(" ");
  Serial.println(range);
  delay(2);
}
