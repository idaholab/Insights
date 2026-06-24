// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { sqliteTable, AnySQLiteColumn, text, foreignKey, integer, numeric, uniqueIndex, blob } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const refactorLog = sqliteTable("__RefactorLog", {
  OperationKey: text("OperationKey").primaryKey().notNull(),
});

export const artifact = sqliteTable("Artifact", {
  ArtifactId: integer("ArtifactId").primaryKey({ autoIncrement: true }).notNull(),
  Description: text("Description"),
  FrequencyId: integer("FrequencyId").references(() => frequency.FrequencyId),
});

export const campaign = sqliteTable("Campaign", {
  CampaignId: integer("CampaignId").primaryKey({ autoIncrement: true }).notNull(),
  CampaignName: text("CampaignName"),
  CampaignDescription: text("CampaignDescription"),
});

export const caseStudy = sqliteTable("CaseStudy", {
  CaseStudyId: integer("CaseStudyId").primaryKey({ autoIncrement: true }).notNull(),
  CaseStudyName: text("CaseStudyName"),
  CaseStudyDescription: text("CaseStudyDescription"),
  UpperBoundLoss: numeric("UpperBoundLoss"),
  LowerBoundLoss: numeric("LowerBoundLoss"),
  Year: integer("Year"),
  ShortName: text("ShortName"),
  BAMParentId: text("BAMParentId"),
  IsAttackScenario: numeric("IsAttackScenario").notNull(),
});

export const caseStudyNaics = sqliteTable("CaseStudyNAICS", {
  CaseStudyNAICSId: integer("CaseStudyNAICSId").primaryKey({ autoIncrement: true }).notNull(),
  CaseStudyId: integer("CaseStudyId").references(() => caseStudy.CaseStudyId),
  NAICSId: integer("NAICSId").references(() => naics.NAICSId),
});

export const caseStudyObservable = sqliteTable("CaseStudyObservable", {
  CaseStudyObservableID: integer("CaseStudyObservableID").primaryKey({ autoIncrement: true }).notNull(),
  CaseStudyID: integer("CaseStudyID").notNull().references(() => caseStudy.CaseStudyId, { onDelete: "restrict" }),
  ObservableID: integer("ObservableID").notNull().references(() => observable.ObservableID, { onDelete: "restrict" }),
  Probability: text("Probability"),
});

export const caseStudyReference = sqliteTable("CaseStudyReference", {
  ReferenceID: integer("ReferenceID").primaryKey({ autoIncrement: true }).notNull(),
  CaseStudyId: integer("CaseStudyId").notNull().references(() => caseStudy.CaseStudyId, { onDelete: "restrict" }),
  Citation: integer("Citation").notNull(),
  Source: text("Source"),
  Title: text("Title"),
  Author: text("Author"),
  AccessDate: numeric("AccessDate"),
  PublicationDate: numeric("PublicationDate"),
  Link: text("Link"),
});

export const caseStudySector = sqliteTable("CaseStudySector", {
  CaseStudySectorId: integer("CaseStudySectorId").primaryKey({ autoIncrement: true }).notNull(),
  CaseStudyId: integer("CaseStudyId").notNull().references(() => caseStudy.CaseStudyId, { onDelete: "restrict" }),
  SectorId: integer("SectorId").notNull().references(() => sector.SectorId, { onDelete: "restrict" }),
}, (table) => {
  return {
    CaseStudyId_SectorId_key: uniqueIndex("CaseStudySector_CaseStudyId_SectorId_key").on(table.CaseStudyId, table.SectorId),
  };
});

export const caseStudyTags = sqliteTable("CaseStudyTags", {
  CaseStudyTagsId: integer("CaseStudyTagsId").primaryKey({ autoIncrement: true }).notNull(),
  CaseStudyId: integer("CaseStudyId").notNull().references(() => caseStudy.CaseStudyId, { onDelete: "restrict" }),
  TagId: integer("TagId").notNull().references(() => tags.TagId, { onDelete: "restrict" }),
}, (table) => {
  return {
    CaseStudyId_TagId_key: uniqueIndex("CaseStudyTags_CaseStudyId_TagId_key").on(table.CaseStudyId, table.TagId),
  };
});

