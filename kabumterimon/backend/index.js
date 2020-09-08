const fs = require('fs');
const pageScraper = require('./pageScraper');

function min(a, b) {
    return a < b ? a : b;
}

async function fetch(res) {
    try {
        fs.readFile('config.json', async (err, data) => {
            if (err) {
                throw err;
            }

            const config = JSON.parse(data);
            const kabumUrl = 'https://www.kabum.com.br'

            let promises = [];

            for (filter of config.filters) {
                const filterUrl = kabumUrl + '/' + filter;
                const numProducts = await pageScraper.getNumPages({ filterUrl, config });
                let numPages = numProducts / 30;

                if (numProducts % 30)
                    numPages++;

                for (let i = 1; i <= min(config.maxPages, numPages); i++) {
                    let fullUrl = filterUrl + '?pagina=' + i;
                    promises.push(pageScraper.scrape({ fullUrl, config }));
                }
            }

            Promise.all(promises)
                .then((result) => {
                    var data = JSON.stringify(result, null, 4);
                    res.send(data)
                })
                .catch(err => console.log(`Error in promises ${err}`))
        });
    } catch (e) {
        console.log('Error', e);
    }
};

exports.process = (req, res) => {
    fetch(res);
};