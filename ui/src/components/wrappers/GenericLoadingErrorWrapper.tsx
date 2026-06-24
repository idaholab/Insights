// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { SkeletonType } from '../../types';
import { useTheme } from '../../contexts/useTheme';

const GenericLoadingErrorWrapper: React.FC<{
    skeletonTypeProps: SkeletonType;
    data: any;
    error: any;
    keyIndex: string;
    renderComponent: (data: any) => JSX.Element | JSX.Element
}> = ({ skeletonTypeProps,
    data,
    error,
    keyIndex,
    renderComponent }) => {
        const { skeletonBaseColor, skeletonHighlightColor } = useTheme();

        if (skeletonTypeProps.isLoading && skeletonTypeProps.template) {
            return skeletonTypeProps.template;
        }
        if (skeletonTypeProps.isLoading && !skeletonTypeProps.template) {
            let containerWidth = skeletonTypeProps.containerWidth ?? '100%';
            let containerHeight = skeletonTypeProps.containerHeight ?? '100%';
            return <div key={"skeleton-container-" + keyIndex} style={{ width: containerWidth, height: containerHeight }}>
                <Skeleton key={"skeleton-" + keyIndex}
                    baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}
                    height={skeletonTypeProps?.height ?? undefined}
                    width={skeletonTypeProps?.width ?? undefined}
                    count={skeletonTypeProps?.count ?? undefined}></Skeleton></div>;
        }

        if (error) {
            return (
                <div key={"error-" + keyIndex} role="alert" className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Error! Something went wrong. </span>
                </div>
            );
        }

        if (!data) {
            return (
                <></>
                // <div key={"no-data-" + keyIndex} role="alert" className="alert alert-warning">
                //     <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                //     <span>Warning! No Data</span>
                // </div>
            );
        }
        return renderComponent(data);
    };

export default GenericLoadingErrorWrapper;