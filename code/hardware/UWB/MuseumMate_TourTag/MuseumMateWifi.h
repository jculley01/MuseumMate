#ifndef MUSEUMMATEWIFI_H
#define MUSEUMMATEWIFI_H

#include <WiFi.h>     //Wifi library
#include "esp_wpa2.h" //wpa2 library for connections to Enterprise networks
#include <WiFiUdp.h>
#include "common_definition.h"
#include "MuseumMateBattery.h"

// SSID NAME
#define SSID "eduroam" // eduroam SSID
// Identity for user with password related to his realm (organization)
// Available option of anonymous identity for federation of RADIUS servers or 1st Domain RADIUS servers
#define EAP_ANONYMOUS_IDENTITY "anonymous@bu.edu" // anonymous@example.com, or you can use also nickname@example.com
#define EAP_IDENTITY "USERNAME@bu.edu"                // nickname@example.com, at some organizations should work nickname only without realm, but it is not recommended
#define EAP_PASSWORD "PASSWORD!"              // password for eduroam account
#define EAP_USERNAME "USERNAME@bu.edu"                // the Username is the same as the Identity in most eduroam networks.

// UDP Port
#define HOST "128.197.53.112"
#define Connection_port 3330
#define Bettery_status_port 3331
#define Battery_level_port 3332
#define UWB_port 3333
#define RFID_port 3334
#define Interval_port 3335

/*
UDP Message Guide
|---Use Case---|---Port Number---|-----Message Formate------|---------------------------------------Discribtion----------------------------------------|
|  Connection  |      3330       |     "USERID, ONLINE"     |ONLINE: 1-online, 0-sleep(safe disconnect)                                                |
|Bettery_status|      3331       | "USERID, CHARGING, DONE" |(CHARGING, DONE): (0, 0)-not charging, (1, 0)-charging, (0, 1)-charging done, (1, 1)-error|
|Battery_level |      3332       | "USERID, BATTERY_LEVEL"  |BATTERY_LEVEL: 0-100%                                                                     |
|     UWB      |      3333       |   "USERID, UWB_DATA"     |UWB_DATA: top 3 UWB reading                                                               |
|     RFID     |      3334       |   "USERID, RFID_DATA"    |RFID_DATA: RFID data                                                                      |
*/

extern WiFiUDP Connection_udp;
extern WiFiUDP Bettery_status_udp;
extern WiFiUDP Battery_level_udp;
extern WiFiUDP UWB_udp;
extern WiFiUDP RFID_udp;

extern SemaphoreHandle_t xMutex;
extern int MODE; // 0: slow, 1: fast


bool connectToWiFi();
void UDP_init(WiFiUDP &udp, uint16_t port);
void UDP_send(WiFiUDP &udp, const char *host, uint16_t port, uint8_t *buffer, size_t size);
void Interval_UDP_Receive(void *pvParameters);
void connection_task(void *pvParameters);

#endif //MUSEUMMATEWIFI_H