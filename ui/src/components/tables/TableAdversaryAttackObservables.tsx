// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { useTheme } from '../../contexts/useTheme';
import { BamAttackResponseType } from '../../types';

const TableAdversaryAttackObservables: React.FC<{ data: BamAttackResponseType[], hiddenItems: number[], setHiddenItems: (item: number[]) => void }> = ({ data, hiddenItems, setHiddenItems }) => {
    const { theme } = useTheme();

    // type RowData = {
    //     id: number;
    //     observedEventDesc: string;
    //     assessedTechnique: string;
    //     assessedTactic: string;
    //     diagnosticScore: string;
    //     dNotation: string;
    //     observer: string;
    // };

    const pagination = true; // Enable pagination
    const paginationPageSize = 10; // Number of rows per page
    const paginationPageSizeSelector = [10, 25, 50]; // Pagination page size options

    data = data.map((v, i) => ({ id: i, ...v })).filter(t => !!t.id).map(t => Object.assign(t, { "D-notation": t["D-notation"].replace(/D-?/g, "D-") }))

    const [colDefs] = useState<ColDef[]>([
        { headerName: 'ID', field: 'id', width: 70 },
        { headerName: 'Assessed Technique', field: 'Technique', flex: 1.5 },
        { headerName: 'Assessed Tactic', field: 'Tactic', flex: 1.5 },
        { headerName: 'D-Notation', field: 'D-notation', width: 150, comparator: (_a, _b, nodeA, nodeB) => nodeA.data.x.localeCompare(nodeB.data.x, 'en', { numeric: true }) },
        { headerName: '', width: 48, cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' }, cellRendererSelector: params => ({ component: SelectorButton, params: { value: params.data.StepID, items: hiddenItems, setItems: setHiddenItems } }) },
    ]);

    return (
        <div className={theme === 'dark' ? 'ag-theme-material dark' : 'ag-theme-material'} style={{ height: '593px', width: '100%' }}>
            <AgGridReact
                rowData={data}
                columnDefs={colDefs}
                pagination={pagination} // Enable pagination
                paginationPageSize={paginationPageSize} // Set number of rows per page
                paginationPageSizeSelector={paginationPageSizeSelector} // Set numbers for pagination page size options
            />
        </div>
    );
};

const SelectorButton: React.FC<{ items: string[], value: string, setItems: (item: string[]) => void }> = ({ value, items, setItems }) => {
    return (
        <>
            <label className="swap btn btn-ghost">
                <input onClick={() => {
                    setTimeout(() => setItems(((items.indexOf(value)) > -1 ? items.splice(items.indexOf(value), 1) : items.push(value)) ? [...items] : []), 5);
                    return false;
                }} type="checkbox" checked={items.indexOf(value) > -1} readOnly />
                <span className="swap-on material-icons !text-base">check_box</span>
                <span className="swap-off material-icons !text-base">check_box_outline_blank</span>
            </label>
        </>
    )
}

export default TableAdversaryAttackObservables;