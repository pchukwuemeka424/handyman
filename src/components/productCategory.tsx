import React from 'react'
import Link from 'next/link'

export default function ProductCategory() {
    return (
        <div>
            {/* Product Categories */}
            <h2 className="text-lg font-bold mb-4">Product Categories</h2>
            <ul className="space-y-2">
                <li className="hover:underline cursor-pointer"><Link href="/electronics">Electronics</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/clothing">Clothing</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/home-appliances">Home Appliances</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/books">Books</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/sports">Sports</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/toys">Toys</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/beauty">Beauty</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/groceries">Groceries</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/furniture">Furniture</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/jewelry">Jewelry</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/automotive">Automotive</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/garden">Garden</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/office-supplies">Office Supplies</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/baby-products">Baby Products</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/pet-supplies">Pet Supplies</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/music">Music</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/movies">Movies</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/video-games">Video Games</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/health">Health</Link></li>
                <li className="hover:underline cursor-pointer"><Link href="/travel">Travel</Link></li>
            </ul>
        </div>
    )
}
