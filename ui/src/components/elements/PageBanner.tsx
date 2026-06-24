// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';
import GenericLoadingErrorWrapper from '../wrappers/GenericLoadingErrorWrapper';
import ButtonLinkGroup from './ButtonLinkGroup';
import ButtonBasic from './ButtonBasic';
import { TabLink } from '../../types';

type ActionLink = {
  label: string;
  link: string;
  external?: boolean;
}

type Props = {
  isLoading: boolean;
  preTitle?: string;
  title: string;
  subtitle?: string;
  baseRoute?: string;
  tabLinks?: TabLink[];
  actions?: ActionLink[];
}

const PageBanner: React.FC<Props> = ({ isLoading, preTitle, title, subtitle, baseRoute, tabLinks, actions }) => {
  subtitle = subtitle || ' ';
  return (
    <div className="sticky top-0 z-20 bg-neutralc-100 text-neutralc-900 dark:bg-neutralc-925 dark:text-neutralc-100">
      <div className="hero min-h-20 w-full flex flex-auto z-20">
        <div className="hero-content max-w-full flex flex-auto">
          <div className="py-3 pl-6 pr-6 flex place-content-between items-center flex-auto flex-wrap gap-4">
            <div className='flex flex-col'>
              {preTitle &&
                <GenericLoadingErrorWrapper
                  skeletonTypeProps={{ isLoading: isLoading, height: 36, count: 1 }}
                  keyIndex={'preTitle'}
                  data={preTitle}
                  error={null}
                  renderComponent={(content) =>
                    <span className="absolute -mt-5 mb-3">{content}</span>
                  }
                />
              }

              <GenericLoadingErrorWrapper
                skeletonTypeProps={{ isLoading: isLoading, height: 36, count: 1 }}
                keyIndex={'title'}
                data={title}
                error={null}
                renderComponent={(content) =>
                  <h1 className="text-4xl min-h-[48px] mr-4 mt-1">{content}</h1>
                }
              />

              <GenericLoadingErrorWrapper
                skeletonTypeProps={{ isLoading: isLoading, height: 36, count: 1 }}
                keyIndex={'subtitle'}
                data={subtitle}
                error={null}
                renderComponent={(content) =>
                  <h2 className={`text-xl mr-4 ${content.trim() ? 'mt-4' : ''}`}>{content}</h2>
                }
              />
            </div>

            <div className="flex flex-wrap items-center justify-start gap-3">
              {tabLinks &&
                <GenericLoadingErrorWrapper
                  skeletonTypeProps={{ isLoading: false, height: 48, width: 560, count: 1 }}
                  data={tabLinks}
                  error={null}
                  keyIndex={'0'}
                  renderComponent={(content) =>
                    <ButtonLinkGroup baseRoute={baseRoute} actions={content} />
                  }
                />
              }

              {actions && actions.length > 0 &&
                <div className="flex items-center gap-3 shrink-0">
                  {actions.map((action, index) => (
                    <ButtonBasic
                      key={index}
                      label={action.label}
                      type='btn-neutral'
                      link={action.link}
                      external={action.external}
                    />
                  ))}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageBanner;
