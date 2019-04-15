import { Mongo } from 'meteor/mongo'
import { TransformedCollection } from '../typings/meteor'
import { registerCollection } from '../lib'
import { Meteor } from 'meteor/meteor'

export interface RunningOrderDataCacheObj {
	_id: string,
	modified: number,
	/** Id of the Running Order */
	roId: string,
	data: any
}

export enum CachePrefix {
	INGEST_PART = 'fullStory',
	INGEST_RUNNINGORDER = 'roCreate',
	INGEST_SEGMENT = 'segment'
}

// TODO Deprecate?
export const RunningOrderDataCache: TransformedCollection<RunningOrderDataCacheObj, RunningOrderDataCacheObj>
	= new Mongo.Collection<RunningOrderDataCacheObj>('runningorderdatacache')
registerCollection('RunningOrderDataCache', RunningOrderDataCache)
Meteor.startup(() => {
	if (Meteor.isServer) {
		RunningOrderDataCache._ensureIndex({
			roId: 1
		})
	}
})
