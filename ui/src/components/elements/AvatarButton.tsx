// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React from 'react';

type AvatarButtonProps = {
    bgColor: string;
    fgColor: string;
    onClick?: () => void;
    displayLetters: string | undefined;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
};

const AvatarButton: React.FC<AvatarButtonProps> = ({ onClick = () => { }, displayLetters, bgColor, fgColor, size, className }) => {
    const avatarSizeClass = size === 'sm' ? 'w-8 h-8 min-w-8 min-h-8' : size === 'lg' ? 'w-12 h-12 min-w-12 min-h-12' : 'w-10 h-10 min-w-10 min-h-10';
    const avatarTextClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-base';
    const minHeight = size === 'sm' ? '2rem' : size === 'lg' ? '3rem' : '2.5rem'; // TODO: For some reason min-w-12 min-h-12 stopped working?? It would be better not to hardcode minHeight values here
    return (
        <button className={`btn btn-circle ${className} ${avatarSizeClass}`}
            style={{ backgroundColor: bgColor, color: fgColor, minHeight: minHeight }}
            onClick={onClick} >
            <div className={`avatar placeholder rounded-full`}>
                <span className={`${avatarTextClass} font-bold`}>{displayLetters}</span>
            </div>
        </button>
    );
};

export default AvatarButton;