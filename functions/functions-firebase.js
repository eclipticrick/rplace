const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp(require('../firebase.config'));
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
const pixelsRef = db.collection('pixels');

_snapshotToArray = snapshot => {
    const arr = [];
    snapshot.forEach(doc => arr.push(doc.data()));
    return arr;
};

_getPixelId = (x, y) =>
    pixelsRef
        .where('x', '==', x)
        .where('y', '==', y)
        .get()
        .then(snapshot => {
            let id = null;
            snapshot.forEach(doc => id = doc.id);
            return id;
        });

module.exports = {

    getPixels: () => pixelsRef.get()
        .then(snapshot => _snapshotToArray(snapshot)),

    setPixel: (x, y, color) => {
        return _getPixelId(x, y)
            .then(id => {
                if (id) {
                    pixelsRef.doc(id).set({ x, y, color })
                } else {
                    pixelsRef.add({ x, y, color })
                }
            })
    }
};

