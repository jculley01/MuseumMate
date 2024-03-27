/**
 * -----------------------------------------------------------------------------
 * File Name: esp_udp.c
 * Author: Yangyang Zhang
 * Date: 2023/10/30
 * Purpose: Boston University College of Engineering
 *          2023-2024 ECE Senior Design Project - MuseumMate
 * -----------------------------------------------------------------------------
 * Copyright (c) 2023 Yangyang Zhang.
 * All rights reserved.
 * -----------------------------------------------------------------------------
 */

#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "esp_log.h"
#include "lwip/sockets.h"
#include "lwip/netdb.h"

#include "wifi_epa2_ent_peap.h"

#include "esp_udp.h"

static const char *TAG = "UDP";

void udp_send_msg(int mode, char *str)
{
    int UDP_SEND_PORT = UDP_SEND_BLE_PORT;
    if (mode == 1) {
        UDP_SEND_PORT = UDP_SEND_RFID_PORT;
    }
    
    char tx_buffer[512];
    struct sockaddr_in dest_addr;

    ESP_LOGI(TAG, "Starting sending the message \"%s\" to %s:%d", str, UDP_SEND_IP, UDP_SEND_PORT);

    int addr_family = AF_INET;
    int ip_protocol = IPPROTO_IP;
    inet_pton(AF_INET, UDP_SEND_IP, &dest_addr.sin_addr.s_addr);
    dest_addr.sin_family = addr_family;
    dest_addr.sin_port = htons(UDP_SEND_PORT);

    int sock = socket(addr_family, SOCK_DGRAM, ip_protocol);
    if (sock < 0) {
        ESP_LOGE(TAG, "Unable to create socket: errno %d", errno);
        close(sock);
        return;
    }

    int opt = 1;
    setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    xEventGroupWaitBits(wifi_event_group, CONNECTED_BIT, false, true, portMAX_DELAY);
    sprintf(tx_buffer, "%s", str);

    int err = sendto(sock, tx_buffer, strlen(tx_buffer), 0, (struct sockaddr *)&dest_addr, sizeof(dest_addr));
    if (err < 0) {
        ESP_LOGE(TAG, "Error occurred during sending: errno %d", errno);
    }

    struct timeval receiving_timeout;
    receiving_timeout.tv_sec = 5;
    receiving_timeout.tv_usec = 0;
    setsockopt(sock, SOL_SOCKET, SO_RCVTIMEO, &receiving_timeout, sizeof(receiving_timeout));

    close(sock);
}

void udp_receive(void *pvParameters)
{
    char rx_buffer[128];
    struct sockaddr_in source_addr;
    
    int addr_family = AF_INET;
    int ip_protocol = IPPROTO_IP;
    source_addr.sin_family = addr_family;
    source_addr.sin_port = htons(UDP_RECEIVE_PORT);
    source_addr.sin_addr.s_addr = htonl(INADDR_ANY);

    int sock = socket(addr_family, SOCK_DGRAM, ip_protocol);
    if (sock < 0) {
        ESP_LOGE(TAG, "Unable to create socket: errno %d", errno);
        vTaskDelete(NULL);
        return;
    }

    int opt = 1;
    setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    int err = bind(sock, (struct sockaddr *)&source_addr, sizeof(source_addr));
    if (err < 0) {
        ESP_LOGE(TAG, "Socket unable to bind: errno %d", errno);
        close(sock);
        vTaskDelete(NULL);
        return;
    }

    while (1) {
        vTaskDelay(100 / portTICK_PERIOD_MS);
        xEventGroupWaitBits(wifi_event_group, CONNECTED_BIT, false, true, portMAX_DELAY);

        socklen_t socklen = sizeof(source_addr);
        int len = recvfrom(sock, rx_buffer, sizeof(rx_buffer) - 1, 0, (struct sockaddr *)&source_addr, &socklen);

        if (len < 0) {
            ESP_LOGE(TAG, "recvfrom failed: errno %d", errno);
            continue;  // Continue the loop instead of breaking out
        } else if (len == 0) {
            ESP_LOGE(TAG, "No data received or connection closed by the peer.");
            continue;
        } else {
            rx_buffer[len] = 0;
            ESP_LOGI(TAG, "Received %d bytes from %s:", len, inet_ntoa(source_addr.sin_addr.s_addr));
            ESP_LOGI(TAG, "%s", rx_buffer);
        }
    }

    close(sock);
    vTaskDelete(NULL);
}


// /**
//  * -----------------------------------------------------------------------------
//  * File Name: esp_udp.c
//  * Author: Yangyang Zhang
//  * Date: 2023/10/30
//  * Purpose: Boston University College of Engineering
//  *          2023-2024 ECE Senior Design Project - MuseumMate
//  * -----------------------------------------------------------------------------
//  * Copyright (c) 2023 Yangyang Zhang.
//  * All rights reserved.
//  * -----------------------------------------------------------------------------
//  */

// #include <string.h>
// #include "freertos/FreeRTOS.h"
// #include "freertos/task.h"
// #include "freertos/event_groups.h"
// #include "esp_log.h"
// #include "lwip/sockets.h"
// #include "lwip/netdb.h"

// #include "wifi_epa2_ent_peap.h"

