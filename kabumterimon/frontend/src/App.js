import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";

import Table from "./Table";
import "./App.css";
import logo from "./logo.png";

// Custom component to render Genres 
const Links = (value) => {
    // Loop through the array and create a badge-like component instead of a comma-separated string
    return (
        <a href={value.url} target="_blank" rel="noopener noreferrer">Link</a>
    );
};

function App() {
    const columns = useMemo(
        () => [
            {
                Header: "Produtos",
                columns: [
                    {
                        Header: "Nome",
                        accessor: "nome"
                    },
                    {
                        Header: "Preço Total",
                        accessor: "preco_real"
                    },
                    {
                        Header: "Preço Desconto",
                        accessor: "preco_desconto"
                    },
                    {
                        Header: "Desconto Percentual",
                        accessor: "desconto_percentual",
                    },
                    {
                        Header: "Link",
                        accessor: 'link_descricao',
                        Cell: ({ cell: { value } }) => <Links url={value} />
                    }
                ]
            }
        ],
        []
    );

    const [data, setData] = useState([]);

    useEffect(() => {
        (async () => {
            const result = await axios.get("https://storage.googleapis.com/download/storage/v1/b/kbt-products-landing/o/results.json?alt=media",
                {
                    "headers": {
                        'Content-Type': 'application/json'
                    }
                });

            // format to a single array instead of one per page
            var tmp = result.data;
            var formattedData = []
            tmp.forEach(function (page) {
                page.forEach(function (product) {
                    // check if object is interesting
                    if (Object.keys(product['oferta']).length && product['disponibilidade'] && !product['is_marketplace']) {
                        // get actual price
                        product['preco_real'] = Math.max(product['preco'], product['preco_antigo']);

                        // calculate discount
                        product['desconto_percentual'] = Math.round(100.0 * (product['preco_real'] - product['preco_desconto']) / product['preco_real']) + "%";

                        // fix link
                        product['link_descricao'] = "https://kabum.com.br/" + product['link_descricao']

                        formattedData.push(product);
                    }
                }, this);
            }, this);

            setData(formattedData);
        })();
    }, []);

    return (
        <div className="App">
            <img alt="logo" className="logo" src={logo} />
            <Table columns={columns} data={data} />
        </div>
    );
}

export default App;