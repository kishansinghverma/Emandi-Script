#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <EEPROM.h>
#include <cstdlib>

const char* ssid = "HappyHome";
const char* password = "145789632*";
const char* mqtt_server = "192.168.2.100";
int pins[4]={14,12,13,15};

WiFiClient espClient;
PubSubClient client(espClient);

int ParseInt(byte b){
  return (int)b - 48;
}

char ParseByte(int i){
  return (byte)(i+48);
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.println("\nRecieved message");
  
  int devs[length/2];
  int states[length/2];

  for(int i=0; i<length/2; i++){
    devs[i]=ParseInt(payload[i]);
    states[i]=ParseInt(payload[(length/2)+i]);
  }
  
  DoSwitch(devs, states, length/2);
}

void WriteToRom(int devId, int state){
  Serial.print("Writing to EEPROM[");
  Serial.print(devId);
  Serial.print("] = ");
  Serial.print(state);
  
  if(EEPROM.read(devId) == state)
    Serial.println("\nWrite not required");
  else{
    EEPROM.write(devId, state);
    Serial.println("\nWritten to ROM");
  }
}

void UpdateStatus(){
  byte message[4];
  
  for(int i=0; i<4; i++)
    message[i] = ParseByte(EEPROM.read(i));
  client.publish("status/main", message, 4, true);
  
  Serial.println("Status updated for devices");
}

void DoSwitch(int devs[], int states[], int length){
  for(int i=0; i<length; i++){
    WriteToRom(devs[i], states[i]);
    WriteToPin(devs[i], states[i]);
  }
  EEPROM.commit();
  UpdateStatus();
}

void WriteToPin(int devId, int state){
  digitalWrite(pins[devId], state==0);

  Serial.print("Updated output pin[");
  Serial.print(devId);
  Serial.print("] = ");
  Serial.println(state);
}

void SetPinMode(){
  Serial.println("Initializing output pins...");
  
  pinMode(pins[0], OUTPUT);
  pinMode(pins[1], OUTPUT);
  pinMode(pins[2], OUTPUT);
  pinMode(pins[3], OUTPUT);
}

void InitFromROM(){
  Serial.println("Reading from ROM...");
  EEPROM.begin(512);
  
  for(int i=0; i<4; i++)
    WriteToPin(i, EEPROM.read(i));
}

void SetupWifi() {
  Serial.print("Connecting to Wifi.");
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wifi");
  randomSeed(micros());
}

void Reconnect() {
  while (!client.connected()) {
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str()))
      client.subscribe("switch/main
      
      ");
    else
      delay(5000);
  }
}

void setup() {
  Serial.begin(9600);
  while(! Serial);
  delay(1000);
  
  SetPinMode();
  InitFromROM();
  SetupWifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    Reconnect();
  }
  client.loop();
}
