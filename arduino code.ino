#include <DHT.h>

// Define pins for the sensors
#define FlameSensor 2
#define DHTPIN 4
#define Buzzer 3
#define LED 23
#define MQ2Digital 27
#define SoundSensorAnalog 34 // Connect A0 to GPIO 34
#define SoundSensorDigital 22 // Connect D0 to GPIO 22
#define DHTTYPE DHT22  // DHT22 sensor

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  // Start the Serial Monitor
  Serial.begin(9600);

  // Setup pin modes
  pinMode(FlameSensor, INPUT);
  pinMode(LED, OUTPUT);
  pinMode(Buzzer, OUTPUT);
  pinMode(MQ2Digital, INPUT);
  pinMode(SoundSensorDigital, INPUT); // Digital output from sound sensor

  // Initialize the DHT sensor
  dht.begin();
}

void loop() {
  // Read the flame sensor value
  bool flameDetected = digitalRead(FlameSensor);
  
  // Read the MQ2 gas sensor value
  bool gasDetected = digitalRead(MQ2Digital);

  // Read the sound sensor digital value
  bool soundDetected = digitalRead(SoundSensorDigital); // Read digital value

  // Read temperature and humidity from the DHT22 sensor
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // Flame sensor logic
  if (flameDetected == LOW) {
    // Fire detected, turn on the LED and buzzer
    digitalWrite(LED, HIGH);
    digitalWrite(Buzzer, HIGH);
    Serial.println("Fire detected! LED and buzzer activated.");
  } else {
    // No fire, turn off LED and buzzer
    digitalWrite(LED, LOW);
    digitalWrite(Buzzer, LOW);
    Serial.println("No fire detected.");
  }

  // MQ2 gas sensor logic
  if (gasDetected == LOW) {
    Serial.println("Gas detected!");
    // You can add actions here like turning on a fan, etc.
  } else {
    Serial.println("No gas detected.");
  }

  // Sound sensor logic using digital output
  if (soundDetected == HIGH) {
    Serial.println("Sound detected! Beeping...");
    
    // Beep the buzzer for 500 ms
    digitalWrite(Buzzer, HIGH);
    delay(500); // Buzzer ON duration
    digitalWrite(Buzzer, LOW);
    delay(500); // Buzzer OFF duration
  } else {
    Serial.println("No sound detected.");
  }

  // Print temperature and humidity data
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor!");
  } else {
    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.print(" %\t");
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" °C");
  }

  // Delay for stability
  delay(2000);
}