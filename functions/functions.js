const config = require("../config");
const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp(require('../firebase.config'));
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
const pixelsRef = db.collection('pixels');

const path = require('path');
const fs = require('fs');

_getSnapshotToArray = snapshot => {
    const arr = [];
    snapshot.forEach(doc => arr.push(doc.data()));
    return arr;
};

_getPixelFirebaseId = (x, y) =>
    pixelsRef.where('x', '==', x).where('y', '==', y).get()
        .then(snapshot => {
            let id = null;
            snapshot.forEach(doc => id = doc.id);
            return id;
        });


const filePath = path.resolve(__dirname, '..', 'keys');

_getFileLocation = userKey => path.resolve(filePath, userKey + '.json');

_fileExists = userKey => {
    if (!fs.existsSync(filePath)) fs.mkdirSync(filePath);
    return new Promise(resolve => fs.exists(_getFileLocation(userKey), exists => resolve(exists)));
};

_openFile = userKey => new Promise((resolve, reject) => {
    fs.readFile(_getFileLocation(userKey), (err, data) => err ? reject(err) : resolve(JSON.parse(data)));
});

_createFile = userKey => {
    return _writeFile({ key: userKey, lastPixelPlacementTimestamp: Date.now() });
};

_writeFile = object => {
    return new Promise((resolve, reject) => fs.writeFile(
        _getFileLocation(object.key),
        JSON.stringify(object),
        err => err ? reject(err) : resolve('Registered!')))
};

_addNewLastPixelPlacementTimestamp = userKey => {
    _openFile(userKey)
        .then(json => {
            json.lastPixelPlacementTimestamp = Date.now();
            return _writeFile(json)
        })
};

_secondsBeforeNextPixelPlacement = jsonContentOfFile => {
    let seconds = 0;
    const secondsElapsedSinceLastPlacement = (
        new Date().getTime() - new Date(jsonContentOfFile.lastPixelPlacementTimestamp).getTime()
    ) / 1000;
    if (config.timeBetweenPixelPlacementInSeconds > secondsElapsedSinceLastPlacement)
        seconds = Math.abs(config.timeBetweenPixelPlacementInSeconds - secondsElapsedSinceLastPlacement);
    return Math.floor(seconds)
};

module.exports = {
    setPixel: (x, y, color, userKey) => _getPixelFirebaseId(x, y)
        .then(id => {
            let action;
            if (id) {
                pixelsRef
                    .doc(id)
                    .set({ x, y, color, userKey });
                action = 'replaced';
            }
            else {
                pixelsRef
                    .add({ x, y, color, userKey });
                action = 'added';
            }
            _addNewLastPixelPlacementTimestamp(userKey);
            return action
        }),

    getPixels: () => pixelsRef.get().then(snapshot => _getSnapshotToArray(snapshot)),

    secondsBeforeNextPixelPlacement: userKey => {
        return _fileExists(userKey)
            .then(exists => exists ? _openFile(userKey) : Promise.reject('Key not found'))
            .then(json => _secondsBeforeNextPixelPlacement(json))
    },

    registerKey: userKey => {
        return _fileExists(userKey)
            .then(exists => exists ? 'Already registered' : _createFile(userKey));
    }
};
