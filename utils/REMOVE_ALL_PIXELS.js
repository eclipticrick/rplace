/**
 * REMOVE ALL PIXELS FROM THE FIREBASE COLLECTION
 */
const firebase = require('../functions/functions-firebase');
const confirm = require('./confirm');

confirm.ask('Are you sure you want to remove all pixels in the Firestore database? (y/n)')
    .then(answer => {
        if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
            console.log('OPERATION CANCELLED! (no pixels were removed)');
            process.exit(1);
        }
        console.log('REMOVING... (0/1)');
        firebase.REMOVE_ALL_PIXELS(500)
            .then(() => console.log('REMOVE SUCCESSFULL (1/1)'))
            .then(() => process.exit(1));
    });

