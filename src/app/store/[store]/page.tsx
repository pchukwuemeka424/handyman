import React from 'react';
import Shop from './shop';
import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/client';

export async function generateMetadata({ params }: { params: { store: string } }): Promise<Metadata> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_profile')
    .select('*')
    .eq('username', params.store)
    .single();

  const user = data ?? {}; // Ensure user is always an object

  return {
    title: `${process.env.APP_NAME} - ${user.shopname || 'Store'}`,
    description: process.env.APP_DESCRIPTION || '',
    openGraph: {
      title: `${process.env.APP_NAME} - ${user.shopname || params.store}`,
      description: process.env.APP_DESCRIPTION || '',
      images: [
        {
          url: `${user.avater}`,
          width: 800,
          height: 600,
          alt: 'Og Image Alt',
        },
      ],
    },
  };
}

export default function Page() {
  return (
    <div>
      <Shop />
    </div>
  );
}
