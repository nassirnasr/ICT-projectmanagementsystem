'use client'
import { useAppSelector } from '../../redux';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from './skeleton';

const LoadingPage = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const bgColor = isDarkMode ? 'dark:bg-dark-secondary' : 'bg-white';
  const skeletonColor = isDarkMode ? 'dark:bg-gray-700' : 'bg-gray-100';

  return (
    <div className={`container h-full w-full p-8 ${isDarkMode ? 'dark' : ''}`}>
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className={`h-8 w-64 ${skeletonColor}`} />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className={bgColor}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className={`h-4 w-32 ${skeletonColor}`} />
                  <Skeleton className={`h-8 w-24 ${skeletonColor}`} />
                  <Skeleton className={`h-3 w-48 ${skeletonColor}`} />
                </div>
                <Skeleton className={`h-12 w-12 rounded-full ${skeletonColor}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className={bgColor}>
          <CardHeader>
            <Skeleton className={`h-5 w-48 ${skeletonColor}`} />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Skeleton className={`h-full w-full ${skeletonColor}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={bgColor}>
          <CardHeader>
            <Skeleton className={`h-5 w-48 ${skeletonColor}`} />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Skeleton className={`h-full w-full ${skeletonColor}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DataGrid Skeleton */}
      <div className="mt-8">
        <Card className={bgColor}>
          <CardHeader>
            <Skeleton className={`h-5 w-48 ${skeletonColor}`} />
          </CardHeader>
          <CardContent>
            <div className="h-[400px] space-y-2">
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className={`h-8 flex-1 ${skeletonColor}`} />
                ))}
              </div>
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className={`h-12 flex-1 ${skeletonColor}`} />
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoadingPage;