// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import ThemeToggle from './ThemeToggle';
// import { getCssVarColor } from '../../util/helperFunctions';
// import { useUser } from '../../contexts/userContext';
// import AvatarButton from '../elements/AvatarButton';
// import { useTheme } from '../../contexts/useTheme';

// interface DrawerProps {
//   onToggleProfileDrawer: () => void;
// }
// const Header: React.FC<DrawerProps> = ({ onToggleProfileDrawer }) => {

const Header: React.FC = () => {
  // const { user } = useUser();
  // const displayLetters = user ? (user.FirstName?.charAt(0) ?? '') + (user.LastName?.charAt(0) ?? '') : 'UK';
  // const { theme } = useTheme();
  // const bg = theme === 'dark' ? getCssRGBVarColor('--color-primary-900') : getCssRGBVarColor('--color-primary-rgb-300');
  // const fg = theme === 'dark' ? getCssRGBVarColor('--color-primary-rgb-200') : getCssRGBVarColor('--color-primary-rgb-800');

  return (
    <>
      <div className="navbar bg-primary text-neutralc-100 sticky top-0 z-1000">
        <Link to="/" className="btn btn-ghost ml-2 p-0 normal-case rounded-full border-none logo-btn">
          <img src={"./CyOTE_logo_23-0807_nostars.svg"} alt="CyOTE logo" />
        </Link>

        <Link to="/" className="btn btn-ghost px-2 mx-1 normal-case btn-sm text-xl">
          Insights
        </Link>

        <div className="ml-auto">
          <ThemeToggle />
          {/* <AvatarButton displayLetters={displayLetters} onClick={onToggleProfileDrawer} bgColor={bg} fgColor={fg} size='sm' className="mr-3" /> */}
        </div>
      </div>
    </>
  );
};

export default Header;
