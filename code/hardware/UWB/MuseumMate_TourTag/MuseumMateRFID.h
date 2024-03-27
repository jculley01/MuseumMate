#ifndef MUZEUMMATERFID_H
#define MUZEUMMATERFID_H

#include <SPI.h>
#include <MFRC522.h>
#include "common_definition.h"
#include "MuseumMateWifi.h"
#include "MuseumMateBattery.h"

// RC522
#define SS_PIN 5
#define RST_PIN 17
#define POWER_PIN 16

#define FAMILY_NAME "MuseumMate"

void RFID_task(void *pvParameters);

#endif // MUZEUMMATERFID_H