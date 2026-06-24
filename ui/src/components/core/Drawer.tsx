// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks/reduxTypescriptHooks';
import { appStateActions } from '../../../app/store/index';
import { toUrlFriendly } from '../../util/urlHelpers';

import ButtonIcon from '../elements/ButtonIcon';

const DrawerItem: React.FC<{ to: string; icon: string; label: string; isCollapsed: boolean; onClick?: () => void }> = ({ to, icon, label, isCollapsed, onClick }) => {
  const location = useLocation();

  // Check if the current location matches the route or is a nested route
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/') ? 'bg-neutralc-150 dark:bg-neutralc-700' : '';

  return (
    <li>
      <Link
        to={to}
        className={`px-2 h-[48px] !gap-0 flex items-center hover:bg-neutralc-100 text-neutralc-900 dark:text-neutralc-100 dark:hover:bg-neutralc-700 ${isActive}`}
        onClick={onClick}
      >
        <span className="material-icons">{icon}</span>
        {!isCollapsed && <span className={`whitespace-nowrap overflow-hidden ml-2`}>{label}</span>}
      </Link>
    </li>
  );
};

const useDrawerState = () => {
  const dispatch = useAppDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    '1': true,
    '2': true,
    '3': true,
  });

  const toggleDropdown = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    dispatch(appStateActions.setDrawerLeftWidth(isCollapsed ? 64 : 80));
  };

  const expandDrawerAndOpenAccordion = (id: string) => {
    setIsCollapsed(false);
    setOpenSections(prev => ({ ...prev, [id]: true }));
    dispatch(appStateActions.setDrawerLeftWidth(80));
  };

  return { isCollapsed, openSections, toggleDropdown, toggleCollapse, expandDrawerAndOpenAccordion };
};

const Drawer: React.FC = () => {
  const { isCollapsed, openSections, toggleDropdown, toggleCollapse, expandDrawerAndOpenAccordion } = useDrawerState();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const storeSelectedReport: any = useAppSelector((state: any) => state.appState.selectedReport);

  const handleDeselectReport = () => {
    dispatch(appStateActions.setSelectedReport({}));
    navigate('/reports');
  };

  function titleNameRemoveAnalysis(str: string) {
    // Remove the word "Analysis" from the end if it exists
    if (str.endsWith(" Analysis")) {
        str = str.slice(0, -9);
    }

    return str;
  }

  return (
    <aside className={`bg-neutralc-300 dark:bg-neutralc-1000 ${isCollapsed ? 'w-14' : 'w-80'}`} style={{ height: 'calc(100vh - 64px)' }}>
      <div className="flex flex-col justify-between h-full">
        <div>
          <ul className="menu">
            <li>
              <button
                onClick={toggleCollapse}
                className="flex items-center justify-center w-[40px] h-[40px] rounded-lg ml-auto my-1 hover:bg-neutralc-100 dark:hover:bg-neutralc-700 transition"
              >
                <span className="material-icons">{isCollapsed ? 'menu' : 'menu_open'}</span>
              </button>
            </li>
            <DrawerItem to="/overview" icon="dashboard" label="Overview" isCollapsed={isCollapsed} onClick={handleDeselectReport} />
            {/* hover:bg-neutralc-300 dark:hover:bg-neutralc-800 */}
            <li className={` ${isCollapsed ? 'w-[40px]' : ''} rounded-lg ${openSections['2'] ? 'open' : ''}`}>
              <div
                className={`hover:bg-neutralc-100 dark:hover:bg-neutralc-700 dark:text-neutralc-100 px-2 !gap-0 flex justify-between items-center cursor-pointer`}
                onClick={() => isCollapsed ? expandDrawerAndOpenAccordion('2') : toggleDropdown('2')}
              >
                <span className="flex items-center h-[32px]">
                  <span className="material-icons">{isCollapsed ? 'library_books' : 'library_books'}</span>
                  {!isCollapsed && <span className="ml-2">Precursor Analysis Reports</span>}
                </span>
                {!isCollapsed && (
                  <span className={`material-icons ${openSections['2'] ? 'rotate-180' : ''} transition-transform`}>expand_more</span>
                )}
              </div>
              {!isCollapsed && openSections['2'] && (
                <ul className="pl-3">
                  <DrawerItem to="/reports" icon="library_books" label="Reports" isCollapsed={isCollapsed} />
                  {storeSelectedReport?.caseStudyNameShort && (
                    <ul className="pl-3">
                      <li className="menu p-0">
                        <div className="flex justify-between pr-1">
                          <div>
                            <span>{titleNameRemoveAnalysis(storeSelectedReport.caseStudyBAMParentId)}</span>
                          </div>
                          <ButtonIcon buttonIcon="close" color="btn-ghost" buttonSize="btn-sm" onClick={handleDeselectReport} />
                        </div>
                        <ul>
                          <DrawerItem
                            to={`attack/${toUrlFriendly(storeSelectedReport?.caseStudyNameShort)}/overview`}
                            icon="dashboard"
                            label="Overview"
                            isCollapsed={isCollapsed}
                          />
                          <DrawerItem
                            to={`attack/${toUrlFriendly(storeSelectedReport?.caseStudyNameShort)}/technical`}
                            icon="build"
                            label="Technical View"
                            isCollapsed={isCollapsed}
                          />
                          <DrawerItem
                            to={`attack/${toUrlFriendly(storeSelectedReport?.caseStudyNameShort)}/comparison`}
                            icon="analytics"
                            label="Comparison View"
                            isCollapsed={isCollapsed}
                          />
                          <DrawerItem
                            to={`attack/${toUrlFriendly(storeSelectedReport?.caseStudyNameShort)}/bam`}
                            icon="analytics"
                            label="Bayesian Attack Model"
                            isCollapsed={isCollapsed}
                          />
                        </ul>
                      </li>
                    </ul>
                  )}
                  <DrawerItem to="/observables" icon="visibility" label="Observables" isCollapsed={isCollapsed} onClick={handleDeselectReport} />
                  <DrawerItem to="/quantatative-attack-analysis" icon="insights" label="Quantatative Attack Analysis" isCollapsed={isCollapsed} onClick={handleDeselectReport} />
                  <DrawerItem to="/financial-summaries" icon="attach_money" label="Financial Summaries" isCollapsed={isCollapsed} onClick={handleDeselectReport} />
                </ul>
              )}
            </li>
            <DrawerItem to="/cyote-methodology" icon="lightbulb" label="CyOTE Methodology" isCollapsed={isCollapsed} onClick={handleDeselectReport} />
          </ul>
        </div>
        {!isCollapsed && (
          <div className="m-3 flex justify-center">
            <span className="copyright-box dark:text-neutralc-300 text-sm">&copy;{new Date().getFullYear()} Batelle Energy Alliance, LLC</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Drawer;
