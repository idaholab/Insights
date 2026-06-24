// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React from 'react';
import { useTheme } from '../../contexts/useTheme';
import { useUser } from '../../contexts/userContext';
import { getCssRGBVarColor } from '../../util/helperFunctions';

import AvatarButton from '../elements/AvatarButton';

const UserProfileCard: React.FC = () => {
    const { theme } = useTheme();
    const { user } = useUser();
    const bg = theme === 'dark' ? getCssRGBVarColor('--color-primary-rgb-900') : getCssRGBVarColor('--color-primary-rgb-300');
    const fg = theme === 'dark' ? getCssRGBVarColor('--color-primary-rgb-200') : getCssRGBVarColor('--color-primary-rgb-800');

    if (!user) {
        return null;
    }
    const initials = `${user?.FirstName?.charAt(0)}${user?.LastName?.charAt(0)}`;

    return (
        <div className={`card m-3 mt-7 ${theme === 'dark' ? 'bg-transparent text-neutralc-300' : 'bg-transparent text-neutralc-700'}`}>
            <div className="flex items-center">
                <AvatarButton displayLetters={initials} bgColor={bg} fgColor={fg} size='lg' />
                <div className="ml-4" >
                    <h2 className={`card-title ${theme === 'dark' ? 'text-white' : 'text-neutralc-900'}`}>{`${user.FirstName} ${user.LastName}`}</h2>
                    <p className="text-sm font-bold ">{user.Role}</p>
                </div>
            </div>
            <div className="card-footer ml-2 mt-2">
                <p className="text-sm">{user.Username}</p>
                <p className="text-sm">{user.Email}</p>
            </div>
        </div>
    );
};

export default UserProfileCard;