export const caseStudyTechnique = sqliteTable("CaseStudyTechnique", {
  CaseStudyTechniqueId: integer("CaseStudyTechniqueId").primaryKey({ autoIncrement: true }).notNull(),
  CaseStudyId: integer("CaseStudyId").references(() => caseStudy.CaseStudyId),
  MITRE_TechniqueId: integer("MITRE_TechniqueId").references(() => mitreTechnique.MITRE_TechniqueId),
  Technique_Name: text("Technique_Name"),
  MITRE_TacticId: integer("MITRE_TacticId"),
  Tactic_Name: text("Tactic_Name"),
  Technique_Narratives: text("Technique_Narratives"),
});

export const caseStudyTechniqueTiming = sqliteTable("CaseStudyTechniqueTiming", {
  CaseStudyObservableTimingId: integer("CaseStudyObservableTimingId").primaryKey({ autoIncrement: true }).notNull(),
  CaseStudyID: integer("CaseStudyID").notNull().references(() => caseStudy.CaseStudyId, { onDelete: "restrict" }),
  UTC_Time: numeric("UTC_Time"),
  D_Notation: text("D_Notation"),
  MITRE_TechniqueID: integer("MITRE_TechniqueID").references(() => mitreTechnique.MITRE_TechniqueId),
  MITRE_TacticId: integer("MITRE_TacticId").references(() => mitreTactic.MITRE_TacticId),
  TimingOrder: integer("TimingOrder"),
});

export const caseStudyTechniqueTimingTemp = sqliteTable("CaseStudyTechniqueTiming_Temp", {
  Case_Alias: text("Case_Alias"),
  Technique_Name: text("Technique_Name"),
  Tactic_Name: text("Tactic_Name"),
  Tech_Tact_Event_Reported_Date: numeric("Tech_Tact_Event_Reported_Date"),
  D_Notation: text("D_Notation"),
  Tact_Tech_SeqID: numeric("Tact_Tech_SeqID"),
});

export const frequency = sqliteTable("Frequency", {
  FrequencyId: integer("FrequencyId").primaryKey({ autoIncrement: true }).notNull(),
  FrequencyName: text("FrequencyName"),
  FrequencyDescription: text("FrequencyDescription"),
});

export const group = sqliteTable("Group", {
  GroupId: integer("GroupId").primaryKey({ autoIncrement: true }).notNull(),
  GroupName: text("GroupName"),
  GroupDescription: text("GroupDescription"),
});

export const mitreArtifactTechnique = sqliteTable("MITRE_ArtifactTechnique", {
  MITRE_ArtifactTechniqueId: integer("MITRE_ArtifactTechniqueId").primaryKey({ autoIncrement: true }).notNull(),
  ArtifactId: integer("ArtifactId").notNull().references(() => artifact.ArtifactId, { onDelete: "restrict" }),
  TacticTechniqueIdentifierId: integer("TacticTechniqueIdentifierId").notNull().references(() => tacticTechniqueIdentifier.TacticTechniqueIdentifierId, { onDelete: "restrict" }),
  FrequencyId: integer("FrequencyId").references(() => frequency.FrequencyId),
}, (table) => {
  return {
    ArtifactId_TacticTechniqueIdentifierId_key: uniqueIndex("MITRE_ArtifactTechnique_ArtifactId_TacticTechniqueIdentifierId_key").on(table.ArtifactId, table.TacticTechniqueIdentifierId),
  };
});

export const mitreMitigation = sqliteTable("MITRE_Mitigation", {
  MITRE_MitigationID: integer("MITRE_MitigationID").primaryKey({ autoIncrement: true }).notNull(),
  MITRE_MitigationName: text("MITRE_MitigationName"),
  MITRE_MitigationsDesctiption: text("MITRE_MitigationsDesctiption"),
  MITRE_MitID: text("MITRE_MitID"),
});

export const mitreTactic = sqliteTable("MITRE_Tactic", {
  MITRE_TacticId: integer("MITRE_TacticId").primaryKey({ autoIncrement: true }).notNull(),
  MITRE_TacticName: text("MITRE_TacticName"),
  MITRE_TacticDescription: text("MITRE_TacticDescription"),
  MITRE_Sequence: integer("MITRE_Sequence"),
  MITRE_Id: text("MITRE_Id"),
  MITREId: text("MITREId"),
});

