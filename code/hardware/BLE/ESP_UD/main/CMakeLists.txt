idf_component_register(SRCS "rc522.c" "ble_receive.c" "esp_udp.c" "wifi_epa2_ent_peap.c" "main.c"
                    INCLUDE_DIRS "."
                    EMBED_TXTFILES ca.pem)