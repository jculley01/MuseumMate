#ifndef MUZEUMMATEBATTERY_H
#define MUZEUMMATEBATTERY_H

#include "common_definition.h"
#include "MuseumMateWifi.h"
#include "esp_sleep.h"

#define BATTERY_GPIO 35
#define CHARGE_GPIO 26
#define DONE_GPIO 25
#define BATTERY_MAX 4200
#define BATTERY_MIN 3000
#define FILTER_SIZE 20
#define DELAY 10000

#define CHARGING_BIT 0x01

#define UWB_FINISHED_BIT ( 1 << 0 )
#define RFID_FINISHED_BIT ( 1 << 1 )
#define BATTERY_FINISHED_BIT ( 1 << 2 )
#define CHARGE_FINISHED_BIT ( 1 << 3 )
#define CONNECTION_FINISH_BIT ( 1 << 4 )

extern EventGroupHandle_t chargingEventGroup;
extern EventGroupHandle_t sleepEventGroup;

void readBatteryLevelTask(void *pvParameters);
void chargingTask(void *pvParameters);

#endif // MUZEUMMATEBATTERY_H