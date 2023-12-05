#ifndef BLE_RECEIVE_H
#define BLE_RECEIVE_H

#include <stdio.h>
#include "esp_system.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "esp_bt.h"
#include "esp_gap_ble_api.h"
#include "string.h"
#include "esp_bt_main.h"

#include "esp_udp.h"

#define TARGET_MESSAGE "Hello From Beacon 1"

#define MACSTR "%02x:%02x:%02x:%02x:%02x:%02x"

extern esp_ble_scan_params_t scan_params;

typedef struct {
    esp_bd_addr_t address; // Device MAC address
    int32_t rssi_values[10]; // Array to store 10 RSSI values
    int rssi_count; // Count of currently received RSSI
} device_info_t;

void gap_event_handler(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param);
void ble_init(void);

#endif // BLE_RECEIVE_H