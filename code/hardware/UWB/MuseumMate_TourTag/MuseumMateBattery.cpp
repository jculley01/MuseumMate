#include "MuseumMateBattery.h"

bool battery_setup = false;

bool filter_setup = false;
int filterReadings[FILTER_SIZE];
int filterReadIndex = 0;
int filterCount = 0;

EventGroupHandle_t chargingEventGroup;
EventGroupHandle_t sleepEventGroup;

void setupBattery()
{
    analogReadResolution(12);
    pinMode(BATTERY_GPIO, INPUT);
    pinMode(CHARGE_GPIO, INPUT);
    pinMode(DONE_GPIO, INPUT);
    analogSetPinAttenuation(BATTERY_GPIO, ADC_11db);
    battery_setup = true;
}

void initFilter()
{
    for (int thisReading = 0; thisReading < FILTER_SIZE; thisReading++)
    {
        int adcVoltageSum = 0;
        for (int i = 0; i < 10; i++)
        {      
            int reading = analogReadMilliVolts(BATTERY_GPIO);
            adcVoltageSum += reading;

            vTaskDelay(10 / portTICK_PERIOD_MS);
        }
        filterReadings[thisReading] = adcVoltageSum / 10;
        vTaskDelay(500 / portTICK_PERIOD_MS);
    }
    Serial.println("Filter Initialized");
    filter_setup = true;
}

int updateFilter(int newReading)
{
    filterReadings[filterReadIndex] = newReading;
    filterReadIndex = (filterReadIndex + 1) % FILTER_SIZE;

    int filterTotal = 0;
    for (int i = 0; i < FILTER_SIZE; i++)
    {
        filterTotal += filterReadings[i];
    }

    return filterTotal / FILTER_SIZE;
}

int readBatteryLevel()
{
    if (!battery_setup)
    {
        setupBattery();
    }
    if (!filter_setup)
    {
        initFilter();
    }
    // uint16_t adcValue = analogRead(BATTERY_GPIO);
    // Serial.print("1st ADC Reading ");
    // Serial.println(adcValue);
    // multisampling
    int adcVoltageSum = 0;
    for (int i = 0; i < 10; i++)
    {
        int reading = analogReadMilliVolts(BATTERY_GPIO);
        adcVoltageSum += reading;

        vTaskDelay(10 / portTICK_PERIOD_MS);
    }
    int adcVoltage = adcVoltageSum / 10;
    Serial.print("Average ADC voltage Reading ");
    Serial.println(adcVoltage);
    int filteredVoltage = updateFilter(adcVoltage);
    Serial.print("Filtered ADC voltage Reading ");
    Serial.println(filteredVoltage);
    int batteryVoltage = filteredVoltage * 2;
    if (batteryVoltage < BATTERY_MIN)
    {
        return 0;
    }
    else if (batteryVoltage > BATTERY_MAX)
    {
        return 100;
    }
    int percentage = float(batteryVoltage - BATTERY_MIN) / float(BATTERY_MAX - BATTERY_MIN) * 100;
    return percentage;
}

void readBatteryLevelTask(void *pvParameters)
{
    setupBattery();
    initFilter();
    Serial.println("Battery Level set up success, Task Started");
    while (1)
    {
        int batteryLevel = readBatteryLevel();
        Serial.println("Battery Level Read Success");

        char message[10];
        snprintf(message, 10, "%s, %d", USERID, batteryLevel);
        Serial.println(message);

        uint8_t buffer[10];
        int copyLength = sizeof(buffer) - 1;
        strncpy((char *)buffer, message, copyLength);
        buffer[copyLength] = '\0';
        UDP_send(Battery_level_udp, HOST, Battery_level_port, buffer, sizeof(buffer));

        vTaskDelay(DELAY / portTICK_PERIOD_MS);

        if (xEventGroupWaitBits(chargingEventGroup, CHARGING_BIT, pdFALSE, pdFALSE, 0))
        {
            break;
        }
    }
    xEventGroupSetBits(sleepEventGroup, BATTERY_FINISHED_BIT);
    vTaskDelete(NULL);
}

void sleet_task(void *pvParameters)
{
    Serial.println("Prepare to sleep");
    xEventGroupWaitBits(sleepEventGroup, UWB_FINISHED_BIT | RFID_FINISHED_BIT | BATTERY_FINISHED_BIT | CHARGE_FINISHED_BIT | CONNECTION_FINISH_BIT, pdTRUE, pdTRUE, portMAX_DELAY);
    xEventGroupClearBits(chargingEventGroup, CHARGING_BIT);
    Serial.println("Sleeping");
    vTaskDelay(100 / portTICK_PERIOD_MS);
    esp_sleep_enable_timer_wakeup(10000000); //10s
    esp_deep_sleep_start();
}

void chargingTask(void *pvParameters)
{
    chargingEventGroup = xEventGroupCreate();
    while (1)
    {
        int chargeStatus = digitalRead(CHARGE_GPIO);
        int doneStatus = digitalRead(DONE_GPIO);
        Serial.print("charge Status ");
        Serial.println(chargeStatus);
        Serial.print("Done Status ");
        Serial.println(doneStatus);                      

        char message[12];
        snprintf(message, 12, "%s, %d, %d", USERID, chargeStatus, doneStatus);
        Serial.println(message);

        uint8_t buffer[12];
        int copyLength = sizeof(buffer) - 1;
        strncpy((char *)buffer, message, copyLength);
        buffer[copyLength] = '\0';
        UDP_send(Bettery_status_udp, HOST, Bettery_status_port, buffer, sizeof(buffer));


        if (chargeStatus == 1 || doneStatus == 1)
        {
            sleepEventGroup = xEventGroupCreate();
            xTaskCreatePinnedToCore(sleet_task, "sleet_task", 2048, NULL, 1, NULL, 1);
            vTaskDelay(200 / portTICK_PERIOD_MS);
            xEventGroupSetBits(chargingEventGroup, CHARGING_BIT);

            break;
        }

        vTaskDelay(DELAY / portTICK_PERIOD_MS);
    }
    xEventGroupSetBits(sleepEventGroup, CHARGE_FINISHED_BIT);
    vTaskDelete(NULL);
}