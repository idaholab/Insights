// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { relations } from "drizzle-orm/relations";
import { frequency, artifact, caseStudy, caseStudyNaics, naics, observable, caseStudyObservable, caseStudyReference, sector, caseStudySector, tags, caseStudyTags, mitreTechnique, caseStudyTechnique, caseStudyTechniqueTiming, mitreTactic, tacticTechniqueIdentifier, mitreArtifactTechnique, mitreTacticTechnique, mitreTechniqueCampaign, campaign, mitreTechniqueGroup, group, mitreTechniqueMitigation, mitreMitigation, observer, mitreTechniqueObservableObservedBy, software, mitreTechniqueSoftware, observableLevel, observableTacticAndTechnique, softwareGroup } from "./schema";

export const artifactRelations = relations(artifact, ({one, many}) => ({
	frequency: one(frequency, {
		fields: [artifact.frequencyId],
		references: [frequency.frequencyId]
	}),
	mitreArtifactTechniques: many(mitreArtifactTechnique),
}));

export const frequencyRelations = relations(frequency, ({many}) => ({
	artifacts: many(artifact),
	mitreArtifactTechniques: many(mitreArtifactTechnique),
	observables: many(observable),
	observableTacticAndTechniques: many(observableTacticAndTechnique),
}));

export const caseStudyNaicsRelations = relations(caseStudyNaics, ({one}) => ({
	caseStudy: one(caseStudy, {
		fields: [caseStudyNaics.caseStudyId],
		references: [caseStudy.caseStudyId]
	}),
	naic: one(naics, {
		fields: [caseStudyNaics.naicsId],
		references: [naics.naicsId]
	}),
}));

export const caseStudyRelations = relations(caseStudy, ({many}) => ({
	caseStudyNaics: many(caseStudyNaics),
	caseStudyObservables: many(caseStudyObservable),
	caseStudyReferences: many(caseStudyReference),
	caseStudySectors: many(caseStudySector),
	caseStudyTags: many(caseStudyTags),
	caseStudyTechniques: many(caseStudyTechnique),
	caseStudyTechniqueTimings: many(caseStudyTechniqueTiming),
}));

export const naicsRelations = relations(naics, ({many}) => ({
	caseStudyNaics: many(caseStudyNaics),
}));

export const caseStudyObservableRelations = relations(caseStudyObservable, ({one}) => ({
	observable: one(observable, {
		fields: [caseStudyObservable.observableId],
		references: [observable.observableId]
	}),
	caseStudy: one(caseStudy, {
		fields: [caseStudyObservable.caseStudyId],
		references: [caseStudy.caseStudyId]
	}),
}));

export const observableRelations = relations(observable, ({one, many}) => ({
	caseStudyObservables: many(caseStudyObservable),
	frequency: one(frequency, {
		fields: [observable.frequencyId],
		references: [frequency.frequencyId]
	}),
	observableLevels_parentObersableId: many(observableLevel, {
		relationName: "observableLevel_parentObersableId_observable_observableId"
	}),
	observableLevels_childObservableId: many(observableLevel, {
		relationName: "observableLevel_childObservableId_observable_observableId"
	}),
	observableTacticAndTechniques: many(observableTacticAndTechnique),
}));

export const caseStudyReferenceRelations = relations(caseStudyReference, ({one}) => ({
	caseStudy: one(caseStudy, {
		fields: [caseStudyReference.caseStudyId],
		references: [caseStudy.caseStudyId]
	}),
}));

export const caseStudySectorRelations = relations(caseStudySector, ({one}) => ({
	sector: one(sector, {
		fields: [caseStudySector.sectorId],
		references: [sector.sectorId]
	}),
	caseStudy: one(caseStudy, {
		fields: [caseStudySector.caseStudyId],
		references: [caseStudy.caseStudyId]
	}),
}));

export const sectorRelations = relations(sector, ({many}) => ({
	caseStudySectors: many(caseStudySector),
}));

export const caseStudyTagsRelations = relations(caseStudyTags, ({one}) => ({
	tag: one(tags, {
		fields: [caseStudyTags.tagId],
		references: [tags.tagId]
	}),
	caseStudy: one(caseStudy, {
		fields: [caseStudyTags.caseStudyId],
		references: [caseStudy.caseStudyId]
	}),
}));

