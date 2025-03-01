import React, { useEffect, useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; 
import Slider from "react-slick";
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function FeatureProducts<T>({ currentProductId, currentProductTitle }: { currentProductId: T; currentProductTitle: T }) {
  const [featureProducts, setFeatureProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatureProducts = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          user_profile(*)
        `)
        .neq('id', currentProductId) // Exclude current product
        .ilike('title', `%${currentProductTitle}%`) // Filter by title
        .limit(10);

      if (error) {
        setError(error.message);
      } else {
        setFeatureProducts(data);
      }
    };

    fetchFeatureProducts();
  }, [currentProductId, currentProductTitle]);

  const settings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 6000,
    cssEase: "linear",
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  if (error) {
    return <p className="text-center text-red-600">Error: {error}</p>;
  }

  return (
    <Slider {...settings}>
      {featureProducts.map((product) => (
        <div key={product.id}>
          <Link href={`/product/${product.user_id}`} key={product.user_id} passHref>
            <Card className="hover:shadow-lg transition mx-1 p-0">
              <CardHeader className='p-0'>
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.image}`} 
                  alt={product.title}
                  className="w-full h-40 object-contain rounded mb-4"
                  width={500}
                  height={500}
                />
              </CardHeader>
              <div className="px-4">
                <CardTitle className="capitalize text-sm font-bold">{product.title}</CardTitle>
                <CardDescription className="capitalize text-sm text-gray-600">
                  {product.user_profile.shopname || 'Store Name'}
                </CardDescription>
                <div className="flex justify-between items-center mb-3">
                  <div className="capitalize text-xs text-gray-600">
                    {product.user_profile.state || 'State'}, {product.user_profile.city || 'City'}
                  </div>
                  <div className="text-sm font-semibold text-green-500">
                    ₦{product.price}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      ))}
    </Slider>
  );
}
