// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useMemo } from 'react';

interface ObservableTreeGroupProps {
  observables: any[];
}

const ObservableTreeGroup: React.FC<ObservableTreeGroupProps> = ({ observables }) => {
  const [isMainExpanded, setIsMainExpanded] = React.useState(true);

  const observableTree = useMemo(() => {
    if (!observables || observables.length === 0) return [];
    
    const sorted = [...observables].sort((a, b) => {
      const levelA = parseInt(a.obs_lvl.substring(1));
      const levelB = parseInt(b.obs_lvl.substring(1));
      return levelA - levelB;
    });

    const buildTree = (parentDesc: string | null, currentLevel: number): any[] => {
      return sorted
        .filter(obs => {
          const level = parseInt(obs.obs_lvl.substring(1));
          if (level !== currentLevel) return false;
          if (parentDesc === null) return true;
          return obs.obs_desc.startsWith(parentDesc + ':');
        })
        .map(obs => ({
          ...obs,
          children: buildTree(obs.obs_desc, currentLevel + 1)
        }));
    };

    return buildTree(null, 1);
  }, [observables]);

  if (!observables || observables.length === 0) return null;

  const TreeNode: React.FC<{ node: any }> = ({ node }) => {
    const hasChildren = node.children && node.children.length > 0;

    if (!hasChildren) {
      return (
        <li>
          <a className="flex items-center gap-2">
            <span className="badge badge-primary badge-sm">{node.obs_lvl}</span>
            <span className="flex-1">{node.obs_desc}</span>
          </a>
        </li>
      );
    }

    return (
      <li>
        <details open={hasChildren}>
          <summary className="flex items-center gap-2">
            <span className="badge badge-primary badge-sm">{node.obs_lvl}</span>
            <span className="flex-1">{node.obs_desc}</span>
          </summary>
          <ul>
            {node.children.map((child: any, index: number) => (
              <TreeNode key={`${child.case_obs_seq}-${index}`} node={child} />
            ))}
          </ul>
        </details>
      </li>
    );
  };

  const firstObs = observables[0];
  const observableCount = observables.length;
  const uniqueTypes = [...new Set(observables.map(o => o.obs_type))].join(', ');
  const reportedDate = firstObs.tech_tact_event_reported_date;
  const dNotation = firstObs.d_notation;
  const daysToTrigger = firstObs.time_distance_to_trigger_event;

  return (
    <div className="card shadow-md dark:border-neutralc-700 overflow-hidden mb-4">
      <div className="card-body p-4">
        <div className="collapse collapse-arrow bg-base-200 dark:bg-neutralc-800 rounded-box">
          <input 
            type="checkbox" 
            checked={isMainExpanded}
            onChange={() => setIsMainExpanded(!isMainExpanded)}
          />
          <div className="collapse-title">
            <div className="flex justify-between">
              <div>
                <p className="text-lg font-semibold dark:text-neutralc-200">
                  {firstObs.tact_ics_name} - {firstObs.tech_ics_name}
                </p>
                <p className="text-xs text-neutralc-600 dark:text-neutralc-300">
                  {firstObs.tact_ics_id} / {firstObs.tech_ics_id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold dark:text-neutralc-200">
                  {observableCount} Observable{observableCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs">
              <div>
                <span className="font-semibold dark:text-neutralc-200">Source:</span>
                <p className="text-neutralc-600 dark:text-neutralc-300">{[...new Set(observables.map(o => o.obs_src_tag))].join(', ')}</p>
              </div>
              <div>
                <span className="font-semibold dark:text-neutralc-200">Type:</span>
                <p className="text-neutralc-600 dark:text-neutralc-300">{uniqueTypes}</p>
              </div>
              <div>
                <span className="font-semibold dark:text-neutralc-200">Reported:</span>
                <p className="text-neutralc-600 dark:text-neutralc-300">{reportedDate}</p>
              </div>
              <div>
                <span className="font-semibold dark:text-neutralc-200">Days to Trigger:</span>
                <p className="text-neutralc-600 dark:text-neutralc-300">
                  {dNotation} ({daysToTrigger} days)
                </p>
              </div>
            </div>
          </div>

          <div className="collapse-content">
            <ul className="menu bg-gray-200 dark:bg-gray-700 rounded-box w-full mt-2">
              {observableTree.map((rootNode, index) => (
                <React.Fragment key={`${rootNode.case_obs_seq}-${index}`}>
                  {/* Source heading above each L1 node */}
                  {rootNode.obs_src_tag && (
                    <li className="menu-title">
                      <span className="text-base font-semibold text-neutralc-700 dark:text-neutralc-200">
                        Source: {rootNode.obs_src_tag}
                      </span>
                    </li>
                  )}
                  <TreeNode node={rootNode} />
                </React.Fragment>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObservableTreeGroup;
