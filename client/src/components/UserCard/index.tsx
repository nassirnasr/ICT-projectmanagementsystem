import { User } from '@/state/api'; // API User
import { User as UserIcon } from 'lucide-react'; // Rename lucide-react User to UserIcon
import Image from 'next/image';
import React from 'react';

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  return (
    <div className="flex items-center space-x-4 rounded-lg bg-white p-6 shadow-md dark:bg-dark-secondary dark:text-white mb-4">
      {user.profilePictureUrl ? (
        // If user has profile picture, use Image component
        <Image
          // src={user.profilePictureUrl}
          src={`/nasr1.jpg`}
          alt={`${user.username}'s profile picture`}
          width={64}
          height={64}
          className="rounded-full border-2 border-gray-300"
        />
      ) : (
        // If no profile picture, use UserIcon from lucide-react
        <UserIcon
          size={64}
          className="text-gray-400 border-2 border-gray-300 rounded-full"
        />
      )}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {user.username}
        </h3>
        <p className="text-sm text-gray-600 dark:text-neutral-400">{user.email}</p>
      </div>
    </div>
  );
};

export default UserCard;
