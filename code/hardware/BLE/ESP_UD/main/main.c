/**
 * -----------------------------------------------------------------------------
 * File Name: main.c
 * Author: Yangyang Zhang
 * Date: 2023/10/30
 * Purpose: Boston University College of Engineering
 *          2023-2024 ECE Senior Design Project - MuseumMate
 * -----------------------------------------------------------------------------
 * Copyright (c) 2023 Yangyang Zhang.
 * All rights reserved.
 * -----------------------------------------------------------------------------
 */

#include <stdio.h>
#include "wifi_epa2_ent_peap.h"
#include "esp_udp.h"
#include "ble_receive.h"
#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include <inttypes.h>
#include "rc522.h"
#include "esp_mac.h"
#include "esp_bt.h"

#define LED 13

static const char *TAG = "MAIN";

esp_bd_addr_t device_ble_mac;

void led_init(void) {
    gpio_reset_pin(LED);
    gpio_set_direction(LED, GPIO_MODE_OUTPUT);
}

void blink_led(void *pvParameters) {
    while(1) {
        gpio_set_level(LED, 0);
        vTaskDelay(10000 / portTICK_PERIOD_MS);
        gpio_set_level(LED, 1);
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
}

static rc522_handle_t scanner;

static void rc522_handler(void* arg, esp_event_base_t base, int32_t event_id, void* event_data)
{
    rc522_event_data_t* data = (rc522_event_data_t*) event_data;

    switch(event_id) {
        case RC522_EVENT_TAG_SCANNED: {
                rc522_tag_t* tag = (rc522_tag_t*) data->ptr;
                ESP_LOGI("RC522", "Tag scanned (sn: %" PRIu64 ")", tag->serial_number);
                char buffer[64];
                snprintf(buffer, sizeof(buffer), MACSTR ", %" PRIu64, MAC2STR(device_ble_mac), tag->serial_number);
                udp_send_msg(RFID, buffer);
            }
            break;
    }
}

rc522_config_t config = {
    .spi.host = VSPI_HOST,
    .spi.miso_gpio = 14,
    .spi.mosi_gpio = 32,
    .spi.sck_gpio = 22,
    .spi.sda_gpio = 23,
};

void app_main(void)
{
    led_init();
    xTaskCreate(&blink_led, "blink_led", 4096, NULL, 5, NULL);
    ESP_ERROR_CHECK( nvs_flash_init() );
    initialise_wifi();
    xTaskCreate(&wifi_connect, "wifi_connect", 4096, NULL, 5, NULL);
    vTaskDelay(10000 / portTICK_PERIOD_MS);

    ble_init();
    esp_ble_gap_set_scan_params(&scan_params);

    esp_read_mac(device_ble_mac, ESP_MAC_BT);
    rc522_create(&config, &scanner);
    rc522_register_events(scanner, RC522_EVENT_ANY, rc522_handler, NULL);
    rc522_start(scanner);
}