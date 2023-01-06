import React, { useState, useEffect } from "react"
import {createRoot} from "react-dom/client"
import Axios from "axios"
import CreateNewForm from "./components/CreateNewForm"
import ProductCard from "./components/ProductCard"

function App() {

    const [products, setProducts] = useState([])

    useEffect(() => {
        async function go() {
            const response = await Axios.get("/api/products")
            setProducts(response.data)
        }
        go()
    }, [])

    return (
        <div className="container">
            <p><a href="/">&laquo; Back to public homepage</a></p>
            <CreateNewForm setProducts={setProducts}/>
            <div className="animal-grid">
                {products.map(function(product) {
                    return <ProductCard key={product._id} name={product.name} model={product.model} photo={product.photo} id={product._id} setProducts={setProducts} />
                })}
            </div>
        </div>
    )
}


const root = createRoot(document.querySelector("#app"))
root.render(<App />)