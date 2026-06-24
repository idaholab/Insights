// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { SkeletonTheme } from 'react-loading-skeleton';
import MainScaffold from '../src/layouts/MainScaffold'

type Props = {
  children: any;
}

const App: React.FC<Props> = ({ children }) => {
  return (
    <div className="App h-screen">
      <SkeletonTheme>
        <MainScaffold>{children}</MainScaffold>
      </SkeletonTheme>
    </div >
  );
}

export default App;