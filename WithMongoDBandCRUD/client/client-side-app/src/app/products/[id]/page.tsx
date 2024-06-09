'use client'

import { Product } from "@/types/Product"
import { useEffect, useState } from "react"

interface Props {
    params: {
        id: number
    }
}
export default function ProductPage({ params }: Props) {
    const { id } = params
    let [product, setProduct] = useState<Product>({} as Product)

    useEffect(() => {
        const fetchData = async () => {
            let response = await fetch(`/products/${id}/api`)
            let product = await response.json()
            console.log(product);
            
            if (product) {
                setProduct(product)
            }
        }
        fetchData()
    }, [id])

    return (
        <div>
            <img style={{width: 500, height: 400}} src={product.imageUrl}/>
            <h1>{product.name}</h1>
            <h1>{product.description}</h1>
            <h1>{product.price}</h1>
        </div>
    )
}