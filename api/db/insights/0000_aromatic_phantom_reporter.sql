-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `__RefactorLog` (
	`OperationKey` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Artifact` (
	`ArtifactId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Description` text,
	`FrequencyId` integer,
	FOREIGN KEY (`FrequencyId`) REFERENCES `Frequency`(`FrequencyId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Campaign` (
	`CampaignId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`CampaignName` text,
	`CampaignDescription` text
);
--> statement-breakpoint
CREATE TABLE `CaseStudy` (
	`CaseStudyId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`CaseStudyName` text,
	`CaseStudyDescription` text,
	`UpperBoundLoss` numeric,
	`LowerBoundLoss` numeric,
	`Year` integer,
	`ShortName` text,
	`BAMParentId` text,
	`IsAttackScenario` numeric DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `CaseStudyNAICS` (
	`CaseStudyNAICSId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`CaseStudyId` integer,
	`NAICSId` integer,
	FOREIGN KEY (`CaseStudyId`) REFERENCES `CaseStudy`(`CaseStudyId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`NAICSId`) REFERENCES `NAICS`(`NAICSId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `CaseStudyObservable` (
	`CaseStudyObservableID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`CaseStudyID` integer NOT NULL,
	`ObservableID` integer NOT NULL,
	`Probability` text,
	FOREIGN KEY (`ObservableID`) REFERENCES `Observable`(`ObservableID`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`CaseStudyID`) REFERENCES `CaseStudy`(`CaseStudyId`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `CaseStudyReference` (
	`ReferenceID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`CaseStudyId` integer NOT NULL,
	`Citation` integer NOT NULL,
	`Source` text,
	`Title` text,
	`Author` text,
	`AccessDate` numeric,
	`PublicationDate` numeric,
	`Link` text,
	FOREIGN KEY (`CaseStudyId`) REFERENCES `CaseStudy`(`CaseStudyId`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `CaseStudySector` (
	`CaseStudySectorId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`CaseStudyId` integer NOT NULL,
	`SectorId` integer NOT NULL,
	FOREIGN KEY (`SectorId`) REFERENCES `Sector`(`SectorId`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`CaseStudyId`) REFERENCES `CaseStudy`(`CaseStudyId`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `CaseStudySector_CaseStudyId_SectorId_key` ON `CaseStudySector` (`CaseStudyId`,`SectorId`);--> statement-breakpoint
CREATE TABLE `CaseStudyTags` (
	`CaseStudyTagsId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`CaseStudyId` integer NOT NULL,
	`TagId` integer NOT NULL,
	FOREIGN KEY (`TagId`) REFERENCES `Tags`(`TagId`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`CaseStudyId`) REFERENCES `CaseStudy`(`CaseStudyId`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `CaseStudyTags_CaseStudyId_TagId_key` ON `CaseStudyTags` (`CaseStudyId`,`TagId`);--> statement-breakpoint
CREATE TABLE `CaseStudyTechnique` (
	`CaseStudyTechniqueId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`CaseStudyId` integer,
	`MITRE_TechniqueId` integer,
	`Technique_Name` text,
	`MITRE_TacticId` integer,
	`Tactic_Name` text,
	`Technique_Narratives` text,
	FOREIGN KEY (`MITRE_TechniqueId`) REFERENCES `MITRE_Technique`(`MITRE_TechniqueId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`CaseStudyId`) REFERENCES `CaseStudy`(`CaseStudyId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `CaseStudyTechniqueTiming` (
	`CaseStudyObservableTimingId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`CaseStudyID` integer NOT NULL,
	`UTC_Time` numeric,
	`D_Notation` text,
	`MITRE_TechniqueID` integer,
	`MITRE_TacticId` integer,
	`TimingOrder` integer,
	FOREIGN KEY (`MITRE_TechniqueID`) REFERENCES `MITRE_Technique`(`MITRE_TechniqueId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`MITRE_TacticId`) REFERENCES `MITRE_Tactic`(`MITRE_TacticId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`CaseStudyID`) REFERENCES `CaseStudy`(`CaseStudyId`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `CaseStudyTechniqueTiming_Temp` (
	`Case_Alias` text,
	`Technique_Name` text,
	`Tactic_Name` text,
	`Tech_Tact_Event_Reported_Date` numeric,
	`D_Notation` text,
	`Tact_Tech_SeqID` numeric
);
--> statement-breakpoint
CREATE TABLE `Frequency` (
	`FrequencyId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`FrequencyName` text,
	`FrequencyDescription` text
);
--> statement-breakpoint
CREATE TABLE `Group` (
	`GroupId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`GroupName` text,
	`GroupDescription` text
);
--> statement-breakpoint
CREATE TABLE `MITRE_ArtifactTechnique` (
	`MITRE_ArtifactTechniqueId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ArtifactId` integer NOT NULL,
	`TacticTechniqueIdentifierId` integer NOT NULL,
	`FrequencyId` integer,
	FOREIGN KEY (`TacticTechniqueIdentifierId`) REFERENCES `TacticTechniqueIdentifier`(`TacticTechniqueIdentifierId`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`FrequencyId`) REFERENCES `Frequency`(`FrequencyId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ArtifactId`) REFERENCES `Artifact`(`ArtifactId`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `MITRE_ArtifactTechnique_ArtifactId_TacticTechniqueIdentifierId_key` ON `MITRE_ArtifactTechnique` (`ArtifactId`,`TacticTechniqueIdentifierId`);--> statement-breakpoint
CREATE TABLE `MITRE_Mitigation` (
	`MITRE_MitigationID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`MITRE_MitigationName` text,
	`MITRE_MitigationsDesctiption` text,
	`MITRE_MitID` text
);
--> statement-breakpoint
CREATE TABLE `MITRE_Tactic` (
	`MITRE_TacticId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`MITRE_TacticName` text,
	`MITRE_TacticDescription` text,
	`MITRE_Sequence` integer,
	`MITRE_Id` text,
	`MITREId` text
);
--> statement-breakpoint
CREATE TABLE `MITRE_TacticTechnique` (
	`MITRE_TacticTechniqueId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`MITRE_TacticId` integer NOT NULL,
	`MITRE_TechniqueId` integer NOT NULL,
	`MITRE_Technique_Sequence` integer,
	`MITRE_Tactic_Chart_Order` integer,
	FOREIGN KEY (`MITRE_TechniqueId`) REFERENCES `MITRE_Technique`(`MITRE_TechniqueId`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`MITRE_TacticId`) REFERENCES `MITRE_Tactic`(`MITRE_TacticId`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `MITRE_Technique` (
	`MITRE_TechniqueId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`MITRE_Id` text NOT NULL,
	`MITRE_TechniqueName` text,
	`MITRE_TechniqueDescription` text
);
--> statement-breakpoint
CREATE TABLE `MITRE_TechniqueCampaign` (
	`TechniqueCampaignID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`MITRE_TechniqueId` integer,
	`CampaignID` integer,
	FOREIGN KEY (`MITRE_TechniqueId`) REFERENCES `MITRE_Technique`(`MITRE_TechniqueId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`CampaignID`) REFERENCES `Campaign`(`CampaignId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `MITRE_TechniqueGroup` (
	`TechniqueGroupID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`MITRE_TechniqueId` integer,
	`GroupID` integer,
	FOREIGN KEY (`MITRE_TechniqueId`) REFERENCES `MITRE_Technique`(`MITRE_TechniqueId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`GroupID`) REFERENCES `Group`(`GroupId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `MITRE_TechniqueMitigation` (
	`TechniqueMitigationID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`MITRE_TechniqueId` integer,
	`MITRE_MitigationID` integer,
	`Description` text,
	FOREIGN KEY (`MITRE_TechniqueId`) REFERENCES `MITRE_Technique`(`MITRE_TechniqueId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`MITRE_MitigationID`) REFERENCES `MITRE_Mitigation`(`MITRE_MitigationID`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `MITRE_TechniqueObservableObservedBy` (
	`MITRETechniqueObservedByID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`MITRE_TechniqueId` integer,
	`ObserverID` integer,
	FOREIGN KEY (`ObserverID`) REFERENCES `Observer`(`ObserverId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`MITRE_TechniqueId`) REFERENCES `MITRE_Technique`(`MITRE_TechniqueId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `MITRE_TechniqueSoftware` (
	`TechniqueSoftwareID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`MITRE_TechniqueId` integer,
	`SoftwareID` integer,
	FOREIGN KEY (`SoftwareID`) REFERENCES `Software`(`SoftwareId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`MITRE_TechniqueId`) REFERENCES `MITRE_Technique`(`MITRE_TechniqueId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `NAICS` (
	`NAICSId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`NAICSCode` text,
	`NAICSName` text,
	`NAICSDescription` text
);
--> statement-breakpoint
CREATE TABLE `Observable` (
	`ObservableID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ObservableDescription` text,
	`ObservableLevel` text,
	`FrequencyId` integer,
	`Awareness` text,
	`Understanding` text,
	`Perceivability` text,
	FOREIGN KEY (`FrequencyId`) REFERENCES `Frequency`(`FrequencyId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ObservableLevel` (
	`ObservableLevelID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ParentObersableID` integer,
	`ChildObservableID` integer,
	FOREIGN KEY (`ParentObersableID`) REFERENCES `Observable`(`ObservableID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ChildObservableID`) REFERENCES `Observable`(`ObservableID`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ObservableTacticAndTechnique` (
	`ObservableTacticAndTechniqueId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`TacticTechniqueIdentifierId` integer NOT NULL,
	`ObservableId` integer NOT NULL,
	`FrequencyId` integer,
	FOREIGN KEY (`TacticTechniqueIdentifierId`) REFERENCES `TacticTechniqueIdentifier`(`TacticTechniqueIdentifierId`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`ObservableId`) REFERENCES `Observable`(`ObservableID`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`FrequencyId`) REFERENCES `Frequency`(`FrequencyId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Observer` (
	`ObserverId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ObserverName` text,
	`ObserverDescription` text
);
--> statement-breakpoint
CREATE TABLE `Sector` (
	`SectorId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`SectorName` text NOT NULL,
	`SectorDescription` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Software` (
	`SoftwareId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`SoftwareName` text,
	`SoftwareDescription` text
);
--> statement-breakpoint
CREATE TABLE `SoftwareGroup` (
	`SoftwareGroupId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`SoftwareId` integer,
	`GroupId` integer,
	FOREIGN KEY (`SoftwareId`) REFERENCES `Software`(`SoftwareId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`GroupId`) REFERENCES `Group`(`GroupId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sysdiagrams` (
	`name` text NOT NULL,
	`principal_id` integer NOT NULL,
	`diagram_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`version` integer,
	`definition` blob
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sysdiagrams_principal_id_name_key` ON `sysdiagrams` (`principal_id`,`name`);--> statement-breakpoint
CREATE TABLE `TacticTechniqueIdentifier` (
	`TacticTechniqueIdentifierId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`MITRE_TacticId` integer NOT NULL,
	`MITRE_TechniqueId` integer NOT NULL,
	FOREIGN KEY (`MITRE_TechniqueId`) REFERENCES `MITRE_Technique`(`MITRE_TechniqueId`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`MITRE_TacticId`) REFERENCES `MITRE_Tactic`(`MITRE_TacticId`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `Tags` (
	`TagId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`TagName` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `CaseStudyObservable_backup` (
	`CaseStudyObservableID` integer NOT NULL,
	`CaseStudyID` integer NOT NULL,
	`ObservableID` integer NOT NULL,
	`Probability` text(50)
);
--> statement-breakpoint
CREATE TABLE `ObservationImports` (
	`ImportID` integer NOT NULL,
	`CaseStudyId` integer,
	`CaseStudyName` text(255),
	`TechniqueName` text(255),
	`TacticName` text(255),
	`ObservableDescription` text(5000),
	`NormalFrequency` text(255),
	`pObsTech` text(255),
	`Imported` numeric
);

*/