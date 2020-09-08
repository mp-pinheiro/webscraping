import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";

import Table from "./Table";
import "./App.css";
import logo from "./logo.png";

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
                        accessor: "preco"
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
                        accessor: 'link_descricao'
                    }
                ]
            }
        ],
        []
    );

    const [data, setData] = useState([]);

    useEffect(() => {
        (async () => {
            const result = await axios("https://us-central1-kabumterimon.cloudfunctions.net/kabumterimon");

            // format to a single array instead of one per page
            var tmp = result.data;
            var formattedData = []
            tmp.forEach(function (page) {
                page.forEach(function (product) {
                    // check if object is interesting
                    if (Object.keys(product['oferta']).length && product['disponibilidade'] && !product['is_marketplace']) {
                        // calculate discount
                        product['desconto_percentual'] = Math.round(100.0 * (product['preco'] - product['preco_desconto']) / product['preco']);
                        formattedData.push(product);
                    }
                }, this);
            }, this);

            console.log(formattedData);

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