import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, {params}: any ) {
   
    const {id} = params
    try {
        const response = await fetch(`http://localhost:3001/products/${id}`)
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`)
        }
        
        const product = await response.json()

        return NextResponse.json(product)
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}


// export async function PUT(request: NextRequest, { params }: any) {
   
    
//     return NextResponse.json()
// }


// export async function DELETE(request: NextRequest, { params }: any) {
   
    
//     return NextResponse.json()
// }