export const mitreTacticTechnique = sqliteTable("MITRE_TacticTechnique", {
  MITRE_TacticTechniqueId: integer("MITRE_TacticTechniqueId").primaryKey({ autoIncrement: true }).notNull(),
  MITRE_TacticId: integer("MITRE_TacticId").notNull().references(() => mitreTactic.MITRE_TacticId, { onDelete: "restrict" }),
  MITRE_TechniqueId: integer("MITRE_TechniqueId").notNull().references(() => mitreTechnique.MITRE_TechniqueId, { onDelete: "restrict" }),
  MITRE_Technique_Sequence: integer("MITRE_Technique_Sequence"),
  MITRE_Tactic_Chart_Order: integer("MITRE_Tactic_Chart_Order"),
});

export const mitreTechnique = sqliteTable("MITRE_Technique", {
	MITRE_TechniqueId: integer("MITRE_TechniqueId").primaryKey({ autoIncrement: true }).notNull(),
	MITRE_Id: text("MITRE_Id").notNull(),
	MITRE_TechniqueName: text("MITRE_TechniqueName"),
	MITRE_TechniqueDescription: text("MITRE_TechniqueDescription"),
  });
  
  export const mitreTechniqueCampaign = sqliteTable("MITRE_TechniqueCampaign", {
	TechniqueCampaignID: integer("TechniqueCampaignID").primaryKey({ autoIncrement: true }).notNull(),
	MITRE_TechniqueId: integer("MITRE_TechniqueId").references(() => mitreTechnique.MITRE_TechniqueId),
	CampaignID: integer("CampaignID").references(() => campaign.CampaignId),
  });
  
  export const mitreTechniqueGroup = sqliteTable("MITRE_TechniqueGroup", {
	TechniqueGroupID: integer("TechniqueGroupID").primaryKey({ autoIncrement: true }).notNull(),
	MITRE_TechniqueId: integer("MITRE_TechniqueId").references(() => mitreTechnique.MITRE_TechniqueId),
	GroupID: integer("GroupID").references(() => group.GroupId),
  });
  
  export const mitreTechniqueMitigation = sqliteTable("MITRE_TechniqueMitigation", {
	TechniqueMitigationID: integer("TechniqueMitigationID").primaryKey({ autoIncrement: true }).notNull(),
	MITRE_TechniqueId: integer("MITRE_TechniqueId").references(() => mitreTechnique.MITRE_TechniqueId),
	MITRE_MitigationID: integer("MITRE_MitigationID").references(() => mitreMitigation.MITRE_MitigationID),
	Description: text("Description"),
  });
  
  export const mitreTechniqueObservableObservedBy = sqliteTable("MITRE_TechniqueObservableObservedBy", {
	MITRETechniqueObservedByID: integer("MITRETechniqueObservedByID").primaryKey({ autoIncrement: true }).notNull(),
	MITRE_TechniqueId: integer("MITRE_TechniqueId").references(() => mitreTechnique.MITRE_TechniqueId),
	ObserverID: integer("ObserverID").references(() => observer.ObserverId),
  });
  
  export const mitreTechniqueSoftware = sqliteTable("MITRE_TechniqueSoftware", {
	TechniqueSoftwareID: integer("TechniqueSoftwareID").primaryKey({ autoIncrement: true }).notNull(),
	MITRE_TechniqueId: integer("MITRE_TechniqueId").references(() => mitreTechnique.MITRE_TechniqueId),
	SoftwareID: integer("SoftwareID").references(() => software.SoftwareId),
  });
  
  export const naics = sqliteTable("NAICS", {
	NAICSId: integer("NAICSId").primaryKey({ autoIncrement: true }).notNull(),
	NAICSCode: text("NAICSCode"),
	NAICSName: text("NAICSName"),
	NAICSDescription: text("NAICSDescription"),
  });
  
  export const observable = sqliteTable("Observable", {
	ObservableID: integer("ObservableID").primaryKey({ autoIncrement: true }).notNull(),
	ObservableDescription: text("ObservableDescription"),
	ObservableLevel: text("ObservableLevel"),
	FrequencyId: integer("FrequencyId").references(() => frequency.FrequencyId),
	Awareness: text("Awareness"),
	Understanding: text("Understanding"),
	Perceivability: text("Perceivability"),
  });
  
  export const observableLevel = sqliteTable("ObservableLevel", {
	ObservableLevelID: integer("ObservableLevelID").primaryKey({ autoIncrement: true }).notNull(),
	ParentObersableID: integer("ParentObersableID").references(() => observable.ObservableID),
	ChildObservableID: integer("ChildObservableID").references(() => observable.ObservableID),
  });
  
  export const observableTacticAndTechnique = sqliteTable("ObservableTacticAndTechnique", {
	ObservableTacticAndTechniqueId: integer("ObservableTacticAndTechniqueId").primaryKey({ autoIncrement: true }).notNull(),
	TacticTechniqueIdentifierId: integer("TacticTechniqueIdentifierId").notNull().references(() => tacticTechniqueIdentifier.TacticTechniqueIdentifierId, { onDelete: "restrict" }),
	ObservableId: integer("ObservableId").notNull().references(() => observable.ObservableID, { onDelete: "restrict" }),
	FrequencyId: integer("FrequencyId").references(() => frequency.FrequencyId),
  });
  
  export const observer = sqliteTable("Observer", {
	ObserverId: integer("ObserverId").primaryKey({ autoIncrement: true }).notNull(),
	ObserverName: text("ObserverName"),
	ObserverDescription: text("ObserverDescription"),
  });
  
  export const sector = sqliteTable("Sector", {
	SectorId: integer("SectorId").primaryKey({ autoIncrement: true }).notNull(),
	SectorName: text("SectorName").notNull(),
	SectorDescription: text("SectorDescription").notNull(),
  });
  
  export const software = sqliteTable("Software", {
	SoftwareId: integer("SoftwareId").primaryKey({ autoIncrement: true }).notNull(),
	SoftwareName: text("SoftwareName"),
	SoftwareDescription: text("SoftwareDescription"),
  });
  
  export const softwareGroup = sqliteTable("SoftwareGroup", {
	SoftwareGroupId: integer("SoftwareGroupId").primaryKey({ autoIncrement: true }).notNull(),
	SoftwareId: integer("SoftwareId").references(() => software.SoftwareId),
	GroupId: integer("GroupId").references(() => group.GroupId),
  });
  
  export const sysdiagrams = sqliteTable("sysdiagrams", {
	name: text("name").notNull(),
	principal_id: integer("principal_id").notNull(),
	diagram_id: integer("diagram_id").primaryKey({ autoIncrement: true }).notNull(),
	version: integer("version"),
	definition: blob("definition"),
  }, (table) => {
	return {
	  principal_id_name_key: uniqueIndex("sysdiagrams_principal_id_name_key").on(table.principal_id, table.name),
	};
  });
  
  export const tacticTechniqueIdentifier = sqliteTable("TacticTechniqueIdentifier", {
	TacticTechniqueIdentifierId: integer("TacticTechniqueIdentifierId").primaryKey({ autoIncrement: true }).notNull(),
	MITRE_TacticId: integer("MITRE_TacticId").notNull().references(() => mitreTactic.MITRE_TacticId, { onDelete: "restrict" }),
	MITRE_TechniqueId: integer("MITRE_TechniqueId").notNull().references(() => mitreTechnique.MITRE_TechniqueId, { onDelete: "restrict" }),
  });
  
  export const tags = sqliteTable("Tags", {
	TagId: integer("TagId").primaryKey({ autoIncrement: true }).notNull(),
	TagName: text("TagName").notNull(),
  });
  
  export const caseStudyObservableBackup = sqliteTable("CaseStudyObservable_backup", {
	CaseStudyObservableID: integer("CaseStudyObservableID").notNull(),
	CaseStudyID: integer("CaseStudyID").notNull(),
	ObservableID: integer("ObservableID").notNull(),
	Probability: text("Probability", { length: 50 }),
  });
  
  export const observationImports = sqliteTable("ObservationImports", {
	ImportID: integer("ImportID").notNull(),
	CaseStudyId: integer("CaseStudyId"),
	CaseStudyName: text("CaseStudyName", { length: 255 }),
	TechniqueName: text("TechniqueName", { length: 255 }),
	TacticName: text("TacticName", { length: 255 }),
	ObservableDescription: text("ObservableDescription", { length: 5000 }),
	NormalFrequency: text("NormalFrequency", { length: 255 }),
	pObsTech: text("pObsTech", { length: 255 }),
	Imported: numeric("Imported"),
  });