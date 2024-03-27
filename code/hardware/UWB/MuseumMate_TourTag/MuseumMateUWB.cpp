#include "MuseumMateUWB.h"

BeaconDistance beaconDistances[10];
int beaconCount = 0;

static uint8_t tx_poll_msg[] = {0x41, 0x88, 0, 0xCA, 0xDE, 0xE0, 'M', 'A', 'T', 'E', 0, 0};
static uint8_t rx_resp_msg[] = {0x41, 0x88, 0, 0xCA, 0xDE, 0xE1, 'X', 'X', 'X', 'X', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
static uint8_t frame_seq_nb = 0;
static uint8_t rx_buffer[20];
static uint32_t status_reg = 0;
static double tof;
static double distance;
extern dwt_txconfig_t txconfig_options;

void UWB_setup()
{
  // UART_init();

  spiBegin(PIN_IRQ, PIN_RST);
  spiSelect(PIN_SS);

  delay(2); // Time needed for DW3000 to start up (transition from INIT_RC to IDLE_RC, or could wait for SPIRDY event)

  while (!dwt_checkidlerc()) // Need to make sure DW IC is in IDLE_RC before proceeding
  {
    Serial.println("IDLE FAILED\r\n");
    while (1)
      ;
  }

  if (dwt_initialise(DWT_DW_INIT) == DWT_ERROR)
  {
    Serial.println("INIT FAILED\r\n");
    while (1)
      ;
  }

  // Enabling LEDs here for debug so that for each TX the D1 LED will flash on DW3000 red eval-shield boards.
  dwt_setleds(DWT_LEDS_ENABLE | DWT_LEDS_INIT_BLINK);

  /* Configure DW IC. See NOTE 6 below. */
  if (dwt_configure(&config)) // if the dwt_configure returns DWT_ERROR either the PLL or RX calibration has failed the host should reset the device
  {
    Serial.println("CONFIG FAILED\r\n");
    while (1)
      ;
  }

  /* Configure the TX spectrum parameters (power, PG delay and PG count) */
  dwt_configuretxrf(&txconfig_options);

  /* Apply default antenna delay value. See NOTE 2 below. */
  dwt_setrxantennadelay(RX_ANT_DLY);
  dwt_settxantennadelay(TX_ANT_DLY);

  /* Set expected response's delay and timeout. See NOTE 1 and 5 below.
   * As this example only handles one incoming frame with always the same delay and timeout, those values can be set here once for all. */
  dwt_setrxaftertxdelay(POLL_TX_TO_RESP_RX_DLY_UUS);
  dwt_setrxtimeout(RESP_RX_TIMEOUT_UUS);

  /* Next can enable TX/RX states output on GPIOs 5 and 6 to help debug, and also TX/RX LEDs
   * Note, in real low power applications the LEDs should not be used. */
  dwt_setlnapamode(DWT_LNA_ENABLE | DWT_PA_ENABLE);

  Serial.println("Range RX");
  Serial.println("Setup over........");
}

void UWB_task(void *pvParameters)
{
  UWB_setup();
  int MESSAGE_DELAY_MS = 5000;
  int interval_mode = 0;
  while (1)
  {
    if (xSemaphoreTake(xMutex, portMAX_DELAY) == pdTRUE)
    {
      interval_mode = MODE;
      xSemaphoreGive(xMutex);
    }
    Serial.print("Interval Mode: ");
    Serial.println(interval_mode);
    if (interval_mode == 0)
    {
      MESSAGE_DELAY_MS = 5000;
      Serial.println("Interval Mode: 5000ms");
    }
    else
    {
      MESSAGE_DELAY_MS = 2000;
      Serial.println("Interval Mode: 2000ms");
    }
    // Get multiple samples from each beacon
    for (int sample = 0; sample < SAMPLES; sample++)
    {
      /* Write frame data to DW IC and prepare transmission. See NOTE 7 below. */
      tx_poll_msg[ALL_MSG_SN_IDX] = frame_seq_nb;
      dwt_write32bitreg(SYS_STATUS_ID, SYS_STATUS_TXFRS_BIT_MASK);
      dwt_writetxdata(sizeof(tx_poll_msg), tx_poll_msg, 0); /* Zero offset in TX buffer. */
      dwt_writetxfctrl(sizeof(tx_poll_msg), 0, 1);          /* Zero offset in TX buffer, ranging. */

      /* Start transmission, indicating that a response is expected so that reception is enabled automatically after the frame is sent and the delay
       * set by dwt_setrxaftertxdelay() has elapsed. */
      dwt_starttx(DWT_START_TX_IMMEDIATE | DWT_RESPONSE_EXPECTED);

      /* We assume that the transmission is achieved correctly, poll for reception of a frame or error/timeout. See NOTE 8 below. */
      while (!((status_reg = dwt_read32bitreg(SYS_STATUS_ID)) & (SYS_STATUS_RXFCG_BIT_MASK | SYS_STATUS_ALL_RX_TO | SYS_STATUS_ALL_RX_ERR)))
      {
      };

      /* Increment frame sequence number after transmission of the poll message (modulo 256). */
      frame_seq_nb++;

      if (status_reg & SYS_STATUS_RXFCG_BIT_MASK)
      {
        uint32_t frame_len;

        /* Clear good RX frame event in the DW IC status register. */
        dwt_write32bitreg(SYS_STATUS_ID, SYS_STATUS_RXFCG_BIT_MASK);

        /* A frame has been received, read it into the local buffer. */
        frame_len = dwt_read32bitreg(RX_FINFO_ID) & RXFLEN_MASK;
        if (frame_len <= sizeof(rx_buffer))
        {
          dwt_readrxdata(rx_buffer, frame_len, 0);

          /* Check that the frame is the expected response from the companion "SS TWR responder" example.
           * As the sequence number field of the frame is not relevant, it is cleared to simplify the validation of the frame. */
          rx_buffer[ALL_MSG_SN_IDX] = 0;
          if (memcmp(rx_buffer, rx_resp_msg, ALL_MSG_COMMON_LEN) == 0)
          {
            uint32_t poll_tx_ts, resp_rx_ts, poll_rx_ts, resp_tx_ts;
            int32_t rtd_init, rtd_resp;
            float clockOffsetRatio;

            /* Retrieve poll transmission and response reception timestamps. See NOTE 9 below. */
            poll_tx_ts = dwt_readtxtimestamplo32();
            resp_rx_ts = dwt_readrxtimestamplo32();

            /* Read carrier integrator value and calculate clock offset ratio. See NOTE 11 below. */
            clockOffsetRatio = ((float)dwt_readclockoffset()) / (uint32_t)(1 << 26);

            /* Get timestamps embedded in response message. */
            resp_msg_get_ts(&rx_buffer[RESP_MSG_POLL_RX_TS_IDX], &poll_rx_ts);
            resp_msg_get_ts(&rx_buffer[RESP_MSG_RESP_TX_TS_IDX], &resp_tx_ts);

            /* Compute time of flight and distance, using clock offset ratio to correct for differing local and remote clock rates */
            rtd_init = resp_rx_ts - poll_tx_ts;
            rtd_resp = resp_tx_ts - poll_rx_ts;

            tof = ((rtd_init - rtd_resp * (1 - clockOffsetRatio)) / 2.0) * DWT_TIME_UNITS;
            distance = tof * SPEED_OF_LIGHT;

            /* Get the Beacon ID */
            char ID[5];
            memcpy(ID, &rx_buffer[6], 4);
            ID[4] = '\0';

            // Looking for the Beacon ID in the list
            int index = -1;
            for (int i = 0; i < beaconCount; i++)
            {
              if (strcmp(beaconDistances[i].id, ID) == 0)
              {
                index = i;
                break;
              }
            }
            if (index == -1)
            { // If the Beacon ID is not in the list, add it
              index = beaconCount++;
              strcpy(beaconDistances[index].id, ID);
            }

            // Update the readings array with the new distance, if there is space
            if (beaconDistances[index].count < MAX_READINGS)
            {
              beaconDistances[index].readings[beaconDistances[index].count++] = distance;
            }
          }
        }
      }
      else
      {
        /* Clear RX error/timeout events in the DW IC status register. */
        dwt_write32bitreg(SYS_STATUS_ID, SYS_STATUS_ALL_RX_TO | SYS_STATUS_ALL_RX_ERR);
      }
      /* Execute a delay between ranging exchanges. */
      vTaskDelay(RNG_DELAY_MS);
    }

    // Check if we have enough samples for each beacon
    Serial.print("Beacon Count: ");
    Serial.println(beaconCount);
    for (int i = 0; i < beaconCount; i++)
    {
      Serial.print("Beacon ");
      Serial.print(i);
      Serial.print(" ID: ");
      Serial.print(beaconDistances[i].id);
      Serial.print(", Readings Count: ");
      Serial.println(beaconDistances[i].count);
    }

    // Check if we have enouth beacon readings for traliteration
    if (beaconCount >= 3)
    {
      // Calculate the average distance to each beacon
      char UDP_message[53];
      int first = 1;
      int bytesWritten = 0;
      for (int i = 0; i < 3; i++) // Only consider the top 3 readings
      {
        std::sort(beaconDistances[i].readings, beaconDistances[i].readings + beaconDistances[i].count);
        int toRemove = static_cast<int>(beaconDistances[i].count * PERCENT_TO_REMOVE);
        double sum = 0;
        for (int j = toRemove; j < beaconDistances[i].count - toRemove; j++)
        {
          sum += beaconDistances[i].readings[j];
        }
        double avgDistance = sum / (beaconDistances[i].count - 2 * toRemove);
        if (first)
        {
          bytesWritten += snprintf(UDP_message + bytesWritten, sizeof(UDP_message) - bytesWritten, "%s, %s, %.2f", beaconDistances[i].id, USERID, avgDistance);
          first = 0;
        }
        else
        {
          bytesWritten += snprintf(UDP_message + bytesWritten, sizeof(UDP_message) - bytesWritten, ", %s, %s, %.2f", beaconDistances[i].id, USERID, avgDistance);
        }

        if (bytesWritten >= sizeof(UDP_message) - 1)
          break;
      }
      // Serial.println(UDP_message);

      uint8_t buffer[53];
      int copyLength = sizeof(buffer) - 1;
      strncpy((char *)buffer, UDP_message, copyLength);
      buffer[copyLength] = '\0';

      UDP_send(UWB_udp, HOST, UWB_port, buffer, sizeof(buffer));
    }

    // Reset the beacon distances
    for (int i = 0; i < beaconCount; i++)
    {
      beaconDistances[i].count = 0;
    }
    beaconCount = 0;
    vTaskDelay(MESSAGE_DELAY_MS);
    if (xEventGroupWaitBits(chargingEventGroup, CHARGING_BIT, pdFALSE, pdFALSE, 0))
    {
      break;
    }
  }
  xEventGroupSetBits(sleepEventGroup, UWB_FINISHED_BIT);
  vTaskDelete(NULL);
}

// #define MIN_BEACONS 3
// #define MIN_READINGS_PER_BEACON 30
// #define RECENT_READINGS_LIMIT 500
// #define REST_DURATION_SLOW 5000
// #define REST_DURATION_FAST 2000
// #define MAX_MEASURES 1000

// int interval_mode = 0;

// enum State
// {
//   STATE_REST,
//   STATE_MEASURE,
//   STATE_ANALYZE_SEND
// };

// void UWB_Task_Test(void *pvParameters)
// {
//   State currentState = STATE_REST;
//   TickType_t lastWakeTime;
//   UWB_setup();
//   int measureCount = 0;
//   while (1)
//   {
//     if (xSemaphoreTake(xMutex, portMAX_DELAY) == pdTRUE)
//     {
//       interval_mode = MODE;
//       xSemaphoreGive(xMutex);
//     }
//     Serial.print("Interval Mode: ");
//     if (interval_mode == 0)
//     {
//       Serial.println("Slow");
//     }
//     else
//     {
//       Serial.println("Fast");
//     }

//     switch (currentState)
//     {
//     case STATE_REST:
//       if (interval_mode == 0)
//       {
//         vTaskDelay(REST_DURATION_SLOW / portTICK_PERIOD_MS);
//       }
//       else
//       {
//         vTaskDelay(REST_DURATION_FAST / portTICK_PERIOD_MS);
//       }
//       currentState = STATE_MEASURE;
//       break;
//     case STATE_MEASURE:
//       performMeasurement();
//       if (checkMeasurements())
//       {
//         measureCount = 0;
//         currentState = STATE_ANALYZE_SEND;
//       }
//       else
//       {
//         measureCount++;
//       }
//       if (measureCount >= MAX_MEASURES)
//       {
//         measureCount = 0;
//         currentState = STATE_REST;
//       }
//       vTaskDelay(2 / portTICK_PERIOD_MS);
//       break;
//     case STATE_ANALYZE_SEND:
//       analyzeAndSendData();
//       resetMeasurements();
//       currentState = STATE_REST;
//       break;
//     }
//   }
// }

// void performMeasurement()
// {
//   // 执行测量逻辑
//   // 根据需要使用信号量保护共享资源
// }

// void updateBeaconReadings()
// {
//   // 更新beacon的读数
//   // 根据需要使用信号量保护共享资源
// }

// bool checkMeasurements()
// {
//   // 检查是否满足条件，转移到STATE_ANALYZE_SEND状态
//   // 这里可能也需要使用信号量来访问共享资源
// }

// void analyzeAndSendData()
// {
//   // 分析和发送数据逻辑
//   // 根据需要使用信号量保护共享资源
// }

// void resetMeasurements()
// {
//   // 重置测量数据
//   // 根据需要使用信号量保护共享资源
// }
