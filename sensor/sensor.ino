#include <dht.h>

#include <funshield.h>
/* 

 Animation Data - HGFEDCBA Map 
 */
const int ANIMATION[16][4] = {
  { 0x30, 0x00, 0x00, 0x00 },  // Frame 0
  { 0x79, 0x00, 0x00, 0x00 },  // Frame 1
  { 0x7f, 0x00, 0x00, 0x00 },  // Frame 2
  { 0x4f, 0x30, 0x00, 0x00 },  // Frame 3
  { 0x06, 0x79, 0x00, 0x00 },  // Frame 4
  { 0x00, 0x7f, 0x00, 0x00 },  // Frame 5
  { 0x00, 0x4f, 0x30, 0x00 },  // Frame 6
  { 0x00, 0x4f, 0x79, 0x00 },  // Frame 7
  { 0x00, 0x06, 0x7f, 0x00 },  // Frame 8
  { 0x00, 0x00, 0x7f, 0x30 },  // Frame 9
  { 0x00, 0x00, 0x4f, 0x79 },  // Frame 10
  { 0x00, 0x00, 0x06, 0x7f },  // Frame 11
  { 0x00, 0x00, 0x00, 0x7f },  // Frame 12
  { 0x00, 0x00, 0x00, 0x4f },  // Frame 13
  { 0x00, 0x00, 0x00, 0x06 },  // Frame 14
  { 0x00, 0x00, 0x00, 0x00 }   // Frame 15
};

#define TEMPERATURE_IDX 0
#define HUMIDITY_IDX 1

const int SENSOR_TYPES[2] = {
  0x78,  // "t" for temperature
  0x76,  // "H" for humidity
};

int sensor_data[2] = {
  -1,  // temperature
  -1,  // humidity
};

int curr_sensor_index = -1;  // temprature
unsigned long last_sensor_update = millis();
unsigned long last_sensor_data_publish = millis();
#define SENSOR_UPDATE_INTERVAL_MS 2000    // 2sec
#define SENSOR_PUBLISH_INTERVAL_MS 10000  // 10sec

unsigned long t = millis();
int rozdiel = 50;
int animationSpeed = 100;
const int ledPin = 13;  // LED pin number

// Animation
bool isAlert = false;
int animationFrame = 0;
bool goingRight = true;

// DTH11
dht DHT;
#define DHT11_PIN 9

// Buttons
bool buttonsState[] = { false, false, false };

void displaySegment(int segment, int pos) {
  digitalWrite(latch_pin, LOW);
  shiftOut(data_pin, clock_pin, MSBFIRST, segment);
  shiftOut(data_pin, clock_pin, MSBFIRST, 1 << pos);
  digitalWrite(latch_pin, HIGH);
}

void checkForButtons() {
  if (!digitalRead(button1_pin) || !digitalRead(button2_pin) || !digitalRead(button3_pin)) {
    if (millis() - t >= rozdiel) {
      t = millis();
      if (!digitalRead(button1_pin))
        buttonsState[0] = true;
      if (!digitalRead(button2_pin))
        buttonsState[1] = true;
      if (!digitalRead(button3_pin))
        buttonsState[2] = true;
    }
  }
}

void display() {
  if (isAlert) {
    showAnimation();

    if (millis() - t >= animationSpeed) {
      t = millis();
      updateAnimation();
    }
    if (buttonsState[0]) {
      buttonsState[0] = false;
      isAlert = false;
      getSensorData();
    }
  } else {
    if (buttonsState[1]) {
      buttonsState[1] = false;
      curr_sensor_index = TEMPERATURE_IDX;
    }
    if (buttonsState[2]) {
      buttonsState[2] = false;
      curr_sensor_index = HUMIDITY_IDX;
    }
    getSensorData();
  }
}

void showAnimation() {
  for (int i = 0; i < 4; i++) {
    displaySegment(~ANIMATION[animationFrame][i], i);
  }
}

void updateAnimation() {
  if (goingRight) {
    if (animationFrame < 14) {
      animationFrame++;
    } else {
      goingRight = false;
    }
  } else {
    if (animationFrame > 0) {
      animationFrame--;
    } else {
      goingRight = true;
    }
  }
}

void displaySensorValue(int sensorType, int value) {

  displaySegment(~SENSOR_TYPES[sensorType], 0);
  displaySegment(digits[value / 10], 2);
  displaySegment(digits[value % 10], 3);
}

void getSensorData() {
  if (millis() - last_sensor_update >= SENSOR_UPDATE_INTERVAL_MS || curr_sensor_index == -1) {
    last_sensor_update = millis();
    int chk = DHT.read11(DHT11_PIN);
    sensor_data[TEMPERATURE_IDX] = int(DHT.temperature);
    sensor_data[HUMIDITY_IDX] = int(DHT.humidity);

    if (curr_sensor_index == -1) curr_sensor_index = 0;  // Set initial index

    if (millis() - last_sensor_data_publish >= SENSOR_PUBLISH_INTERVAL_MS) {
      last_sensor_data_publish = millis();
      Serial.print(sensor_data[TEMPERATURE_IDX]);
      Serial.print(",");
      Serial.print(sensor_data[HUMIDITY_IDX]);
      Serial.print(",");
    }
  }
  displaySensorValue(curr_sensor_index, sensor_data[curr_sensor_index]);

  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');  // Read the command
    if (command == "ALERT") {
      isAlert = true;
    }
  }
}

void setup() {
  Serial.begin(9600);  // Initialize serial communication

  pinMode(button1_pin, INPUT);
  pinMode(button2_pin, INPUT);
  pinMode(button3_pin, INPUT);

  pinMode(ledPin, OUTPUT);
  pinMode(latch_pin, OUTPUT);
  pinMode(clock_pin, OUTPUT);
  pinMode(data_pin, OUTPUT);
}

void loop() {

  checkForButtons();
  display();
}