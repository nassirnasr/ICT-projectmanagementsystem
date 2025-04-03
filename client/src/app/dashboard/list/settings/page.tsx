import Header from '@/components/Header';
import React from 'react'

const Settings = () => {
    const userSettings = {
        username: "nassirnasr",
        email: 'nassirnasr@gmail.com',
        teamName: 'Development Team',
        roleName: 'Developer'
    }

    const labelStyles = "text-sm font-medium text-gray-700 dark:text-gray-200";
    const textStyles = "mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:text-white";
    
    return (
        <div className='max-w-4xl mx-auto p-8'>
            <Header name='Settings' />
            
            <div className='mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-semibold mb-6 text-gray-800 dark:text-white'>Account Information</h2>
                
                <div className='grid gap-6'>
                    <div className='space-y-2'>
                        <label className={labelStyles}>Username</label>
                        <div className={textStyles}>{userSettings.username}</div>
                    </div>

                    <div className='space-y-2'>
                        <label className={labelStyles}>Email</label>
                        <div className={textStyles}>{userSettings.email}</div>
                    </div>

                    <div className='space-y-2'>
                        <label className={labelStyles}>Team</label>
                        <div className={textStyles}>{userSettings.teamName}</div>
                    </div>

                    <div className='space-y-2'>
                        <label className={labelStyles}>Role</label>
                        <div className={textStyles}>{userSettings.roleName}</div>
                    </div>
                </div>

                <div className='mt-8 flex justify-end'>
                    <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Settings