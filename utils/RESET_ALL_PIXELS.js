/**
 * RESET ALL PIXELS TO WHITE, e.g. { x: 0, y: 0, color: '#FFFFFF' }
 */
const firebase = require('../functions/functions-firebase');
const confirm = require('./confirm');

confirm.ask('Are you sure you want to reset all pixels in the Firestore database? (y/n)')
    .then(answer => {
        if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
            console.log('OPERATION CANCELLED! (no pixels were reset)');
            process.exit(1);
        }

        firebase.REMOVE_ALL_PIXELS(500)
            .then(x => { console.log('REMOVE SUCCESSFULL (1/2)'); return x })
            .then(() => firebase.RESET_ALL_PIXELS(500))
            .then(() => console.log('RESET SUCCESSFULL (2/2)'))
            .then(() => process.exit(1));
    });

