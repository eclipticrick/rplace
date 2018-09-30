exports.ask = question => {
    return new Promise(resolve => {
        const r = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        r.question(question + '\n', answer => {
            r.close();
            resolve(answer);
        });
    })
};