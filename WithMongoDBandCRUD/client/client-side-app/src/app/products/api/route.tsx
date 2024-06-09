import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: any) {
    try {
        const response = await fetch('http://localhost:3001/products')
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`)
        }
        
        const products = await response.json()

        return NextResponse.json(products)
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}
