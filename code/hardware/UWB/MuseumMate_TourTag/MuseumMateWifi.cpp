#include "MuseumMateWifi.h"

WiFiUDP Connection_udp;
WiFiUDP Bettery_status_udp;
WiFiUDP Battery_level_udp;
WiFiUDP UWB_udp;
WiFiUDP RFID_udp;
int MODE = 0; // 0: slow, 1: fast
SemaphoreHandle_t xMutex;

const static char *test_root_ca PROGMEM =
    "-----BEGIN CERTIFICATE-----\n"
    "MIIF3jCCA8agAwIBAgIQAf1tMPyjylGoG7xkDjUDLTANBgkqhkiG9w0BAQwFADCB\n"
    "iDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCk5ldyBKZXJzZXkxFDASBgNVBAcTC0pl\n"
    "cnNleSBDaXR5MR4wHAYDVQQKExVUaGUgVVNFUlRSVVNUIE5ldHdvcmsxLjAsBgNV\n"
    "BAMTJVVTRVJUcnVzdCBSU0EgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkwHhcNMTAw\n"
    "MjAxMDAwMDAwWhcNMzgwMTE4MjM1OTU5WjCBiDELMAkGA1UEBhMCVVMxEzARBgNV\n"
    "BAgTCk5ldyBKZXJzZXkxFDASBgNVBAcTC0plcnNleSBDaXR5MR4wHAYDVQQKExVU\n"
    "aGUgVVNFUlRSVVNUIE5ldHdvcmsxLjAsBgNVBAMTJVVTRVJUcnVzdCBSU0EgQ2Vy\n"
    "dGlmaWNhdGlvbiBBdXRob3JpdHkwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIK\n"
    "AoICAQCAEmUXNg7D2wiz0KxXDXbtzSfTTK1Qg2HiqiBNCS1kCdzOiZ/MPans9s/B\n"
    "3PHTsdZ7NygRK0faOca8Ohm0X6a9fZ2jY0K2dvKpOyuR+OJv0OwWIJAJPuLodMkY\n"
    "tJHUYmTbf6MG8YgYapAiPLz+E/CHFHv25B+O1ORRxhFnRghRy4YUVD+8M/5+bJz/\n"
    "Fp0YvVGONaanZshyZ9shZrHUm3gDwFA66Mzw3LyeTP6vBZY1H1dat//O+T23LLb2\n"
    "VN3I5xI6Ta5MirdcmrS3ID3KfyI0rn47aGYBROcBTkZTmzNg95S+UzeQc0PzMsNT\n"
    "79uq/nROacdrjGCT3sTHDN/hMq7MkztReJVni+49Vv4M0GkPGw/zJSZrM233bkf6\n"
    "c0Plfg6lZrEpfDKEY1WJxA3Bk1QwGROs0303p+tdOmw1XNtB1xLaqUkL39iAigmT\n"
    "Yo61Zs8liM2EuLE/pDkP2QKe6xJMlXzzawWpXhaDzLhn4ugTncxbgtNMs+1b/97l\n"
    "c6wjOy0AvzVVdAlJ2ElYGn+SNuZRkg7zJn0cTRe8yexDJtC/QV9AqURE9JnnV4ee\n"
    "UB9XVKg+/XRjL7FQZQnmWEIuQxpMtPAlR1n6BB6T1CZGSlCBst6+eLf8ZxXhyVeE\n"
    "Hg9j1uliutZfVS7qXMYoCAQlObgOK6nyTJccBz8NUvXt7y+CDwIDAQABo0IwQDAd\n"
    "BgNVHQ4EFgQUU3m/WqorSs9UgOHYm8Cd8rIDZsswDgYDVR0PAQH/BAQDAgEGMA8G\n"
    "A1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQEMBQADggIBAFzUfA3P9wF9QZllDHPF\n"
    "Up/L+M+ZBn8b2kMVn54CVVeWFPFSPCeHlCjtHzoBN6J2/FNQwISbxmtOuowhT6KO\n"
    "VWKR82kV2LyI48SqC/3vqOlLVSoGIG1VeCkZ7l8wXEskEVX/JJpuXior7gtNn3/3\n"
    "ATiUFJVDBwn7YKnuHKsSjKCaXqeYalltiz8I+8jRRa8YFWSQEg9zKC7F4iRO/Fjs\n"
    "8PRF/iKz6y+O0tlFYQXBl2+odnKPi4w2r78NBc5xjeambx9spnFixdjQg3IM8WcR\n"
    "iQycE0xyNN+81XHfqnHd4blsjDwSXWXavVcStkNr/+XeTWYRUc+ZruwXtuhxkYze\n"
    "Sf7dNXGiFSeUHM9h4ya7b6NnJSFd5t0dCy5oGzuCr+yDZ4XUmFF0sbmZgIn/f3gZ\n"
    "XHlKYC6SQK5MNyosycdiyA5d9zZbyuAlJQG03RoHnHcAP9Dc1ew91Pq7P8yF1m9/\n"
    "qS3fuQL39ZeatTXaw2ewh0qpKJ4jjv9cJ2vhsE/zB+4ALtRZh8tSQZXq9EfX7mRB\n"
    "VXyNWQKV3WKdwrnuWih0hKWbt5DHDAff9Yk2dDLWKMGwsAvgnEzDHNb842m1R0aB\n"
    "L6KCq9NjRHDEjf8tM7qtj3u1cIiuPhnPQCjY/MiQu12ZIvVS5ljFH4gxQ+6IHdfG\n"
    "jjxDah2nGN59PRbxYvnKkKj9\n"
    "-----END CERTIFICATE-----\n";

