#include "MuseumMateRFID.h"

MFRC522 mfrc522(SS_PIN, RST_PIN); // Instance of the class

MFRC522::MIFARE_Key key;

// Init array that will store new NUID
byte nuidPICC[4];

void RFID_setup()
{
    pinMode(POWER_PIN, OUTPUT);
    digitalWrite(POWER_PIN, HIGH);
    vTaskDelay(1000 / portTICK_PERIOD_MS);
    SPI.begin(); // Init SPI bus
    mfrc522.PCD_Init();  

    // Prepare key - all keys are set to FFFFFFFFFFFFh at chip delivery from the factory.
    for (byte i = 0; i < 6; i++)
        key.keyByte[i] = 0xFF;

    Serial.println(F("RFID Setup successfully..."));
}

char *getFamilyName()
{
    byte block;
    byte len;
    MFRC522::StatusCode status;

    byte buffer1[18];
    block = 1;
    len = 18;

    status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 1, &key, &(mfrc522.uid)); // line 834
    if (status != MFRC522::STATUS_OK)
    {
        Serial.print(F("Authentication failed: "));
        Serial.println(mfrc522.GetStatusCodeName(status));
        return nullptr;
    }

    status = mfrc522.MIFARE_Read(block, buffer1, &len);
    if (status != MFRC522::STATUS_OK)
    {
        Serial.print(F("Reading failed: "));
        Serial.println(mfrc522.GetStatusCodeName(status));
        return nullptr;
    }

    // save into a char and return
    char familyName[16];
    for (uint8_t i = 0; i < 16; i++)
    {
        if (buffer1[i] != 32)
        {
            familyName[i] = buffer1[i];
        }
    }
    // Serial.println(familyName);
    return familyName;
}

char *getFirstName()
{
    byte block;
    byte len;
    MFRC522::StatusCode status;

    byte buffer2[18];

    block = 4;
    len = 18;

    //------------------------------------------- GET FIRST NAME
    status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 4, &key, &(mfrc522.uid)); // line 834 of MFRC522.cpp file
    if (status != MFRC522::STATUS_OK)
    {
        Serial.print(F("Authentication failed: "));
        Serial.println(mfrc522.GetStatusCodeName(status));
        return nullptr;
    }

    status = mfrc522.MIFARE_Read(block, buffer2, &len);
    if (status != MFRC522::STATUS_OK)
    {
        Serial.print(F("Reading failed: "));
        Serial.println(mfrc522.GetStatusCodeName(status));
        return nullptr;
    }

    // save into a char and return
    char firstName[16];
    for (uint8_t i = 0; i < 16; i++)
    {
        if (buffer2[i] != 32)
        {
            firstName[i] = buffer2[i];
        }
    }
    // Serial.println(firstName);
    return firstName;
}

void trim(char *str)
{
    char *end;

    while (isspace((unsigned char)*str))
        str++;

    if (*str == 0)
    {
        return;
    }

    end = str + strlen(str) - 1;
    while (end > str && isspace((unsigned char)*end))
        end--;

    *(end + 1) = 0;
}

void RFID_task(void *pvParameters)
{
    RFID_setup();
    while (1)
    {
        if (xEventGroupWaitBits(chargingEventGroup, CHARGING_BIT, pdFALSE, pdFALSE, 0))
        {
            break;
        }
        // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
        if (!mfrc522.PICC_IsNewCardPresent())
        {
            continue;
        }

        // Select one of the cards
        if (!mfrc522.PICC_ReadCardSerial())
        {
            continue;
        }

        Serial.println(F("**Card Detected:**"));

        //-------------------------------------------

        mfrc522.PICC_DumpDetailsToSerial(&(mfrc522.uid)); // dump some details about the card

        // mfrc522.PICC_DumpToSerial(&(mfrc522.uid));      //uncomment this to see all blocks in hex

        //-------------------------------------------

        Serial.print(F("Name: "));

        byte block;
        byte len;
        MFRC522::StatusCode status;

        //------------------------------------------- GET FAMILY NAME
        block = 1;
        len = 18;
        byte buffer1[18];

        status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 1, &key, &(mfrc522.uid)); // line 834
        if (status != MFRC522::STATUS_OK)
        {
            Serial.print(F("Authentication failed: "));
            Serial.println(mfrc522.GetStatusCodeName(status));
            continue;
        }

        status = mfrc522.MIFARE_Read(block, buffer1, &len);
        if (status != MFRC522::STATUS_OK)
        {
            Serial.print(F("Reading failed: "));
            Serial.println(mfrc522.GetStatusCodeName(status));
            continue;
        }

        // save into a char
        char familyName[16];
        int count = 0;
        for (uint8_t i = 0; i < 16; i++)
        {
            if (buffer1[i] > 32)
            {
                familyName[count] = buffer1[i];
                count++;
            }
        }

        byte buffer2[18];

        block = 4;
        len = 18;

        //------------------------------------------- GET FIRST NAME
        status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 4, &key, &(mfrc522.uid)); // line 834 of MFRC522.cpp file
        if (status != MFRC522::STATUS_OK)
        {
            Serial.print(F("Authentication failed: "));
            Serial.println(mfrc522.GetStatusCodeName(status));
            continue;
        }

        status = mfrc522.MIFARE_Read(block, buffer2, &len);
        if (status != MFRC522::STATUS_OK)
        {
            Serial.print(F("Reading failed: "));
            Serial.println(mfrc522.GetStatusCodeName(status));
            continue;
        }

        // save into a char
        char firstName[16];
        count = 0;
        for (uint8_t i = 0; i < 16; i++)
        {
            if (buffer2[i] > 32)
            {
                firstName[count] = buffer2[i];
                count++;
            }
        }

        trim(familyName);
        trim(firstName);

        size_t Full_size = 21;
        char Full[Full_size];
        snprintf(Full, Full_size, "%s, %s%s", USERID, familyName, firstName);
        Serial.println(Full);

        uint8_t buffer[21];
        int copyLength = sizeof(buffer) - 1;
        strncpy((char *)buffer, Full, copyLength);
        buffer[copyLength] = '\0';

        UDP_send(RFID_udp, HOST, RFID_port, buffer, sizeof(buffer));

        Serial.println(F("\n**End Reading**\n"));

        delay(1000); // change value if you want to read cards faster

        mfrc522.PICC_HaltA();
        mfrc522.PCD_StopCrypto1();
    }
    xEventGroupSetBits(sleepEventGroup, RFID_FINISHED_BIT);
    vTaskDelete(NULL);
}