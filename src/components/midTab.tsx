import Link from 'next/link';
import React from 'react';
import { Store, Package, ShoppingBag } from 'lucide-react';

export default function MidTab() {
    return (
        <div className="mx-auto max-w-7xl px-4 pt-2">
            <div className="grid grid-cols-3 gap-4 md:grid-cols-3">
                <div>
                    <Link href="/vendor" passHref>
                        <div
                            className="h-28 flex flex-col items-center justify-center relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 text-white sm:text-center"
                            style={{
                                backgroundImage: "url('https://sxkmrpzbtqpraucnmnjm.supabase.co/storage/v1/object/public/web_images//nax.jpg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="absolute inset-0 bg-black opacity-50 rounded-2xl"></div>
                            <Store size={24} className="mb-1 relative z-10" />
                            <span className="text-sm font-semibold sm:text-sm relative z-10">Vendors</span>
                        </div>
                    </Link>
                </div>

                <div>
                    <Link href="/product" passHref>
                        <div
                            className="h-28 flex flex-col items-center justify-center relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 text-white sm:text-center"
                            style={{
                                backgroundImage: "url('https://sxkmrpzbtqpraucnmnjm.supabase.co/storage/v1/object/public/web_images//prpr.jpg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="absolute inset-0 bg-black opacity-50 rounded-2xl"></div>
                            <Package size={24} className="mb-1 relative z-10" />
                            <span className="text-sm font-semibold sm:text-sm relative z-10">Products</span>
                        </div>
                    </Link>
                </div>

                <div>
                    <Link href="/register" passHref>
                        <div
                            className="h-28 flex flex-col items-center justify-center relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 text-white sm:text-center"
                            style={{
                                backgroundImage: "url('https://sxkmrpzbtqpraucnmnjm.supabase.co/storage/v1/object/public/web_images//download.jpg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="absolute inset-0 bg-black opacity-50 rounded-2xl"></div>
                            <ShoppingBag size={24} className="mb-1 relative z-10" />
                            <span className="text-sm font-semibold sm:text-sm relative z-10">Create Store</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
