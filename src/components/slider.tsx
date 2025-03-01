import React, { useEffect, useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

export default function SliderComponent() {
  const [avatars, setAvatars] = useState([]);

  useEffect(() => {
    // Fetch avatars from supabase
    const fetchAvatars = async () => {
      const supabase = createClient();
      const { data: avatars, error } = await supabase.from('banner').select("*");
      if (error) console.error('Error fetching avatars:', error);
      else setAvatars(avatars);
    };

    fetchAvatars();
  }, []);

  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 6000,
    cssEase: "linear",
    adaptiveHeight: true

  
  };

  return (
<Slider {...settings}>
  {/* Map avatars */}
  {avatars.map((avatar) => (
    <div key={avatar.id} className="py-0"  >
      <Image
  src={avatar.image}
  width={100}
  height={100}
  alt={`Avatar ${avatar.id}`}
  unoptimized
  className="w-full h-36 sm:h-64 object-cover m-0 p-0"
/>

    </div>
  ))}
</Slider>


  );
}
