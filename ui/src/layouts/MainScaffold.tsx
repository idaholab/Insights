// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import * as React from 'react';
import ThemeContextComponent from '../contexts/ThemeContextComponent';

// Custom Components
import Header from '../components/core/Header';
import Drawer from '../components/core/Drawer';
//import { useUser } from '../contexts/userContext';
//import { useEffect } from 'react';
import ProfileDrawer from '../components/core/ProfileDrawer';
//import { tmpCurrentUser } from '../../app/store';
import RoleSelection from '../components/cards/CardRoleSelector';
import UserProfileCard from '../components/cards/CardUserProfile';

type Props = { children: any };

const MainScaffold: React.FC<Props> = ({ children }) => {
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = React.useState(false);

  // const { setUser } = useUser();

  // useEffect(() => {
  //   setUser(tmpCurrentUser);
  // }, [setUser]);

  function handleCloseProfileDrawer() {
    setIsProfileDrawerOpen(false);
  }
  // function toggleProfileDrawer() {
  //   setIsProfileDrawerOpen(!isProfileDrawerOpen);
  // }

  return (
    <ThemeContextComponent>

      <div className="flex flex-col h-screen overflow-hidden text-neutralc-900 dark:text-neutralc-100">
        {/* onToggleProfileDrawer={toggleProfileDrawer} */}
        <Header />

        <div className="flex flex-1 h-full pb-8 relative">
          <Drawer />

          <main className="mb-8 flex-1 transition-all ml-18">
            {children}
          </main>

          <ProfileDrawer isOpen={isProfileDrawerOpen} onClose={handleCloseProfileDrawer} >
            <>
              <UserProfileCard></UserProfileCard>
              {process.env.NODE_ENV === 'development' && <RoleSelection></RoleSelection>}
            </>
          </ProfileDrawer>
        </div>
      </div>
    </ThemeContextComponent>
  );
}

export default MainScaffold;
