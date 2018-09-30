const config = require("../config");
const firebase = require('./functions-firebase');
const file = require('./functions-file');



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
    setPixel: (x, y, color, userKey) =>
        firebase.setPixel(x, y, color)
            .then(() => file.updateLastPixelPlacementTimestamp(userKey))
            .then(() => file.updateLastOnlineTimestamp(userKey)),

    getPixels: () => firebase.getPixels(),

    secondsBeforeNextPixelPlacement: userKey => {
        return file.exists(userKey)
            .then(exists => exists ? file.open(userKey) : Promise.reject('Key not found'))
            .then(json => _secondsBeforeNextPixelPlacement(json))
    },

    registerKey: userKey => {
        return file.exists(userKey)
            .then(exists => exists ? 'User with this key is already registered' : file.create(userKey));
    }
};