export const tagsRelations = relations(tags, ({many}) => ({
	caseStudyTags: many(caseStudyTags),
}));

export const caseStudyTechniqueRelations = relations(caseStudyTechnique, ({one}) => ({
	mitreTechnique: one(mitreTechnique, {
		fields: [caseStudyTechnique.mitreTechniqueId],
		references: [mitreTechnique.mitreTechniqueId]
	}),
	caseStudy: one(caseStudy, {
		fields: [caseStudyTechnique.caseStudyId],
		references: [caseStudy.caseStudyId]
	}),
}));

export const mitreTechniqueRelations = relations(mitreTechnique, ({many}) => ({
	caseStudyTechniques: many(caseStudyTechnique),
	caseStudyTechniqueTimings: many(caseStudyTechniqueTiming),
	mitreTacticTechniques: many(mitreTacticTechnique),
	mitreTechniqueCampaigns: many(mitreTechniqueCampaign),
	mitreTechniqueGroups: many(mitreTechniqueGroup),
	mitreTechniqueMitigations: many(mitreTechniqueMitigation),
	mitreTechniqueObservableObservedBies: many(mitreTechniqueObservableObservedBy),
	mitreTechniqueSoftwares: many(mitreTechniqueSoftware),
	tacticTechniqueIdentifiers: many(tacticTechniqueIdentifier),
}));

export const caseStudyTechniqueTimingRelations = relations(caseStudyTechniqueTiming, ({one}) => ({
	mitreTechnique: one(mitreTechnique, {
		fields: [caseStudyTechniqueTiming.mitreTechniqueId],
		references: [mitreTechnique.mitreTechniqueId]
	}),
	mitreTactic: one(mitreTactic, {
		fields: [caseStudyTechniqueTiming.mitreTacticId],
		references: [mitreTactic.mitreTacticId]
	}),
	caseStudy: one(caseStudy, {
		fields: [caseStudyTechniqueTiming.caseStudyId],
		references: [caseStudy.caseStudyId]
	}),
}));

export const mitreTacticRelations = relations(mitreTactic, ({many}) => ({
	caseStudyTechniqueTimings: many(caseStudyTechniqueTiming),
	mitreTacticTechniques: many(mitreTacticTechnique),
	tacticTechniqueIdentifiers: many(tacticTechniqueIdentifier),
}));

export const mitreArtifactTechniqueRelations = relations(mitreArtifactTechnique, ({one}) => ({
	tacticTechniqueIdentifier: one(tacticTechniqueIdentifier, {
		fields: [mitreArtifactTechnique.tacticTechniqueIdentifierId],
		references: [tacticTechniqueIdentifier.tacticTechniqueIdentifierId]
	}),
	frequency: one(frequency, {
		fields: [mitreArtifactTechnique.frequencyId],
		references: [frequency.frequencyId]
	}),
	artifact: one(artifact, {
		fields: [mitreArtifactTechnique.artifactId],
		references: [artifact.artifactId]
	}),
}));

export const tacticTechniqueIdentifierRelations = relations(tacticTechniqueIdentifier, ({one, many}) => ({
	mitreArtifactTechniques: many(mitreArtifactTechnique),
	observableTacticAndTechniques: many(observableTacticAndTechnique),
	mitreTechnique: one(mitreTechnique, {
		fields: [tacticTechniqueIdentifier.mitreTechniqueId],
		references: [mitreTechnique.mitreTechniqueId]
	}),
	mitreTactic: one(mitreTactic, {
		fields: [tacticTechniqueIdentifier.mitreTacticId],
		references: [mitreTactic.mitreTacticId]
	}),
}));

export const mitreTacticTechniqueRelations = relations(mitreTacticTechnique, ({one}) => ({
	mitreTechnique: one(mitreTechnique, {
		fields: [mitreTacticTechnique.mitreTechniqueId],
		references: [mitreTechnique.mitreTechniqueId]
	}),
	mitreTactic: one(mitreTactic, {
		fields: [mitreTacticTechnique.mitreTacticId],
		references: [mitreTactic.mitreTacticId]
	}),
}));

export const mitreTechniqueCampaignRelations = relations(mitreTechniqueCampaign, ({one}) => ({
	mitreTechnique: one(mitreTechnique, {
		fields: [mitreTechniqueCampaign.mitreTechniqueId],
		references: [mitreTechnique.mitreTechniqueId]
	}),
	campaign: one(campaign, {
		fields: [mitreTechniqueCampaign.campaignId],
		references: [campaign.campaignId]
	}),
}));

