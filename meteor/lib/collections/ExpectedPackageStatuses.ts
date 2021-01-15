import { ExpectedPackageStatusAPI } from '@sofie-automation/blueprints-integration'
import { TransformedCollection } from '../typings/meteor'
import { ProtectedString, registerCollection, Time } from '../lib'
import { createMongoCollection } from './lib'
import { registerIndex } from '../database'
import { ExpectedPackageDBBase, ExpectedPackageId } from './ExpectedPackages'
import { PeripheralDeviceId } from './PeripheralDevices'

export type ExpectedPackageWorkStatusId = ProtectedString<'ExpectedPackageStatusId'>

export interface ExpectedPackageWorkStatus extends Omit<ExpectedPackageStatusAPI.WorkStatus, 'packageId'> {
	_id: ExpectedPackageWorkStatusId

	packageId: ExpectedPackageDBBase['_id']
	studioId: ExpectedPackageDBBase['studioId']
	rundownId: ExpectedPackageDBBase['rundownId']
	pieceId: ExpectedPackageDBBase['pieceId']
	/** Which PeripheralDevice this update came from */
	deviceId: PeripheralDeviceId

	modified: Time
}

export const ExpectedPackageWorkStatuses: TransformedCollection<
	ExpectedPackageWorkStatus,
	ExpectedPackageWorkStatus
> = createMongoCollection<ExpectedPackageWorkStatus>('expectedPackageWorkStatuses')
registerCollection('ExpectedPackageStatuses', ExpectedPackageWorkStatuses)

registerIndex(ExpectedPackageWorkStatuses, {
	studioId: 1,
	rundownId: 1,
})
registerIndex(ExpectedPackageWorkStatuses, {
	deviceId: 1,
})
