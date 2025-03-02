#!/system/bin/sh
AUTOSTART="true"

# if [ -f /data/adb/modules/zapret/autostart ]; then
#     su -c "zapret start"
# fi

if [ "AUTOSTART" == "true" ]; then
    su -c "zapret start"
fi;
