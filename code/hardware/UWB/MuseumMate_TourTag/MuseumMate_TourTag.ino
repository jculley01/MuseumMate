#include "common_definition.h"
#include "MuseumMateWifi.h"
#include "MuseumMateUWB.h"
#include "MuseumMateRFID.h"
#include "MuseumMateBattery.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

void setup()
{
  Serial.begin(115200);
  delay(10);
  Serial.println(F("Starting Setup"));

  xTaskCreatePinnedToCore(connection_task, "connection_task", 2048, NULL, 1, NULL, 1);
  xTaskCreatePinnedToCore(readBatteryLevelTask, "readBatteryLevelTask", 2048, NULL, 1, NULL, 1);
  xTaskCreatePinnedToCore(chargingTask, "chargingTask", 2048, NULL, 1, NULL, 1);
  vTaskDelay(2000 / portTICK_PERIOD_MS);
  
  xTaskCreatePinnedToCore(UWB_task, "UWB_task", 4096, NULL, 1, NULL, 1);
  xTaskCreatePinnedToCore(RFID_task, "RFID_task", 2048, NULL, 1, NULL, 1);
  xTaskCreatePinnedToCore(Interval_UDP_Receive, "Interval_UDP_Receive", 2048, NULL, 1, NULL, 1);

}

void loop()
{
}
