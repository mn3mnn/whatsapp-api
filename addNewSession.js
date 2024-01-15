const { sessions, setupSession } = require('./sessions');
const qrcode = require('qrcode-terminal')

res1 =  setupSession('new1');
// res2 =  setupSession('new2');

console.log(res1);
// console.log(res2);

for (const [sessionID, client] of sessions.entries()) {
    // client.on('qr', (qr_) => {
    //     // Generate and scan this code with your phone
    //     console.log(`QR RECEIVED FOR SESSION: ${sessionID}`);
    //     qr.generate(qr_, { small: true });
    // });

    // client.on('authenticated', (session) => {
    //     console.log(`AUTHENTICATED: ${session}`);
    // });

    // client.on('auth_failure', (session) => {
    //     console.log(`AUTHENTICATION FAILURE: ${session}`);
    // });

    client.on('ready', async () => {
        console.log(`READY: ${sessionID}`);
    });

}