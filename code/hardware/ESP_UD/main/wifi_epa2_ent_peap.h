/**
 * -----------------------------------------------------------------------------
 * File Name: wifi_epa2_ent_peap.h
 * Author: Yangyang Zhang
 * Date: 2023/10/30
 * Purpose: Boston University College of Engineering
 *          2023-2024 ECE Senior Design Project - MuseumMate
 * -----------------------------------------------------------------------------
 * Copyright (c) 2023 Yangyang Zhang.
 * All rights reserved.
 * -----------------------------------------------------------------------------
 */

#ifndef WIFI_EPA2_ENT_PEAP_H
#define WIFI_EPA2_ENT_PEAP_H

#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "esp_wifi.h"
#include "esp_wpa2.h"
#include "esp_event.h"
#include "esp_log.h"
#include "esp_netif.h"

#define WIFI_SSID CONFIG_WIFI_SSID
#define EAP_ID CONFIG_EAP_ID
#define EAP_USERNAME CONFIG_EAP_USERNAME
#define EAP_PASSWORD CONFIG_EAP_PASSWORD

void event_handler(void* arg, esp_event_base_t event_base,
                                int32_t event_id, void* event_data);
void initialise_wifi(void);

void wifi_connect(void *pvParameters);

#endif // WIFI_EPA2_ENT_PEAP_H