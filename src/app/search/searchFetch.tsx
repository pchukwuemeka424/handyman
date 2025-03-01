import supabaseDb from '@/utils/supabase-db';
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import Spinner from '@/components/spinner';
import { MdErrorOutline } from 'react-icons/md';

export default function SearchProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Get search params
  const searchParams = useSearchParams();
  const search = searchParams.get('q');
  const state = searchParams.get('state');

  // Fetch products function
  const fetchProducts = useCallback(async (page, search, state) => {
    setLoading(true);
    try {
      let query = supabaseDb
        .from('products')
        .select(`
          id,
          title,
          user_id,
          price,
          image,
          user_profile (id, city, stat, shopname)
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * 10, page * 10 - 1);

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }
      else if (state) {
        query = query.ilike('state',`%${state}%`); // Ensure 'stat' matches your actual DB column
      }

      const { data, error } = await query;
      if (error) throw error;

      setProducts((prevProducts) => {
        if (page === 1) return data; // Reset on new search
        return [...prevProducts, ...data.filter((p) => !prevProducts.some((prev) => prev.id === p.id))];
      });
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to fetch products when search or state changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    fetchProducts(1, search, state);
  }, [search, state, fetchProducts]);

  // Effect to fetch more products when page changes
  useEffect(() => {
    if (page > 1) {
      fetchProducts(page, search, state);
    }
  }, [page, search, state, fetchProducts]);

  // Infinite scrolling
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 10) {
      setPage((prevPage) => prevPage + 1);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (loading && page === 1) {
    return <Spinner />;
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center py-10">
        <MdErrorOutline className="text-red-500 text-6xl mb-4" />
        <h2 className="text-lg font-semibold text-gray-700">No products found</h2>
        <p className="text-sm text-gray-500">Try searching for something else.</p>
      </div>
    );
  }

  return (
    <div className="col-span-12 sm:col-span-9 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product, index) => (
        <Link href={`/product/${product.user_id}`} key={`${product.id}-${index}`} passHref>
          <Card className="hover:shadow-lg transition">
            <CardHeader className='p-0'>
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.image}`} 
                alt={product.title || `Product ${index + 1}`}
                className="w-full h-40 sm:h-64 object-cover rounded mb-4"
                width={500}
                height={500}
              />
            </CardHeader>
            <div className="px-4">
              <CardTitle className="capitalize text-sm font-bold">{product.title}</CardTitle>
              <CardDescription className="capitalize text-sm text-gray-600">
                {product.user_profile?.shopname || 'Store Name'}
              </CardDescription>
              <div className="flex justify-between items-center mb-3">
                <div className="capitalize text-xs text-gray-600">
                  {product.user_profile?.stat || 'State'}, {product.user_profile?.city || 'City'}
                </div>
                <div className="text-sm font-semibold text-green-500">
                  ₦{product.price}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
      {loading && <p>Loading more products...</p>}
    </div>
  );
}
