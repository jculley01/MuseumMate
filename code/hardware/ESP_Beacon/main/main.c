#include <stdio.h>
#include "esp_system.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "esp_bt.h"
#include "esp_bt_main.h"
#include "esp_gap_ble_api.h"

static const char *TAG = "BEACON";

#define DEVICE_NAME "Beacon 1"
#define MESSAGE "Hello From Beacon 1"

esp_ble_adv_params_t adv_params = {
    .adv_int_min       = 0x70, // 50ms
    .adv_int_max       = 0x80, // 60ms
    .adv_type          = ADV_TYPE_IND,
    .own_addr_type     = BLE_ADDR_TYPE_PUBLIC,
    .channel_map       = ADV_CHNL_ALL,
    .adv_filter_policy = ADV_FILTER_ALLOW_SCAN_ANY_CON_ANY,
};


// static void gap_event_handler(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param) {
//     switch (event) {
//     case ESP_GAP_BLE_ADV_DATA_SET_COMPLETE_EVT:
//         esp_ble_gap_start_advertising(&adv_params);
//         break;
//     default:
//         break;
//     }
// }

static void gap_event_handler(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param) {
    ESP_LOGI(TAG, "GAP event handler called with event %d", event);
    switch (event) {
    case ESP_GAP_BLE_ADV_DATA_RAW_SET_COMPLETE_EVT:
        esp_ble_gap_start_advertising(&adv_params);
        ESP_LOGI(TAG, "Advertising data set. Starting to advertise...");
        break;
    case ESP_GAP_BLE_ADV_START_COMPLETE_EVT:
        if (param->adv_start_cmpl.status == ESP_BT_STATUS_SUCCESS) {
            ESP_LOGI(TAG, "Advertising started successfully.");
        } else {
            ESP_LOGE(TAG, "Failed to start advertising. Error status = %d", param->adv_start_cmpl.status);
        }
        break;
    case ESP_GAP_BLE_ADV_STOP_COMPLETE_EVT:
        if (param->adv_stop_cmpl.status != ESP_BT_STATUS_SUCCESS) {
            ESP_LOGE(TAG, "Failed to stop advertising. Error status = %d", param->adv_stop_cmpl.status);
        } else {
            ESP_LOGI(TAG, "Stopped advertising.");
        }
        break;
    default:
        break;
    }
}


void ble_init(void)
{
    esp_err_t ret;
    esp_bt_controller_config_t bt_cfg = BT_CONTROLLER_INIT_CONFIG_DEFAULT();
    ESP_LOGI(TAG, "Initializing controller...");
    ret = esp_bt_controller_init(&bt_cfg);
    if (ret) {
        ESP_LOGE(TAG, "%s initialize controller failed\n", __func__);
        return;
    }
    ESP_LOGI(TAG, "Enabling controller...");
    ret = esp_bt_controller_enable(ESP_BT_MODE_BLE);
    if (ret) {
        ESP_LOGE(TAG, "%s enable controller failed\n", __func__);
        return;
    }
    ESP_LOGI(TAG, "Initializing bluedroid...");
    ret = esp_bluedroid_init();
    if (ret) {
        ESP_LOGE(TAG, "%s init bluetooth failed\n", __func__);
        return;
    }
    ESP_LOGI(TAG, "Enabling bluedroid...");
    ret = esp_bluedroid_enable();
    if (ret) {
        ESP_LOGE(TAG, "%s enable bluetooth failed\n", __func__);
        return;
    }
}

void app_main(void)
{
    nvs_flash_init();
    ble_init();
    ESP_LOGI(TAG, "Registering GAP callback...");
    esp_ble_gap_register_callback(gap_event_handler);
    ESP_LOGI(TAG, "Starting send message...");
    esp_ble_gap_config_adv_data_raw((uint8_t *)MESSAGE, sizeof(MESSAGE));
}