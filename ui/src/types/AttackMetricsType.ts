// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

export type AttackMetrics = {
    properties: {
        name: string;
        sql_name:string;
        recovery_date: string;
        hp_observables: number;
        ics_techniques: number;
        year_of_trigger: string;
        recovery_duration: number;
        total_observables: number;
        max_financial_loss: number;
        min_financial_loss: number;
        precursor_duration: number;
        initial_access_date: string;
        ransomware_involved: boolean;
        precursor_techniques: number;
        technique_observables: number;
        total_attack_duration: number;
        triggering_event_date: string;
    };
    metadata_properties: object;
    id: string;
    container_id: string;
    metatype: {
        name: string;
        description: string;
        id: string;
    };
    data_source_id: string;
    import_data_id: string;
    type_mapping_transformation_id: string;
    original_data_id: string;
    metadata: {
        conversions: {
            original_value: string | number;
            converted_value: string;
        }[];
        failed_conversions: any[]; // TODO: Define type
    };
    created_at: string;
    modified_at: string | null;
    deleted_at: string | null;
    created_by: string;
    modified_by: string;
    data_staging_id: string;
    metatype_name: string;
    metatype_uuid: string;
};