'use client'
import { Product } from "@/types/Product";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/products/api`);
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const products = await response.json();
                setProducts(products);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            {products.map((product) => (
                <div key={product._id}>
                    <li>
                        <Link href={`/products/${product._id}`}>
                            {product.name}
                        </Link>
                    </li>
                </div>
            ))}
        </div>
    );
}
