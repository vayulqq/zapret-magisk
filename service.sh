#!/system/bin/sh

if [ -f /data/adb/modules/zapret/autostart ]; then
    su -c "zapret start"
fi
