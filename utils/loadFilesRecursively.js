const fs = require('fs');
const path = require('path');

function loadFilesRecursively(dir, filter = file => file.endsWith('.js')) {
    let results = [];

    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            results = results.concat(loadFilesRecursively(filePath, filter));
        } else if (filter(file)) {
            results.push(filePath);
        }
    });

    return results;
}

module.exports = { loadFilesRecursively };