// #include "esp_udp.h"

// static const char *TAG = "UDP";

// void udp_send_msg(int mode, char *str)
// {
//     // DNS lookup
//     const struct addrinfo hints = {
//         .ai_family = AF_INET,
//         .ai_socktype = SOCK_DGRAM,
//     };
//     struct addrinfo *res;
//     int err;
//     err = getaddrinfo(UDP_SEND_HOSTNAME, NULL, &hints, &res);
//     if (err != 0 || res == NULL) {
//         ESP_LOGE(TAG, "DNS lookup failed err=%d res=%p", err, res);
//         return;
//     }
//     char UDP_SEND_IP[100];
//     struct sockaddr_in *ipv4;
//     if (res->ai_family == AF_INET) {
//         ipv4 = (struct sockaddr_in *)res->ai_addr;
//         inet_ntop(res->ai_family, &ipv4->sin_addr, UDP_SEND_IP, sizeof(UDP_SEND_IP));
//         ESP_LOGI(TAG, "DNS lookup succeeded. IP=%s\n", UDP_SEND_IP);
//     } else {
//         ESP_LOGE(TAG, "Got ipv4 error\n");
//     }
//     freeaddrinfo(res);

//     // Send UDP packet
//     int UDP_SEND_PORT = UDP_SEND_BLE_PORT;
//     if (mode == 0) {
//         UDP_SEND_PORT = UDP_SEND_BLE_PORT;
//     } else if (mode == 1) {
//         UDP_SEND_PORT = UDP_SEND_RFID_PORT;
//     }
    
//     char tx_buffer[512];
//     struct sockaddr_in dest_addr;

//     ESP_LOGI(TAG, "Starting sending the message \"%s\" to %s:%d", str, UDP_SEND_IP, UDP_SEND_PORT);

//     int addr_family = AF_INET;
//     int ip_protocol = IPPROTO_IP;
//     inet_pton(AF_INET, UDP_SEND_IP, &dest_addr.sin_addr.s_addr);
//     dest_addr.sin_family = addr_family;
//     dest_addr.sin_port = htons(UDP_SEND_PORT);

//     int sock = socket(addr_family, SOCK_DGRAM, ip_protocol);
//     if (sock < 0) {
//         ESP_LOGE(TAG, "Unable to create socket: errno %d", errno);
//         close(sock);
//         return;
//     }

//     int opt = 1;
//     setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

//     xEventGroupWaitBits(wifi_event_group, CONNECTED_BIT, false, true, portMAX_DELAY);
//     sprintf(tx_buffer, "%s", str);

//     err = 0;
//     err = sendto(sock, tx_buffer, strlen(tx_buffer), 0, (struct sockaddr *)&dest_addr, sizeof(dest_addr));
//     if (err < 0) {
//         ESP_LOGE(TAG, "Error occurred during sending: errno %d", errno);
//     }

//     struct timeval receiving_timeout;
//     receiving_timeout.tv_sec = 5;
//     receiving_timeout.tv_usec = 0;
//     setsockopt(sock, SOL_SOCKET, SO_RCVTIMEO, &receiving_timeout, sizeof(receiving_timeout));

//     close(sock);
// }

// void udp_receive(void *pvParameters)
// {
//     char rx_buffer[128];
//     struct sockaddr_in source_addr;
    
//     int addr_family = AF_INET;
//     int ip_protocol = IPPROTO_IP;
//     source_addr.sin_family = addr_family;
//     source_addr.sin_port = htons(UDP_RECEIVE_PORT);
//     source_addr.sin_addr.s_addr = htonl(INADDR_ANY);

//     int sock = socket(addr_family, SOCK_DGRAM, ip_protocol);
//     if (sock < 0) {
//         ESP_LOGE(TAG, "Unable to create socket: errno %d", errno);
//         vTaskDelete(NULL);
//         return;
//     }

//     int opt = 1;
//     setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

//     int err = bind(sock, (struct sockaddr *)&source_addr, sizeof(source_addr));
//     if (err < 0) {
//         ESP_LOGE(TAG, "Socket unable to bind: errno %d", errno);
//         close(sock);
//         vTaskDelete(NULL);
//         return;
//     }

//     while (1) {
//         vTaskDelay(100 / portTICK_PERIOD_MS);
//         xEventGroupWaitBits(wifi_event_group, CONNECTED_BIT, false, true, portMAX_DELAY);

//         socklen_t socklen = sizeof(source_addr);
//         int len = recvfrom(sock, rx_buffer, sizeof(rx_buffer) - 1, 0, (struct sockaddr *)&source_addr, &socklen);

//         if (len < 0) {
//             ESP_LOGE(TAG, "recvfrom failed: errno %d", errno);
//             continue;  // Continue the loop instead of breaking out
//         } else if (len == 0) {
//             ESP_LOGE(TAG, "No data received or connection closed by the peer.");
//             continue;
//         } else {
//             rx_buffer[len] = 0;
//             ESP_LOGI(TAG, "Received %d bytes from %s:", len, inet_ntoa(source_addr.sin_addr.s_addr));
//             ESP_LOGI(TAG, "%s", rx_buffer);
//         }
//     }

//     close(sock);
//     vTaskDelete(NULL);
// }