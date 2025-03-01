import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Gallery({ userDetail }: { userDetail: any }) {
  const [images, setImages] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const userId = userDetail?.user_id;

  // Fetch images from the Supabase database
  useEffect(() => {
    const fetchImages = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('images') // Change to your Supabase table name
        .select('*')
        .eq('user_id', userId) // Filter by user_id
        .limit() // Optional: Limit the number of images
        .order('created_at', { ascending: false }); // Order by creation date

      if (error) {
        console.error('Error fetching images:', error);
        return;
      }

      setImages(data || []);
    };

    fetchImages();
  }, [userId]);

  // Handle image click (opens the modal)
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="max-w-screen-xl mx-auto py-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Your Image Gallery</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-0">
        {images.map((image: any) => (
          <div
            key={image.id}
            className="relative bg-white overflow-hidden cursor-pointer"
            onClick={() =>
              handleImageClick(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${image.image}`
              )
            }
          >
            <img
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${image.image}`}
              alt={image.image || 'Image'}
              className="w-full h-full object-cover transition-all duration-500 transform hover:scale-110"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Modal for viewing a larger image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div className="relative bg-white p-4 rounded-lg max-w-3xl w-full">
            <img
              src={selectedImage || ''}
              alt="Zoomed image"
              className="max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()} // Prevent closing the modal when clicking the image
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-2"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