export const campaignRelations = relations(campaign, ({many}) => ({
	mitreTechniqueCampaigns: many(mitreTechniqueCampaign),
}));

export const mitreTechniqueGroupRelations = relations(mitreTechniqueGroup, ({one}) => ({
	mitreTechnique: one(mitreTechnique, {
		fields: [mitreTechniqueGroup.mitreTechniqueId],
		references: [mitreTechnique.mitreTechniqueId]
	}),
	group: one(group, {
		fields: [mitreTechniqueGroup.groupId],
		references: [group.groupId]
	}),
}));

export const groupRelations = relations(group, ({many}) => ({
	mitreTechniqueGroups: many(mitreTechniqueGroup),
	softwareGroups: many(softwareGroup),
}));

export const mitreTechniqueMitigationRelations = relations(mitreTechniqueMitigation, ({one}) => ({
	mitreTechnique: one(mitreTechnique, {
		fields: [mitreTechniqueMitigation.mitreTechniqueId],
		references: [mitreTechnique.mitreTechniqueId]
	}),
	mitreMitigation: one(mitreMitigation, {
		fields: [mitreTechniqueMitigation.mitreMitigationId],
		references: [mitreMitigation.mitreMitigationId]
	}),
}));

export const mitreMitigationRelations = relations(mitreMitigation, ({many}) => ({
	mitreTechniqueMitigations: many(mitreTechniqueMitigation),
}));

export const mitreTechniqueObservableObservedByRelations = relations(mitreTechniqueObservableObservedBy, ({one}) => ({
	observer: one(observer, {
		fields: [mitreTechniqueObservableObservedBy.observerId],
		references: [observer.observerId]
	}),
	mitreTechnique: one(mitreTechnique, {
		fields: [mitreTechniqueObservableObservedBy.mitreTechniqueId],
		references: [mitreTechnique.mitreTechniqueId]
	}),
}));

export const observerRelations = relations(observer, ({many}) => ({
	mitreTechniqueObservableObservedBies: many(mitreTechniqueObservableObservedBy),
}));

export const mitreTechniqueSoftwareRelations = relations(mitreTechniqueSoftware, ({one}) => ({
	software: one(software, {
		fields: [mitreTechniqueSoftware.softwareId],
		references: [software.softwareId]
	}),
	mitreTechnique: one(mitreTechnique, {
		fields: [mitreTechniqueSoftware.mitreTechniqueId],
		references: [mitreTechnique.mitreTechniqueId]
	}),
}));

export const softwareRelations = relations(software, ({many}) => ({
	mitreTechniqueSoftwares: many(mitreTechniqueSoftware),
	softwareGroups: many(softwareGroup),
}));

export const observableLevelRelations = relations(observableLevel, ({one}) => ({
	observable_parentObersableId: one(observable, {
		fields: [observableLevel.parentObersableId],
		references: [observable.observableId],
		relationName: "observableLevel_parentObersableId_observable_observableId"
	}),
	observable_childObservableId: one(observable, {
		fields: [observableLevel.childObservableId],
		references: [observable.observableId],
		relationName: "observableLevel_childObservableId_observable_observableId"
	}),
}));

export const observableTacticAndTechniqueRelations = relations(observableTacticAndTechnique, ({one}) => ({
	tacticTechniqueIdentifier: one(tacticTechniqueIdentifier, {
		fields: [observableTacticAndTechnique.tacticTechniqueIdentifierId],
		references: [tacticTechniqueIdentifier.tacticTechniqueIdentifierId]
	}),
	observable: one(observable, {
		fields: [observableTacticAndTechnique.observableId],
		references: [observable.observableId]
	}),
	frequency: one(frequency, {
		fields: [observableTacticAndTechnique.frequencyId],
		references: [frequency.frequencyId]
	}),
}));

export const softwareGroupRelations = relations(softwareGroup, ({one}) => ({
	software: one(software, {
		fields: [softwareGroup.softwareId],
		references: [software.softwareId]
	}),
	group: one(group, {
		fields: [softwareGroup.groupId],
		references: [group.groupId]
	}),
}));