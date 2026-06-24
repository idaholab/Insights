// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';

type Props = object;

const Hero: React.FC<Props> = () => {
    return (
        <>
            <div className="wrapper -mx-10 -mt-10 bg-neutralc-150 dark:bg-neutralc-950 text-neutralc-900 dark:text-neutralc-100">
                <div className="hero min-h-64 w-full">
                    <div className="hero-content">
                        <div className="py-8 pl-8 pr-4 flex align-middle">
                            <img src="./CyOTE_logo_23-0807.svg" width="200" alt="CyOTE logo" />
                        </div>
                        <div className="py-8 pl-4 pr-8">
                            <h1 className="text-5xl font-bold">Insights</h1>
                            <p className="py-6">Welcome to the Insights—your go-to hub for exploring, analyzing, and comparing PAR reports. Dive into our rich collection of data and insights to make more informed decisions, effortlessly.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Hero;
