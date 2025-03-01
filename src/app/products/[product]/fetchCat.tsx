import { createClient } from '@/utils/supabase/client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ProductNotFound from '@/components/ProductNotFound';
import { useParams } from 'next/navigation';
import { formatCurrency } from '@/components/currency';

export default function Page() {
  const { product } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(null);
  const [noMoreProducts, setNoMoreProducts] = useState(false); // Track if there are no more products
  const productIds = useRef(new Set()); // Track product IDs

  const fetchCategory = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('category')
        .select('*')
        .eq('id', product)
        .single();
      
      if (error) throw error;
      setCategory(data);
    } catch (err) {
      console.error('Error fetching category:', err.message);
    }
  }, [product]);
  
  const fetchProducts = useCallback(async (page) => {
    if (!category) return;
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*, user_profile(*)')
        .eq('category', product) // Query by category ID
        .range((page - 1) * 10, page * 10 - 1);
      
      if (error) throw error;
      
      const newProducts = data.filter(p => !productIds.current.has(p.id));
      newProducts.forEach(p => productIds.current.add(p.id));
      
      setProducts(prev => (page === 1 ? newProducts : [...prev, ...newProducts]));

      // If fewer products are returned than requested, it means no more products are available
      if (newProducts.length < 10) {
        setNoMoreProducts(true);
      }
    } catch (err) {
      console.error('Error fetching products:', err.message);
    } finally {
      setLoading(false);
    }
  }, [category]);
  
  useEffect(() => {
    setProducts([]); // Reset products when category changes
    productIds.current.clear();
    setLoading(true);
    setNoMoreProducts(false); // Reset noMoreProducts when category changes
    fetchCategory();
  }, [product, fetchCategory]);

  useEffect(() => {
    if (category) {
      fetchProducts(1);
    }
  }, [category, fetchProducts]);
  
  useEffect(() => {
    if (page > 1 && !noMoreProducts) {
      fetchProducts(page);
    }
  }, [page, fetchProducts, noMoreProducts]);
  
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      setPage(prev => prev + 1);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (loading && page === 1) {
    return <p>Loading products...</p>;
  }

  if (products.length === 0 && !loading) {
    return <ProductNotFound />;
  }

  return (
    <>
      {category && (
        <div className="relative mb-2 sm:col-span-12 col-span-2 h-44 sm:h-48 rounded overflow-hidden">
          <Image 
            src={category.banner} 
            alt="Category" 
            className="absolute inset-0 w-full h-full object-cover" 
            width={500} 
            height={500} 
          />
        </div>
      )}
      <div className="col-span-12 sm:col-span-9 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p, index) => (
          <Link href={`/product/${p.user_id}`} key={p.user_id} passHref>
            <Card className="hover:shadow-lg transition">
              <CardHeader className='p-0'>
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${p.image}`}
                  alt={p.title || `Product ${index + 1}`}
                  className="w-full h-40 object-cover rounded mb-4"
                  width={500}
                  height={500}
                />
              </CardHeader>
              <div className="px-4">
                <CardTitle className="capitalize text-sm font-bold">{p.title}</CardTitle>
                <CardDescription className="capitalize text-sm text-gray-600">
                  {p.user_profile?.shopname || 'Store Name'}
                </CardDescription>
                <div className="flex justify-between items-center mb-3">
                  <div className="capitalize text-xs text-gray-600">
                    {p.user_profile?.stat || 'State'}, {p.user_profile?.city || 'City'}
                  </div>
                  <div className="text-sm font-semibold text-green-500">
                      {formatCurrency(p.price || 0)}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
        {loading && <p>Loading more products...</p>}
        {noMoreProducts && !loading && <p>No more products available.</p>}
      </div>
    </>
  );
}
