// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useState } from 'react';
import { useUser } from '../../contexts/userContext';
import { UserRole } from '../../types';

const RoleSelection: React.FC = () => {
    const { user, setUser } = useUser();
    const [selectedRole, setSelectedRole] = useState<UserRole>(user.Role);

    const handleRoleSelection = (role: UserRole) => {
        setUser({ ...user, Role: role });
        setSelectedRole(role);
    };

    return (
        <div className="max-w-xs mx-auto mt-10">
            {/* TODO: Change to a select and load from config or store. Dont hardcode roles here. */}
            <div className="bg-neutralc-200 shadow-md rounded p-4 m-5">
                <div className="text-center text-xl font-bold mb-2 text-neutralc-800">Select a Role</div>
                <div className="grid grid-cols-1 gap-2 py-2 px-4">
                    <button
                        className={`bg-neutralc-200 hover:bg-neutralc-800 hover:text-neutralc-200 text-neutralc-800 font-bold py-2 px-4 rounded ${selectedRole === 'SuperUser' && 'bg-neutralc-800 text-white'}`}
                        onClick={() => handleRoleSelection('SuperUser')}
                    >
                        Super User
                    </button>
                    <button
                        className={`bg-neutralc-200 hover:bg-neutralc-800 hover:text-neutralc-200 text-neutralc-800 font-bold py-2 px-4 rounded ${selectedRole === 'Executive' && 'bg-neutralc-800 text-white'}`}
                        onClick={() => handleRoleSelection('Executive')}
                    >
                        Executive
                    </button>
                    <button
                        className={`bg-neutralc-200 hover:bg-neutralc-800 hover:text-neutralc-200 text-neutralc-800 font-bold py-2 px-4 rounded ${selectedRole === 'Analyst' && 'bg-neutralc-800 text-white'}`}
                        onClick={() => handleRoleSelection('Analyst')}
                    >
                        Analyst
                    </button>
                    {/* <button
                        className={`bg-neutralc-200 hover:bg-neutralc-800 hover:text-neutralc-200 text-neutralc-800 font-bold py-2 px-4 rounded ${selectedRole === 'Demo' && 'bg-neutralc-800 text-white'}`}
                        onClick={() => handleRoleSelection('Demo')}
                    >
                        Demo
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
