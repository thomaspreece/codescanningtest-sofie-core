import { Meteor } from 'meteor/meteor'
import { CustomPublish, CustomPublishChanges, meteorCustomPublish } from '../lib/customPublication'
import { CustomCollectionName, PubSub } from '../../lib/api/pubsub'
import { PeripheralDeviceId } from '@sofie-automation/corelib/dist/dataModel/Ids'
import { PeripheralDeviceReadAccess } from '../security/peripheralDevice'
import { PeripheralDevices } from '../../lib/collections/PeripheralDevices'
import { logger } from '../logging'
import { DeviceTriggerMountedActionAdlibsPreview, DeviceTriggerMountedActions } from '../api/deviceTriggers/observer'
import { Mongo } from 'meteor/mongo'
import { ProtectedString } from '@sofie-automation/corelib/dist/protectedString'
import _ from 'underscore'

const PUBLICATION_DEBOUNCE = 20

meteorCustomPublish(
	PubSub.mountedTriggersForDevice,
	CustomCollectionName.MountedTriggers,
	async function (pub, deviceId: PeripheralDeviceId, deviceIds: string[], token) {
		if (await PeripheralDeviceReadAccess.peripheralDeviceContent(deviceId, { userId: this.userId, token })) {
			const peripheralDevice = PeripheralDevices.findOne(deviceId)

			if (!peripheralDevice) throw new Meteor.Error(404, `PeripheralDevice "${deviceId}" not found`)

			const studioId = peripheralDevice.studioId
			if (!studioId) throw new Meteor.Error(400, `Peripheral Device "${deviceId}" not attached to a studio`)

			cursorCustomPublish(
				pub,
				DeviceTriggerMountedActions.find({
					studioId,
					deviceId: {
						$in: deviceIds,
					},
				})
			)
		} else {
			logger.warn(`Pub.mountedTriggersForDevice: Not allowed: "${deviceId}"`)
		}
	}
)

meteorCustomPublish(
	PubSub.mountedTriggersForDevicePreview,
	CustomCollectionName.MountedTriggersPreviews,
	async function (pub, deviceId: PeripheralDeviceId, token) {
		if (await PeripheralDeviceReadAccess.peripheralDeviceContent(deviceId, { userId: this.userId, token })) {
			const peripheralDevice = PeripheralDevices.findOne(deviceId)

			if (!peripheralDevice) throw new Meteor.Error(404, `PeripheralDevice "${deviceId}" not found`)

			const studioId = peripheralDevice.studioId
			if (!studioId) throw new Meteor.Error(400, `Peripheral Device "${deviceId}" not attached to a studio`)

			cursorCustomPublish(
				pub,
				DeviceTriggerMountedActionAdlibsPreview.find({
					studioId,
				})
			)
		} else {
			logger.warn(`Pub.mountedTriggersForDevicePreview: Not allowed: "${deviceId}"`)
		}
	}
)

function cursorCustomPublish<T extends { _id: ProtectedString<any> }>(pub: CustomPublish<T>, cursor: Mongo.Cursor<T>) {
	function createEmptyBuffer(): CustomPublishChanges<T> {
		return {
			added: new Map(),
			changed: new Map(),
			removed: new Set(),
		}
	}

	let buffer: CustomPublishChanges<T> = createEmptyBuffer()

	const bufferChanged = _.debounce(function bufferChanged() {
		const bufferToSend = buffer
		buffer = createEmptyBuffer()
		try {
			// this can now be async
			pub.changed(bufferToSend)
		} catch (e) {
			logger.error(`Error while updating publication: ${e}`, e as any)
		}
	}, PUBLICATION_DEBOUNCE)

	const observer = cursor.observe({
		added: (doc) => {
			if (!pub.isReady) return
			const id = doc._id
			buffer.added.set(id, doc)
			// if the document with the same id has been marked as removed before, clear the removal
			buffer.removed.delete(id)
			buffer.changed.delete(id)
			bufferChanged()
		},
		changed: (doc) => {
			if (!pub.isReady) return
			const id = doc._id
			if (buffer.added.has(id)) {
				buffer.added.set(id, doc)
			} else {
				buffer.changed.set(id, doc)
			}
			bufferChanged()
		},
		removed: (doc) => {
			if (!pub.isReady) return
			const id = doc._id
			buffer.removed.add(id)
			// if the document with the same id has been added before, clear the addition
			buffer.changed.delete(id)
			buffer.added.delete(id)
			bufferChanged()
		},
	})

	pub.init(cursor.fetch())

	pub.onStop(() => {
		observer.stop()
	})
}
