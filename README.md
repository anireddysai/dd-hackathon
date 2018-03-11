# dd-hackathon

** Backed setup locally **
** run **

$npm install
$node index

on server node instacne ins running on pm2 manager,so we can ignore $node index on server.
** restart node instance **

$pm2 restart <service-name>

** check logs **
$pm2 logs

# UI Setup
** run **

$npm install
$ng server #this will run the app on port 4200

** building angular app **
$ng build # use --prod --aot for production releases

** deploy the app into server **

ng build will generate dist folder, we have to ssh/scp the files from dist folder to server