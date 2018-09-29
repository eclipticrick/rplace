const config = require('../config');

module.exports = {
    isNullOrUndefined: value => value === null || typeof value === 'undefined',
    isValidCoordinate: (x, y) => {
        return !(
            x < 0 ||
            y < 0 ||
            x > config.maximumPosition.x ||
            y > config.maximumPosition.y ||
            isNaN(Number(x)) ||
            isNaN(Number(y))
        );
    },
    isValidColorCode: hex => {
        let validColor = false;
        config.validColors.forEach(color => {
            if (hex.toUpperCase() === color.toUpperCase()) validColor = true
        });
        return validColor;
    },
};
