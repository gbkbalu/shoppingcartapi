printf "pulling the latest changes from git.................................................................\n"
sleep 1
git pull
printf "git pull done.......................................................................................\n"
sleep 1
printf "stopping the server\n"
sleep 1
forever stop server.js
printf "stop server was done:...............................................................................\n"
sleep 1
printf "starting the server:................................................................................\n"
sleep 1
printf "starting............................................................................................\n"
rm -f /root/.forever/fakeapp8075.log
rm -rf *.log
forever start -o out.log -e err.log -l fakeapp8075.log server.js

