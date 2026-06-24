// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';

import { DateTime } from 'luxon';

type Props = {
  sequenceNumber: number;
  attackInfo: any;
};

const CardSingleAttackSequence: React.FC<Props> = ({
  sequenceNumber,
  attackInfo,
}) => {
  // const [Narrative, setNarrative] = React.useState<string>("");
  // const [Observers, setObservers] = React.useState<string>("");
  // const [Observables, setObservables] = React.useState<string>("");

  // Utility function to format section
  // const formatSection = (section: string) => {
  //   let formattedSection = section.replace(/ , , /g, '<br /><br />');
  //   formattedSection = formattedSection.replace(/ , /g, '<br /><br />');

  //   // Remove trailing <br><br> or <br /><br />
  //   return formattedSection.replace(/<br \/?><br \/?>$/g, '');
  // };
  const formatSection = (section?: string): string => {
    if (typeof section !== 'string' || !section) {
      console.warn("Invalid input passed to formatSection:", section);
      return '';
    }

    const PLACEHOLDER = '___PLACEHOLDER___';

    let formattedSection = section.trim();

    // Remove unwanted sequences
    formattedSection = formattedSection.replace(/ , , /g, '<br /><br />');
    formattedSection = formattedSection.replace(/ , /g, '<br /><br />');
    formattedSection = formattedSection.replace(/^,|,$| , /g, '');  // Remove leading, trailing, and isolated commas

    // Handle <br><br>", "<br><br> sequence
    formattedSection = formattedSection.replace(/<br \/?><br \/?>\s*,\s*<br \/?><br \/?>/g, '<br /><br />');

    // Handle cases of comma followed by line breaks
    formattedSection = formattedSection.replace(/,\s*\n/g, '<br /><br />');

    // Replace returns (\n) with <br><br>
    formattedSection = formattedSection.replace(/\n/g, '<br /><br />');

    // Replace colon followed by newlines with a placeholder
    formattedSection = formattedSection.replace(/:\s*\n/g, `:${PLACEHOLDER}`);

    // Wrap content after our placeholder and before two <br> tags in <code> tags
    formattedSection = formattedSection.replace(new RegExp(`:${PLACEHOLDER}([^<]+)<br /?><br /?>`), ':<code>$1</code><br /><br />');

    // Ensure there are never more than two <br>s in a row, accounting for spaces
    formattedSection = formattedSection.replace(/(<br \/?>\s*<br \/?>\s*)+/g, '<br /><br />');

    // Ensure no duplicated trailing breaks.
    return formattedSection.replace(/(<br \/?><br \/?>)+$/g, '');
  };

  // React.useEffect(() => {
  //   const splitAndSetSections = (input: string) => {
  //     // Split the string by single newlines
  //     const sections = input.split('\n');

  //     if (sections.length >= 3) {
  //       setNarrative(formatSection(sections.slice(0, sections.length - 2).join('\n')));
  //       setObservers(formatSection(sections[sections.length - 2]));
  //       setObservables(formatSection(sections[sections.length - 1]));
  //     } else if (sections.length === 2) {
  //       setNarrative(formatSection(sections[0]));
  //       setObservers(formatSection(sections[1]));
  //       setObservables(""); // Ensure Observables is empty
  //     } else if (sections.length === 1) {
  //       setNarrative(formatSection(sections[0]));
  //       setObservers("");
  //       setObservables(""); // Ensure Observables is empty
  //     } else {
  //       console.error('Unexpected number of sections in the string', sections);
  //     }
  //   };

  //   if (attackInfo && attackInfo.Technique_Narratives) {
  //     splitAndSetSections(attackInfo.Technique_Narratives);
  //   } else {
  //     console.warn('attackInfo or attackInfo.Technique_Narratives is missing');
  //   }
  // }, [attackInfo]);

  const formatDateTime = (dateTimeStr: string): string => {
    const dt = DateTime.fromISO(dateTimeStr);
    return dt.toLocaleString({
      year: 'numeric',    // '2-digit' for two-digit year or 'numeric' for four-digit
      month: 'short',      // '2-digit' for two-digit month, 'numeric' for number, 'long' for full month name
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,       // This will format the time in 12-hour format with AM/PM
    });
  };

  return (
    <>
      <div className="card shadow-md mb-3 overflow-hidden h-full">
        <div className="flex w-full text-neutralc-100">
          <h2 className="text-2xl py-6 px-8 bg-primary">
            {sequenceNumber}
          </h2>
          <h2 className="text-2xl py-6 px-8 bg-primary-600 flex-grow">
            {attackInfo.Tactic_Name}
          </h2>
        </div>
        <div className={'card-body flex overflow-hidden p-0'}>
          <div className="bg-neutralc-300 dark:bg-neutralc-300 pt-6 pb-3 px-8">
            <h2 className="text-2xl text-neutralc-800 mb-2">
              {attackInfo.Technique_Name}
            </h2>
            <div className="space-x-2 text-white">
              <div className={'inline-flex align-middle text-xs dark:bg-neutralc-600 rounded-lg overflow-hidden'}>
                <span className="px-3 py-2 bg-neutralc-500 dark:bg-neutralc-500">
                  Date/Time
                </span>
                <h6 className={'bg-neutralc-200 text-neutralc-900 px-3 flex items-center'}>
                  {attackInfo.UTC_Time ? formatDateTime(attackInfo.UTC_Time) : 'N/A'}
                </h6>
              </div>
              {attackInfo.MITRE_Id &&
                <div className={'inline-flex align-middle text-xs dark:bg-neutralc-600 rounded-lg overflow-hidden'}>
                  <span className="px-3 py-2 bg-neutralc-500 dark:bg-neutralc-500">
                    MITRE ID
                  </span>
                  <h6 className={'bg-neutralc-200 text-neutralc-900 px-3 flex items-center'}>
                    {attackInfo.MITRE_Id}
                  </h6>
                </div>
              }
            </div>
          </div>
          <div className="body-scroll-area overflow-y-auto flex-grow p-8 -mt-2 text-neutralc-800 bg-neutralc-200 dark:bg-neutralc-200">
            {attackInfo.Technique_Narratives ?
              <p dangerouslySetInnerHTML={{ __html: formatSection(attackInfo.Technique_Narratives) || "" }}></p>
              : <p>No narrative to display</p>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default CardSingleAttackSequence;
