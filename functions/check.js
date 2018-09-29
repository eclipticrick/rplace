const config = require('../config');

module.exports = {
    isNullOrUndefined: value => value === null || typeof value === 'undefined',
    isValidCoordinate: (x, y) => {
        return !(x < 0 || y < 0 || x > config.maximumPosition.x || y > config.maximumPosition.y);
    },
    isValidColorCode: hex => {
        let validColor = false;
        config.validColors.forEach(color => {
            if (hex.toUpperCase() === color.toUpperCase()) validColor = true
        });
        return validColor;
    },

    // TODO: make sure each user can only change pixels every 10 minutes
    canChangePixel: userKey => true
};
