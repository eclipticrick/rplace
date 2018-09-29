const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp(require('../firebase.config'));
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
const pixelsRef = db.collection('pixels');

_getSnapshotToArray = snapshot => {
    const arr = [];
    snapshot.forEach(doc => {
        const docWithKey = doc.data();
        docWithKey.key = doc.id;
        arr.push(docWithKey)
    });
    return arr;
};

_getPixelKey = (x, y) =>
    db.collection('pixels')
        .where('x', '==', x)
        .where('y', '==', y)
        .get()
        .then(snapshot => {
            let key = null;
            snapshot.forEach(doc => key = doc.id);
            return key;
        });

module.exports = {
    setPixel: (x, y, color) => _getPixelKey(x, y)
        .then(x => { console.log(x); return x })
        .then(key => key ?
            (pixelsRef.doc(key).set({ x, y, color }).then(() => 'replaced')) :
            (pixelsRef.add({ x, y, color })).then(() => 'added')),
    getPixels: () => pixelsRef.get().then(snapshot => _getSnapshotToArray(snapshot))
};
