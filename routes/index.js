
// TODO: set LastActive Property on session-file so the session can be deleted after not being used for a while
// TODO: delete all session-files on restart

const express = require('express');
const router = express.Router();
const functions = require('../functions/functions');
const check = require('../functions/check');
const uuid = require('uuid/v1');

router.get('/', (req, res) => res.status(200).send('Hi! How are you?'));

router.get('/time', (req, res) => {
    const key = req.query.key;

    if (check.isNullOrUndefined(key))
        return res.status(403).json({ error: 'Un-authorised' });

    functions.secondsBeforeNextPixelPlacement(key)
        .then(seconds => res.status(200).json({ seconds }))
        .catch(err => res.status(500).json({ error: err }));
});

router.get('/register', (req, res) => {
    const key = uuid();
    functions.registerKey(key)
        .then(message => res.status(200).json({ message, key }))
        .catch(err => res.status(500).json({ error: err }));
});

router.post('/pixel', (req, res) => {
    const key = req.query.key;
    let x = req.body.x;
    let y = req.body.y;
    let color = req.body.color;

    if (check.isNullOrUndefined(key))
        return res.status(403).json({ error: 'Un-authorised' });

    if (check.isNullOrUndefined(x) || check.isNullOrUndefined(y) || check.isNullOrUndefined(color))
        throw new Error('Make sure you provided an x, y and color value!');

    color = color.toUpperCase();

    if (!check.isValidCoordinate(x, y))
        throw new Error('Invalid X,Y position!');

    x = Number(x);
    y = Number(y);

    if (!check.isValidColorCode(color))
        throw new Error('Invalid color!');

    functions.secondsBeforeNextPixelPlacement(key)
        .then(seconds => {
            if (seconds !== 0) {
                return res.status(500).json({ error: `You have to wait ${ seconds } more seconds to set a pixel.` });
            }
            else {
                functions.setPixel(x, y, color, key)
                    .then(action => res.status(201).json({
                        message: `Pixel set successfully at position (x=${ x }, y=${ y })!`,
                        action: action
                    }));
            }
        });
});

router.get('/pixels', (req, res) => {
    functions.getPixels()
        .then(data => res.status(200).json(data));
});

module.exports = router;
