/**
 * -----------------------------------------------------------------------------
 * File Name: esp_udp.h
 * Author: Yangyang Zhang
 * Date: 2023/10/30
 * Purpose: Boston University College of Engineering
 *          2023-2024 ECE Senior Design Project - MuseumMate
 * -----------------------------------------------------------------------------
 * Copyright (c) 2023 Yangyang Zhang.
 * All rights reserved.
 * -----------------------------------------------------------------------------
 */
#ifndef ESP_UDP_H
#define ESP_UDP_H

#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "esp_log.h"
#include "lwip/sockets.h"
#include "lwip/netdb.h"

#include "wifi_epa2_ent_peap.h"

#define UDP_SEND_IP "10.239.232.21"
#define UDP_SEND_BLE_PORT 3333
#define UDP_SEND_RFID_PORT 3334
#define UDP_RECEIVE_PORT 3333


// Defines the mode of the UDP message to use the correct port
#define BLE 0
#define RFID 1

extern EventGroupHandle_t wifi_event_group;
extern esp_netif_t *sta_netif;
extern const int CONNECTED_BIT;

void udp_send_msg(int mode, char *str);

void udp_receive(void *pvParameters);

#endif // ESP_UDP_H


// /**
//  * -----------------------------------------------------------------------------
//  * File Name: esp_udp.h
//  * Author: Yangyang Zhang
//  * Date: 2023/10/30
//  * Purpose: Boston University College of Engineering
//  *          2023-2024 ECE Senior Design Project - MuseumMate
//  * -----------------------------------------------------------------------------
//  * Copyright (c) 2023 Yangyang Zhang.
//  * All rights reserved.
//  * -----------------------------------------------------------------------------
//  */
// #ifndef ESP_UDP_H
// #define ESP_UDP_H

// #include <string.h>
// #include "freertos/FreeRTOS.h"
// #include "freertos/task.h"
// #include "freertos/event_groups.h"
// #include "esp_log.h"
// #include "lwip/sockets.h"
// #include "lwip/netdb.h"
// #include "lwip/dns.h"

// #include "wifi_epa2_ent_peap.h"

// #define UDP_SEND_HOSTNAME "museum-mate-server-necuf5ddgq-ue.a.run.app"
// #define UDP_SEND_BLE_PORT 3333
// #define UDP_SEND_RFID_PORT 4444
// #define UDP_RECEIVE_PORT 3333


// // Defines the mode of the UDP message to use the correct port
// #define BLE 0
// #define RFID 1

// extern EventGroupHandle_t wifi_event_group;
// extern esp_netif_t *sta_netif;
// extern const int CONNECTED_BIT;

// void udp_send_msg(int mode, char *str);

// void udp_receive(void *pvParameters);

// #endif // ESP_UDP_H