"use client";
import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import CategoryList from '@/components/category';
import Spinner from '@/components/spinner';
import supabaseDb from '@/utils/supabase-db';
import { formatCurrency } from '@/components/currency';
import HeaderMenu from '@/components/headerUser';

export default function ProductFetch() {
  const [shopDetails, setShopDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [noMoreProducts, setNoMoreProducts] = useState(false);
  const isFetching = useRef(false);

  const { store } = useParams();

  const fetchProducts = useCallback(async (page) => {
    if (isFetching.current) return;
    isFetching.current = true;
    setIsLoading(true);

    try {
      const { data, error } = await supabaseDb
        .from('user_profile')
        .select(`*, products(*)`)
        .eq('username', store)
        .single();

      if (error) throw error;

      setShopDetails(data);

      if (data?.products) {
        const newProducts = data.products.slice((page - 1) * 10, page * 10);
        if (newProducts.length === 0) {
          setNoMoreProducts(true);
        } else {
          setProducts((prevProducts) => [...prevProducts, ...newProducts]);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      isFetching.current = false;
      setIsLoading(false);
    }
  }, [store]);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100 && !isFetching.current && !noMoreProducts) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [noMoreProducts]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  if (!shopDetails?.products || shopDetails.products.length === 0) {
    return <Spinner />;
  }

  return (
    <div>
      <HeaderMenu shopDetails={shopDetails} />
      <div className="grid grid-cols-12 gap-4 p-4 mx-auto max-w-7xl">
        <CategoryList />
        <div className="col-span-12 sm:col-span-9 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2 sm:col-span-4 grid grid-cols-1">
           <Image
              src={shopDetails.banner}
              alt={shopDetails.username || 'Store Image'}
              className="w-full h-40 sm:h-64 md:h-64 object-fill rounded mb-4"
              width={500}
              height={500}
            />
          </div>
          {products.map((product, index) => (
            <Link href={`/product/${product.user_id}`} key={product.user_id || index} passHref>
              <Card className="hover:shadow-lg transition">
                <CardHeader className="p-0">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.image}`}
                    alt={product.title || `Product ${index + 1}`}
                    className="w-full h-40 sm:h-64 object-contain rounded mb-4"
                    width={500}
                    height={500}
                  />
                </CardHeader>
                <div className="px-4">
                  <CardTitle className="text-sm font-bold">{product.title}</CardTitle>
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xs text-gray-600">
                      {shopDetails.city || 'Store Location'}, {shopDetails.stat || 'City'}
                    </div>
                    <div className="text-sm font-semibold text-green-500">
                      {formatCurrency(product.price || 0)}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        {isLoading && <div className="col-span-full text-center text-gray-500">Loading more products...</div>}
        {noMoreProducts && !isLoading && (
          <div className="col-span-full text-center text-gray-500">No more images to display.</div>
        )}
      </div>
    </div>
  );
}