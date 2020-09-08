const got = require('got');

function isNumber(char) {
    return char >= '0' && char <= '9';
}

module.exports.scrape = 
    async ({fullUrl, config}) => {
        try {
            const response = await got(fullUrl, headers={'user-agent': config.userAgent, 'encoding': 'binary'});

            if (response.statusCode != 200) {
                return [];
            }

            let htmlString = response.body;
            let i = htmlString.search("listagemDados");

            if (i == -1) {
                return [];
            } else {
                // get to the first '['
                i += 16;
            }

            let result = "";
            let open = 0;

            do {
                result += htmlString[i];

                if (htmlString[i] == '[') {
                    open++;
                } else if (htmlString[i] == ']'){
                    open--;
                }
                
                i++;
            } while (open != 0 && i != htmlString.length);

            products = JSON.parse(result);
            return products;

        } catch (e) {
            console.log(e);
            return [];
        }
    }

module.exports.getNumPages = async ({filterUrl, config}) => {
    try {
        const response = await got(filterUrl, 
            headers={'user-agent': config.userAgent, 
            "Content-Type": "text/plain",
            "charset": "latin1"});

        const htmlString = response.body;

        let i = htmlString.search("listagemCount");

        if (i == -1) {
            return 0;
        } else {
            i += 15;
        }

        let result = "";

        while(isNumber(htmlString[i]) || htmlString[i] == ' ') {
            result += htmlString[i];
            i++;
        }

        return parseInt(result);

    } catch (e) {
        console.log(e);
        return [];
    }
}