bool connectToWiFi()
{
  Serial.print("Connecting to network: ");
  Serial.println(SSID);
  WiFi.disconnect(true); // disconnect from WiFi to set new WiFi connection
  // WiFi.begin(SSID, WPA2_AUTH_PEAP, EAP_IDENTITY, EAP_USERNAME, EAP_PASSWORD, test_root_ca); //with CERTIFICATE
  WiFi.begin(SSID, WPA2_AUTH_PEAP, EAP_IDENTITY, EAP_USERNAME, EAP_PASSWORD); // without CERTIFICATE, RADIUS server EXCEPTION "for old devices" required

  unsigned long startTime = millis();
  while (WiFi.status() != WL_CONNECTED)
  {
    if (millis() - startTime > 5000) // Timeout after 5 seconds
    {
      Serial.println("WiFi connection timed out");
      return false;
    }
    delay(500);
  }

  Serial.println("WiFi is connected!");
  Serial.print("IP address set: ");
  Serial.println(WiFi.localIP().toString().c_str());

  return true;
}

void UDP_init(WiFiUDP &udp, uint16_t port)
{
  udp.begin(port);
}

void UDP_send(WiFiUDP &udp, const char *host, uint16_t port, uint8_t *buffer, size_t size)
{
  udp.beginPacket(host, port);
  udp.write(buffer, size - 1);
  udp.endPacket();
  udp.parsePacket();
}

void Interval_UDP_Receive(void *pvParameters)
{
  char incomingPacket[255]; // buffer for incoming packets
  WiFiUDP Interval_udp;
  Interval_udp.begin(Interval_port);
  Serial.println("Interval UDP Receiver Started on port 3335");
  while (1)
  {
    int packetSize = Interval_udp.parsePacket();
    if (packetSize)
    {
      // read the packet into packetBufffer
      int len = Interval_udp.read(incomingPacket, 255);
      if (len > 0)
      {
        incomingPacket[len] = 0;
      }

      Serial.print("Receive UDP Packet: ");
      Serial.println(incomingPacket);

      // convert to integer and set as mode
      if (xSemaphoreTake(xMutex, portMAX_DELAY) == pdTRUE)
      {
        MODE = atoi(incomingPacket);
        xSemaphoreGive(xMutex);
      }
    }

    vTaskDelay(1); // delay to allow other tasks to run
  }
}

void connection_task(void *pvParameters)
{
  xMutex = xSemaphoreCreateMutex();
  connectToWiFi();
  UDP_init(Connection_udp, Connection_port);
  UDP_init(Bettery_status_udp, Bettery_status_port);
  UDP_init(Battery_level_udp, Battery_level_port);
  UDP_init(UWB_udp, UWB_port);
  UDP_init(RFID_udp, RFID_port);
  while (1)
  {
    if (WiFi.status() != WL_CONNECTED)
    {
      Serial.println("WiFi connection lost, reconnecting...");
      connectToWiFi();
    }
    else
    {
      char message[8];
      snprintf(message, 8, "%s, 1", USERID);
      Serial.println(message);

      uint8_t buffer[8];
      int copyLength = sizeof(buffer) - 1;
      strncpy((char *)buffer, message, copyLength);
      buffer[copyLength] = '\0';
      UDP_send(Connection_udp, HOST, Connection_port, buffer, sizeof(buffer));

      if (xEventGroupWaitBits(chargingEventGroup, CHARGING_BIT, pdFALSE, pdFALSE, 0))
      {
        char message[8];
        snprintf(message, 8, "%s, 0", USERID);
        Serial.println(message);

        uint8_t buffer[8];
        int copyLength = sizeof(buffer) - 1;
        strncpy((char *)buffer, message, copyLength);
        buffer[copyLength] = '\0';
        UDP_send(Connection_udp, HOST, Connection_port, buffer, sizeof(buffer));
        vTaskDelay(200 / portTICK_PERIOD_MS);
        WiFi.disconnect(true);
        break;
      }
    }
    vTaskDelay(60000 / portTICK_PERIOD_MS);
  }
  xEventGroupSetBits(sleepEventGroup, CONNECTION_FINISH_BIT);
  vTaskDelete(NULL);
}