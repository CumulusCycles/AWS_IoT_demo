import time
import datetime;
import paho.mqtt.client as mqtt
import ssl
import json
import _thread

def on_connect(client, userdata, flags, rc):
    print("Connected to AWS IoT: " + str(rc))

client = mqtt.Client()
client.on_connect = on_connect
client.tls_set(ca_certs='./rootCA.pem', certfile='./certificate.pem.crt', keyfile='./private.pem.key', tls_version=ssl.PROTOCOL_SSLv23)
client.tls_insecure_set(True)
client.connect("YOUR_ENDPOINT_HERE", 8883, 60)

distances = [50, 45, 40, 35, 30, 25, 24, 23, 22, 20, 15, 10, 9, 7, 5, 1]

def publishData(txt):
    print(txt)

    for d in distances:
        distance = d
        print ("Measured Distance = %.1f cm" % distance)

        status = ""
        if distance >= 25:
            status = "GREEN"
        elif distance <= 24 and distance >= 10:
            status = "YELLOW"
        else:
            status = "RED"

        timestamp = datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
        client.publish("raspi/data", payload=json.dumps({"timestamp": timestamp, "distance": distance, "status": status}), qos=0, retain=False)    
        time.sleep(5)

    for d in reversed(distances):
        distance = d
        print ("Measured Distance = %.1f cm" % distance)

        status = ""
        if distance >= 25:
            status = "GREEN"
        elif distance <= 24 and distance >= 10:
            status = "YELLOW"
        else:
            status = "RED"

        timestamp = datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
        client.publish("raspi/data", payload=json.dumps({"timestamp": timestamp, "distance": distance, "status": status}), qos=0, retain=False)    
        time.sleep(5)

    return 0

_thread.start_new_thread(publishData,("Spin-up new Thread...",))

client.loop_forever()
