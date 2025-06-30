#!/system/bin/sh


ui_print "Копирование nfqws для $ARCH"
case "$ARCH" in
    arm64)   cp -af "$MODPATH/common/nfqws_arm64" "$MODPATH/system/bin/nfqws";;
    arm)     cp -af "$MODPATH/common/nfqws_arm" "$MODPATH/system/bin/nfqws";;
    x86)     cp -af "$MODPATH/common/nfqws_x86" "$MODPATH/system/bin/nfqws";;
    x64)     cp -af "$MODPATH/common/nfqws_x64" "$MODPATH/system/bin/nfqws";;
esac
rm -rf "$MODPATH/common"
chmod 755 "$MODPATH/system/bin/nfqws"

if ! [ -d "/data/adb/zapret" ]; then
    ui_print "Создаю директорию для zapret";
    mkdir -p "/data/adb/zapret";
fi;

ui_print "Заполняю autohosts.txt, ignore.txt, config.txt"

cat > "/data/adb/zapret/autohosts.txt" << EOL
7tv.app
amnezia.org
ampproject.org
appspot.com
avira.com
botnadzor.org
cdninstagram.com
censorship.no
censortracker.org
cloudflare-ech.com
conversations.im
discord-attachments-uploads-prd.storage.googleapis.com
discord.com
discord.gg
discord.media
discordapp.com
discordapp.net
engage.cloudflareclient.com
facebook.com
fbcdn.net
fbsbx.com
ficbook.net
files.catbox.moe
gekkk.co
ggpht.com
godaddy.com
googlevideo.com
imagedelivery.net
instagram.com
jnn-pa.googleapis.com
jut.su
linkedin.com
linktr.ee
lolz.guru
matrix.org
matrix.to
medium.com
musixmatch.com
news.google.com
nnmclub.to
notepad-plus-plus.org
ntc.party
pages.dev
patreon.com
picuki.com
play.google.com
prnt.sc
proton.me
protonmail.com
protonvpn.com
psiphon.ca
quora.com
rentry.co
rentry.org
riseup.net
roskomsvoboda.org
rutracker.org
signal.org
soundcloud.com
t.co
te-st.org
torproject.org
twimg.com
twitter.com
ulta.team
vector.im
viber.com
wide-youtube.l.google.com
windscribe.com
wixmp.com
x.com
youtu.be
youtube-nocookie.com
youtube-ui.l.google.com
youtube.com
youtubeembeddedplayer.googleapis.com
youtubei.googleapis.com
yt-video-upload.l.google.com
yt.be
ytimg.com
ytimg.l.google.com
zelenka.guru
znanija.com

EOL
chmod 666 "/data/adb/zapret/autohosts.txt";

cat > "/data/adb/zapret/ignore.txt" << EOL
accounts.google.com
ajax.googleapis.com
android.googleapis.com
blum.codes
connectivitycheck.gstatic.com
firefox.com
fonts.googleapis.com
fonts.gstatic.com
github.com
githubusercontent.com
googlesyndication.com
gosuslugi.ru
mi.com
mozilla.com
mozilla.net
mozilla.org
sberbank.ru
steamstatic.com
t2.ru
tele2.ru
tonhub.com
userapi.com
vivaldi.com
vk.com
vtb.ru
www.google.com
www.googleapis.com
www.gstatic.com
xiaomi.com
xiaomi.net

EOL
chmod 666 "/data/adb/zapret/ignore.txt";

cat > "/data/adb/zapret/config.txt" << EOL
--filter-udp=443 --hostlist={hosts} --hostlist-exclude={ignore} --dpi-desync=fake --dpi-desync-repeats=6 --dpi-desync-fake-quic={quicgoogle} --new 
--filter-udp=50000-50100 --filter-l7=discord,stun --dpi-desync=fake --dpi-desync-repeats=6 --new 
--filter-tcp=80 --hostlist-auto={hosts} --hostlist-exclude={ignore} --dpi-desync=fake,split2 --dpi-desync-autottl=2 --dpi-desync-fooling=md5sig --new 
--filter-tcp=443 --hostlist-auto={hosts} --hostlist-exclude={ignore} --dpi-desync=split2 --dpi-desync-split-seqovl=652 --dpi-desync-split-pos=2 --dpi-desync-split-seqovl-pattern={tlsgoogle}
EOL
chmod 666 "/data/adb/zapret/config.txt";

touch "/data/adb/zapret/autostart"

ui_print "Прочитайте гайд на https://wiki.malw.link/w/zapret"