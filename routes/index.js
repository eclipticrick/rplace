const express = require('express');
const router = express.Router();
const functions = require('../functions/functions');
const check = require('../functions/check');

router.get('/', (req, res) => {
    res.status(200).send('Hi! How are you?');
});

router.get('/time', (req, res) => {
    functions.secondsBeforeNextPixelPlacement()
        .then(seconds => res.status(200).json({ seconds }));
});

router.post('/register', (req, res) => {
    const key = req.body.key;

    if (check.isNullOrUndefined(key))
        res.status(403).json({ error: 'Un-authorised' });

    functions.registerKey(key)
        .then(message => res.status(200).json({ message }));
});

router.post('/pixel', (req, res) => {
    const x = req.body.x;
    const y = req.body.y;
    const key = req.body.key;
    let color = req.body.color;

    if (check.isNullOrUndefined(key))
        res.status(403).json({ error: 'Un-authorised' });

    if (check.isNullOrUndefined(x) || check.isNullOrUndefined(y) || check.isNullOrUndefined(color))
        throw new Error('Make sure you provided an x, y and color value!');

    color = color.toUpperCase();

    if (!check.isValidCoordinate(x, y))
        throw new Error('Invalid X,Y position!');

    if (!check.isValidColorCode(color))
        throw new Error('Invalid color!');

    if (!check.canChangePixel(key))
        throw new Error(`You have to wait ${functions.secondsBeforeNextPixelPlacement()} more seconds to set a pixel.`);

    functions.setPixel(x, y, color, key)
        .then(action => res.status(201).json({
            message: `Pixel set successfully at position (x=${ x }, y=${ y })!`,
            action: action
        }));
});

router.get('/pixels', (req, res) => {
    functions.getPixels()
        .then(data => res.status(200).json(JSON.stringify(data)));
});

module.exports = router;
