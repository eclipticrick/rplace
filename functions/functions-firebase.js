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
            .then(id => id ?
                pixelsRef.doc(id).set({ x, y, color }) :
                pixelsRef.add({ x, y, color }))
    },

    REMOVE_ALL_PIXELS: batchSize => {
        if (!batchSize) batchSize = 100;
        if (batchSize > 500) throw Error('It\'s not possible to have a batchSize greater than 500');

        const query = pixelsRef.orderBy('__name__').limit(batchSize);

        return new Promise((resolve, reject) => deleteQueryBatch(query, batchSize, resolve, reject));

        function deleteQueryBatch(query, batchSize, resolve, reject) {
            query.get()
                .then(snapshot => {
                    if (snapshot.size === 0) return 0;
                    const batch = db.batch();
                    snapshot.docs.forEach(doc => batch.delete(doc.ref));
                    return batch.commit().then(() => snapshot.size);
                }).then(numDeleted => {
                if (numDeleted === 0) {
                    resolve();
                    return;
                }
                else console.log('-- Documents removed:', numDeleted);

                process.nextTick(() => deleteQueryBatch(query, batchSize, resolve, reject));
            }).catch(reject);
        }

    },
    RESET_ALL_PIXELS: batchSize => {
        if (!batchSize) batchSize = 100;
        if (batchSize > 500) throw Error('It\'s not possible to have a batchSize greater than 500');
        batchSize = batchSize + 1;

        const config = require('../config');

        const color = '#FFFFFF';

        const arrayOfBatches = [];

        let count = 0;
        for (let x = 0; x < config.maximumPosition.x; x++) {
            for (let y = 0; y < config.maximumPosition.y; y++) {
                if(count % batchSize === 0) {
                    arrayOfBatches.push(db.batch());
                } else {
                    // console.log(count, arrayOfBatches);
                    arrayOfBatches[Math.floor(count / batchSize)]
                        .set(pixelsRef.doc(), { x, y, color });
                }
                count++;
            }
        }

        const processBatches = function (array) {
            let p = Promise.resolve();
            array.forEach((batch) => {
                p = p.then(() => {
                    console.log('-- Documents added', batch._mutations.length);
                    return batch.commit()
                })
            });
            return p;
        };

        return processBatches(arrayOfBatches);
    }
};

