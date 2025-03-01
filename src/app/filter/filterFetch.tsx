import supabaseDb from '@/utils/supabase-db'; 
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import Spinner from '@/components/spinner';
import { MdErrorOutline } from 'react-icons/md';

interface UserProfile {
  id: string;
  fname: string;
  lname: string;
  state: string;
  city: string;
  avatar: string;
  kyc_status: string;
  busName: string;
  Banner: string;
  skills?: string;
  user_id: string;
  averageRating?: number;
  reviewCount?: number;
}

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return '⭐'.repeat(fullStars) + (halfStar ? '⭐' : '') + '☆'.repeat(emptyStars);
};

export default function SearchProduct() {
  const [userDetail, setUserDetail] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const searchParams = useSearchParams();
  const search = searchParams.get('q');
  const state = searchParams.get('state');

  const fetchDetails = useCallback(async (page: number, search?: string, state?: string) => {
    setLoading(true);
    try {
      let query = supabaseDb
        .from('user_profile')
        .select('id, fname, lname, state, city, avatar, kyc_status, busName, Banner, user_id, skills')
        .order('created_at', { ascending: false })
        .range((page - 1) * 10, page * 10 - 1);

      if (search) query = query.ilike('skills', `%${search}%`);
      if (state) query = query.ilike('state', `%${state}%`);

      const { data, error } = await query;
      if (error) throw error;

      if (data.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      const userIds = data.map(user => user.user_id);
      const { data: ratingsData, error: ratingsError } = await supabaseDb
        .from('rating')
        .select('user_id, stars')
        .in('user_id', userIds);

      if (ratingsError) throw ratingsError;

      const userRatings = data.map(user => {
        const userRatingsData = ratingsData.filter(rating => rating.user_id === user.user_id);
        const totalStars = userRatingsData.reduce((acc, rating) => acc + (parseFloat(rating.stars) || 0), 0);
        const reviewCount = userRatingsData.length;
        const averageRating = reviewCount > 0 ? Math.round((totalStars / reviewCount) * 10) / 10 : 0;
        return { ...user, averageRating, reviewCount };
      });

      if (userRatings.length < 10) setHasMore(false);
      setUserDetail((prev) => (page === 1 ? userRatings : [...prev, ...userRatings.filter((p) => !prev.some((prev) => prev.id === p.id))]));
    } catch (error) {
      console.error('Error fetching users:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setUserDetail([]);
    setPage(1);
    setHasMore(true);
    fetchDetails(1, search, state);
  }, [search, state, fetchDetails]);

  useEffect(() => {
    if (page > 1) {
      fetchDetails(page, search, state);
    }
  }, [page, search, state, fetchDetails]);

  if (loading && page === 1) return <Spinner />;

  if (userDetail.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <MdErrorOutline className="text-red-500 text-6xl mb-4" />
        <h2 className="text-lg font-semibold text-gray-700">No Users Found</h2>
        <p className="text-sm text-gray-500">Try searching for something else.</p>
      </div>
    );
  }

  return (
    <div className="col-span-12 sm:col-span-12">
      {userDetail.map((user, index) => (
        <Link href={`/trades/${user.user_id}`} key={`${user.id}-${index}`} passHref>
          <Card className="hover:shadow-xl transition-all transform hover:scale-105 p-4 my-2 rounded-lg border border-gray-300">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Image
                  src={user?.avatar}
                  alt={user.busName || `User ${index + 1}`}
                  className="w-24 h-24 rounded-lg shadow-md"
                  width={96}
                  height={96}
                />
              </div>
              <div className="text-gray-700">
                <CardTitle className="text-xl font-semibold capitalize">{user.busName}</CardTitle>
                <p className="text-sm text-gray-500">{user.state || 'State'}, {user.city || 'City'}</p>
                <div className="text-md text-blue-400">
                  {renderStars(user.averageRating)} {user.averageRating.toFixed(1)}/5 ({user.reviewCount} Reviews)
                </div>
              </div>
            </div>
            <CardDescription className="mt-2 text-gray-600 capitalize font-semibold">Services & Skills</CardDescription>
            <div className="text-xs text-gray-600">{user.skills || 'Handyman, Plumber, Carpenter, Electrician, Painter'}</div>
          </Card>
        </Link>
      ))}
      {loading && <div className="text-center mt-4">Loading more users...</div>}
    </div>
  );
}