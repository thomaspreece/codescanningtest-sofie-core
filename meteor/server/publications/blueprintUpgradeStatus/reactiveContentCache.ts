import { ReactiveCacheCollection } from '../lib/ReactiveCacheCollection'
import { literal } from '@sofie-automation/corelib/dist/lib'
import { MongoFieldSpecifierOnesStrict } from '@sofie-automation/corelib/dist/mongo'
import { DBStudio } from '@sofie-automation/corelib/dist/dataModel/Studio'
import { DBShowStyleBase } from '@sofie-automation/corelib/dist/dataModel/ShowStyleBase'
import { Blueprint } from '@sofie-automation/corelib/dist/dataModel/Blueprint'

export type StudioFields =
	| '_id'
	| 'blueprintId'
	| 'blueprintConfigPresetId'
	| 'lastBlueprintConfig'
	| 'blueprintConfigWithOverrides'
	| 'name'
export const studioFieldSpecifier = literal<MongoFieldSpecifierOnesStrict<Pick<DBStudio, StudioFields>>>({
	_id: 1,
	blueprintId: 1,
	blueprintConfigPresetId: 1,
	lastBlueprintConfig: 1,
	blueprintConfigWithOverrides: 1,
	name: 1,
})

export type ShowStyleBaseFields =
	| '_id'
	| 'blueprintId'
	| 'blueprintConfigPresetId'
	| 'lastBlueprintConfig'
	| 'blueprintConfigWithOverrides'
	| 'name'
export const showStyleFieldSpecifier = literal<
	MongoFieldSpecifierOnesStrict<Pick<DBShowStyleBase, ShowStyleBaseFields>>
>({
	_id: 1,
	blueprintId: 1,
	blueprintConfigPresetId: 1,
	lastBlueprintConfig: 1,
	blueprintConfigWithOverrides: 1,
	name: 1,
})

export type BlueprintFields =
	| '_id'
	| 'studioConfigPresets'
	| 'studioConfigSchema'
	| 'showStyleConfigPresets'
	| 'showStyleConfigSchema'
	| 'blueprintHash'
	| 'blueprintType'
export const blueprintFieldSpecifier = literal<MongoFieldSpecifierOnesStrict<Pick<Blueprint, BlueprintFields>>>({
	_id: 1,
	studioConfigPresets: 1,
	studioConfigSchema: 1,
	showStyleConfigPresets: 1,
	showStyleConfigSchema: 1,
	blueprintHash: 1,
	blueprintType: 1,
})

export interface ContentCache {
	Studios: ReactiveCacheCollection<Pick<DBStudio, StudioFields>>
	ShowStyleBases: ReactiveCacheCollection<Pick<DBShowStyleBase, ShowStyleBaseFields>>
	Blueprints: ReactiveCacheCollection<Pick<Blueprint, BlueprintFields>>
}

export function createReactiveContentCache(): ContentCache {
	const cache: ContentCache = {
		Studios: new ReactiveCacheCollection<Pick<DBStudio, StudioFields>>('studios'),
		ShowStyleBases: new ReactiveCacheCollection<Pick<DBShowStyleBase, ShowStyleBaseFields>>('showStyleBases'),
		Blueprints: new ReactiveCacheCollection<Pick<Blueprint, BlueprintFields>>('blueprints'),
	}

	return cache
}
