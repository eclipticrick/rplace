const path = require('path');
const fs = require('fs');

const filePath = path.resolve(__dirname, '..', 'keys');

_getLocation = userKey => path.resolve(filePath, userKey + '.json');

_write = object => {
    return new Promise((resolve, reject) => fs.writeFile(
        _getLocation(object.key),
        JSON.stringify(object),
        err => err ? reject(err) : resolve('success!')
    ))
};

_open = userKey => new Promise((resolve, reject) => {
    fs.readFile(_getLocation(userKey), (err, data) => err ? reject(err) : resolve(JSON.parse(data)));
});

_edit = (userKey, property, newValue) => {
    return _open(userKey)
        .then(json => {
            json[property] = newValue;
            return _write(json)
        });
};

module.exports = {
    exists: userKey => {
        if (!fs.existsSync(filePath)) fs.mkdirSync(filePath);
        return new Promise(resolve => fs.exists(_getLocation(userKey), exists => resolve(exists)));
    },

    open: userKey => _open(userKey),

    create: userKey =>
        _write({ key: userKey, lastPixelPlacementTimestamp: Date.now(), lastOnline: Date.now() }),

    updateLastPixelPlacementTimestamp: userKey =>
        _edit(userKey, 'lastPixelPlacementTimestamp', Date.now()),

    updateLastOnlineTimestamp: userKey =>
        _edit(userKey, 'lastOnline', Date.now())
};