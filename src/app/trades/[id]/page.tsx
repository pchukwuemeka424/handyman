
import React from 'react';
import FetchSingleProduct from './fetchSingle';
import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/client';

export default function Page() {


  return (
    <div>
      <FetchSingleProduct/>
    </div>
  );
}
