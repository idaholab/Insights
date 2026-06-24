// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React from 'react';
import { useTheme } from '../../contexts/useTheme';

type ProfileDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose, children }) => {
    const { theme } = useTheme();

    return (
        <>
            {isOpen && (
                <>
                    <div
                        className={`drawer drawer-end fixed right-0 w-80 h-[calc(100%-60px)] z-50 shadow-lg transition-transform transform ${theme === 'dark' ? 'bg-neutralc-700 text-white' : 'bg-neutralc-100 text-neutralc-900'
                            }`}
                    >
                        <div className="relative h-full overflow-auto">
                            <button
                                className="absolute top-2 right-2 text-xl font-bold"
                                onClick={onClose}
                            >
                                &times;
                            </button>
                            {children}
                        </div>
                    </div>
                    <div
                        className="fixed inset-0 bg-black opacity-50 z-40"
                        onClick={onClose}
                    ></div>
                </>
            )}
        </>
    );
};

export default ProfileDrawer;