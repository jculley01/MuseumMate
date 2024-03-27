#include <stdio.h>
#include "esp_system.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "esp_bt.h"
#include "esp_gap_ble_api.h"
#include "string.h"
#include "esp_bt_main.h"
#include "esp_mac.h"

#include "ble_receive.h"
#include "esp_udp.h"

#define TAG "BLE_SCAN"
#define TARGET_MESSAGE "Hello From Beacon 1"

esp_bd_addr_t receiver_mac;

esp_ble_scan_params_t scan_params = {
    .scan_type              = BLE_SCAN_TYPE_ACTIVE,
    .own_addr_type          = BLE_ADDR_TYPE_PUBLIC,
    .scan_filter_policy     = BLE_SCAN_FILTER_ALLOW_ALL,
    .scan_interval          = 0x640, // 1s
    .scan_window            = 0x640, // 1s
    .scan_duplicate         = BLE_SCAN_DUPLICATE_DISABLE,
};

// List to store devices
device_info_t devices[20]; 
int device_count = 0;

void gap_event_handler(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param) {
    switch (event) {
    case ESP_GAP_BLE_SCAN_PARAM_SET_COMPLETE_EVT:
        esp_ble_gap_start_scanning(1); // 1s
        ESP_LOGI(TAG, "Start scanning...");
        break;
    case ESP_GAP_BLE_SCAN_START_COMPLETE_EVT:
        if (param->scan_start_cmpl.status == ESP_BT_STATUS_SUCCESS) {
            ESP_LOGI(TAG, "Scanning started");
        } else {
            ESP_LOGE(TAG, "Failed to start scanning, error status = %d", param->scan_start_cmpl.status);
        }
        break;
    case ESP_GAP_BLE_SCAN_RESULT_EVT:
        if (param->scan_rst.search_evt == ESP_GAP_SEARCH_INQ_RES_EVT) {
            if (memcmp(param->scan_rst.ble_adv, TARGET_MESSAGE, sizeof(TARGET_MESSAGE) - 1) == 0) {
                ESP_LOGI(TAG, "Target BLE message found!");
            
                // Find or add the device to the list
                device_info_t *device = NULL;
                for (int i = 0; i < device_count; i++) {
                    if (memcmp(devices[i].address, param->scan_rst.bda, sizeof(esp_bd_addr_t)) == 0) {
                        device = &devices[i];
                        break;
                    }
                }
                if (!device && device_count < 20) { // If device not found and list isn't full
                    device = &devices[device_count++];
                    memcpy(device->address, param->scan_rst.bda, sizeof(esp_bd_addr_t));
                    device->rssi_count = 0;
                }
                if (device && device->rssi_count < 10) {
                    // Store the RSSI value and increase the counter
                    device->rssi_values[device->rssi_count++] = param->scan_rst.rssi;
                }
            }
        } else if (param->scan_rst.search_evt == ESP_GAP_SEARCH_INQ_CMPL_EVT) {
            ESP_LOGI(TAG, "Scan window complete");
            // Evaluate and print at the end of scan interval
            char big_buffer[512]=""; 
            int temp = 0;
            for (int i = 0; i < device_count; i++) {
                if (devices[i].rssi_count >= 3) {
                    int32_t sum = 0;
                    for (int j = 0; j < devices[i].rssi_count; j++) {
                        sum += devices[i].rssi_values[j];
                    }
                    int32_t average_rssi = sum / devices[i].rssi_count;
                    // if (average_rssi > -90) {
                        char buffer[128];
                        snprintf(buffer, sizeof(buffer), MACSTR", "MACSTR", %ld", MAC2STR(devices[i].address), MAC2STR(receiver_mac), average_rssi);
                        if (strlen(big_buffer) > 0) {
                            strncat(big_buffer, ", ", sizeof(big_buffer) - strlen(big_buffer) - 1);
                        }
                        strncat(big_buffer, buffer, sizeof(big_buffer) - strlen(big_buffer) - 1);
                    // }
                    temp = temp + 1;
                }
            }
            if (strlen(big_buffer) > 0) {
                ESP_LOGI(TAG, "%s", big_buffer);
                udp_send_msg(BLE, big_buffer);
            }
            // Clear the device list for next scan interval

            printf("temp = %d\n", temp);
            
            memset(devices, 0, sizeof(devices));
            device_count = 0;
            vTaskDelay(2000 / portTICK_PERIOD_MS); // 10s
            esp_ble_gap_start_scanning(1); // 1s
        }
        break;
    case ESP_GAP_BLE_SCAN_STOP_COMPLETE_EVT:
        if (param->scan_stop_cmpl.status != ESP_BT_STATUS_SUCCESS) {
            ESP_LOGE(TAG, "Failed to stop scanning, error status = %d", param->scan_stop_cmpl.status);
        } else {
            ESP_LOGI(TAG, "Stop scanning");
        }
        break;
    default:
        break;
    }
}


void ble_init(void)
{
    esp_err_t ret;
    esp_read_mac(receiver_mac, ESP_MAC_BT);
    esp_bt_controller_config_t bt_cfg = BT_CONTROLLER_INIT_CONFIG_DEFAULT();
    ret = esp_bt_controller_init(&bt_cfg);
    if (ret) {
        ESP_LOGE(TAG, "%s initialize controller failed\n", __func__);
        return;
    }

    ret = esp_bt_controller_enable(ESP_BT_MODE_BLE);
    if (ret) {
        ESP_LOGE(TAG, "%s enable controller failed\n", __func__);
        return;
    }

    ret = esp_bluedroid_init();
    if (ret) {
        ESP_LOGE(TAG, "%s init bluetooth failed\n", __func__);
        return;
    }

    ret = esp_bluedroid_enable();
    if (ret) {
        ESP_LOGE(TAG, "%s enable bluetooth failed\n", __func__);
        return;
    }

    esp_ble_gap_register_callback(gap_event_handler);
}