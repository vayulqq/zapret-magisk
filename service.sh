#!/system/bin/sh

if [ -f /data/adb/zapret/autostart ]; then
    su -c "zapret start"
fi