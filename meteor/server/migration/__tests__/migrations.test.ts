import * as _ from 'underscore'
import { setupEmptyEnvironment } from '../../../__mocks__/helpers/database'
import { testInFiber } from '../../../__mocks__/helpers/jest'
import { ICoreSystem, GENESIS_SYSTEM_VERSION } from '../../../lib/collections/CoreSystem'
import { clearMigrationSteps, addMigrationSteps, prepareMigration, PreparedMigration } from '../databaseMigration'
import { CURRENT_SYSTEM_VERSION } from '../currentSystemVersion'
import { RunMigrationResult, GetMigrationStatusResult } from '../../../lib/api/migration'
import { literal, protectString } from '../../../lib/lib'
import {
	MigrationStepInputResult,
	BlueprintManifestType,
	MigrationContextStudio,
	MigrationContextShowStyle,
	PlaylistTimingType,
	PlaylistTimingNone,
	ShowStyleBlueprintManifest,
	StudioBlueprintManifest,
} from '@sofie-automation/blueprints-integration'
import { Studio } from '../../../lib/collections/Studios'
import { generateFakeBlueprint } from '../../api/blueprints/__tests__/lib'
import { MeteorCall } from '../../../lib/api/methods'
import { wrapDefaultObject } from '@sofie-automation/corelib/dist/settings/objectWithOverrides'
import { Blueprints, ShowStyleBases, ShowStyleVariants, Studios } from '../../collections'
import { getCoreSystem } from '../../coreSystem/collection'

require('../../api/peripheralDevice.ts') // include in order to create the Meteor methods needed
require('../api') // include in order to create the Meteor methods needed
require('../../api/blueprints/api.ts') // include in order to create the Meteor methods needed

require('../migrations') // include in order to create the migration steps

// Include all migration scripts:
const normalizedPath = require('path').join(__dirname, '../')
require('fs')
	.readdirSync(normalizedPath)
	.forEach((fileName) => {
		if (fileName.match(/\d+_\d+_\d+\.ts/)) {
			// x_y_z.ts
			require('../' + fileName)
		}
	})

describe('Migrations', () => {
	beforeAll(() => {
		setupEmptyEnvironment()
	})
	function getSystem() {
		return getCoreSystem() as ICoreSystem
	}
	function userInput(
		migrationStatus: GetMigrationStatusResult,
		userValues?: { [key: string]: any }
	): MigrationStepInputResult[] {
		return _.compact(
			_.map(migrationStatus.migration.manualInputs, (manualInput) => {
				if (manualInput.stepId && manualInput.attribute) {
					return literal<MigrationStepInputResult>({
						stepId: manualInput.stepId,
						attribute: manualInput.attribute,
						value: userValues && userValues[manualInput.stepId],
					})
				}
			})
		)
	}
	testInFiber('System migrations, initial setup', async () => {
		expect(getSystem().version).toEqual(GENESIS_SYSTEM_VERSION)

		const migrationStatus0: GetMigrationStatusResult = await MeteorCall.migration.getMigrationStatus()

		expect(migrationStatus0.migration.automaticStepCount).toBeGreaterThanOrEqual(1)

		expect(migrationStatus0).toMatchObject({
			migrationNeeded: true,

			migration: {
				canDoAutomaticMigration: true,
				// manualInputs: [],
				hash: expect.stringContaining(''),
				automaticStepCount: expect.any(Number),
				manualStepCount: expect.any(Number),
				ignoredStepCount: expect.any(Number),
				partialMigration: true,
				// chunks: expect.any(Array)
			},
		})

		const migrationResult0: RunMigrationResult = await MeteorCall.migration.runMigration(
			migrationStatus0.migration.chunks,
			migrationStatus0.migration.hash,
			userInput(migrationStatus0)
		)

		expect(migrationResult0).toMatchObject({
			migrationCompleted: true,
			partialMigration: false,
			warnings: [],
			snapshot: expect.any(String),
		})

		expect(getSystem().version).toEqual(CURRENT_SYSTEM_VERSION)
	})

	testInFiber('Ensure migrations run in correct order', async () => {
		await MeteorCall.migration.resetDatabaseVersions()

		expect(getSystem().version).toEqual(GENESIS_SYSTEM_VERSION)

		clearMigrationSteps()

		const addSteps0_2_0 = addMigrationSteps('0.2.0', [
			{
				id: 'myCoreMockStep2',
				canBeRunAutomatically: true,
				validate: async () => {
					if (!(await Studios.findOneAsync(protectString('studioMock2')))) return 'No Studio found'
					return false
				},
				migrate: async () => {
					await Studios.insertAsync({
						_id: protectString('studioMock2'),
						name: 'Default studio',
						organizationId: null,
						supportedShowStyleBase: [],
						settings: {
							mediaPreviewsUrl: '',
							frameRate: 25,
						},
						mappingsWithOverrides: wrapDefaultObject({}),
						blueprintConfigWithOverrides: wrapDefaultObject({}),
						_rundownVersionHash: '',
						routeSets: {},
						routeSetExclusivityGroups: {},
						packageContainers: {},
						previewContainerIds: [],
						thumbnailContainerIds: [],
						peripheralDeviceSettings: {
							playoutDevices: wrapDefaultObject({}),
							ingestDevices: wrapDefaultObject({}),
							inputDevices: wrapDefaultObject({}),
						},
						lastBlueprintConfig: undefined,
					})
				},
			},
		])
		const addSteps0_3_0 = addMigrationSteps('0.3.0', [
			{
				id: 'myCoreMockStep3',
				canBeRunAutomatically: true,
				validate: async () => {
					if (!(await Studios.findOneAsync(protectString('studioMock3')))) return 'No Studio found'
					return false
				},
				migrate: async () => {
					await Studios.insertAsync({
						_id: protectString('studioMock3'),
						name: 'Default studio',
						organizationId: null,
						supportedShowStyleBase: [],
						settings: {
							mediaPreviewsUrl: '',
							frameRate: 25,
						},
						mappingsWithOverrides: wrapDefaultObject({}),
						blueprintConfigWithOverrides: wrapDefaultObject({}),
						_rundownVersionHash: '',
						routeSets: {},
						routeSetExclusivityGroups: {},
						packageContainers: {},
						previewContainerIds: [],
						thumbnailContainerIds: [],
						peripheralDeviceSettings: {
							playoutDevices: wrapDefaultObject({}),
							ingestDevices: wrapDefaultObject({}),
							inputDevices: wrapDefaultObject({}),
						},
						lastBlueprintConfig: undefined,
					})
				},
			},
		])
		const addSteps0_1_0 = addMigrationSteps('0.1.0', [
			{
				id: 'myCoreMockStep1',
				canBeRunAutomatically: true,
				validate: async () => {
					if (!(await Studios.findOneAsync(protectString('studioMock1')))) return 'No Studio found'
					return false
				},
				migrate: async () => {
					await Studios.insertAsync({
						_id: protectString('studioMock1'),
						name: 'Default studio',
						organizationId: null,
						supportedShowStyleBase: [],
						settings: {
							mediaPreviewsUrl: '',
							frameRate: 25,
						},
						mappingsWithOverrides: wrapDefaultObject({}),
						blueprintConfigWithOverrides: wrapDefaultObject({}),
						_rundownVersionHash: '',
						routeSets: {},
						routeSetExclusivityGroups: {},
						packageContainers: {},
						previewContainerIds: [],
						thumbnailContainerIds: [],
						peripheralDeviceSettings: {
							playoutDevices: wrapDefaultObject({}),
							ingestDevices: wrapDefaultObject({}),
							inputDevices: wrapDefaultObject({}),
						},
						lastBlueprintConfig: undefined,
					})
				},
			},
		])
		addSteps0_2_0()
		addSteps0_3_0()
		addSteps0_1_0()

		let migration: PreparedMigration

		migration = prepareMigration(true)
		expect(migration.migrationNeeded).toEqual(true)
		expect(migration.automaticStepCount).toEqual(3)

		expect(_.find(migration.steps, (s) => !!s.id.match(/myCoreMockStep1/))).toBeTruthy()
		expect(_.find(migration.steps, (s) => !!s.id.match(/myCoreMockStep2/))).toBeTruthy()
		expect(_.find(migration.steps, (s) => !!s.id.match(/myCoreMockStep3/))).toBeTruthy()

		const studio = (await Studios.findOneAsync({})) as Studio
		expect(studio).toBeTruthy()

		const studioManifest = (): StudioBlueprintManifest => ({
			blueprintType: 'studio' as BlueprintManifestType.STUDIO,
			blueprintVersion: '1.0.0',
			integrationVersion: '0.0.0',
			TSRVersion: '0.0.0',

			configPresets: {
				main: {
					name: 'Main',
					config: {},
				},
			},

			studioConfigSchema: '{}' as any,
			studioMigrations: [
				{
					version: '0.2.0',
					id: 'myStudioMockStep2',
					validate: (context: MigrationContextStudio) => {
						if (!context.getConfig('mocktest2')) return `mocktest2 config not set`
						return false
					},
					canBeRunAutomatically: true,
					migrate: (context: MigrationContextStudio) => {
						if (!context.getConfig('mocktest2')) {
							context.setConfig('mocktest2', true)
						}
					},
				},
				{
					version: '0.3.0',
					id: 'myStudioMockStep3',
					validate: (context: MigrationContextStudio) => {
						if (!context.getConfig('mocktest3')) return `mocktest3 config not set`
						return false
					},
					canBeRunAutomatically: true,
					migrate: (context: MigrationContextStudio) => {
						if (!context.getConfig('mocktest3')) {
							context.setConfig('mocktest3', true)
						}
					},
				},
				{
					version: '0.1.0',
					id: 'myStudioMockStep1',
					validate: (context: MigrationContextStudio) => {
						if (!context.getConfig('mocktest1')) return `mocktest1 config not set`
						return false
					},
					canBeRunAutomatically: true,
					migrate: (context: MigrationContextStudio) => {
						if (!context.getConfig('mocktest1')) {
							context.setConfig('mocktest1', true)
						}
					},
				},
			],
			getBaseline: () => {
				return {
					timelineObjects: [],
				}
			},
			getShowStyleId: () => null,
		})

		const showStyleManifest = (): ShowStyleBlueprintManifest => ({
			blueprintType: 'showstyle' as BlueprintManifestType.SHOWSTYLE,
			blueprintVersion: '1.0.0',
			integrationVersion: '0.0.0',
			TSRVersion: '0.0.0',

			configPresets: {
				main: {
					name: 'Main',
					config: {},

					variants: {
						main: {
							name: 'Default',
							config: {},
						},
					},
				},
			},

			showStyleConfigSchema: '{}' as any,
			showStyleMigrations: [
				{
					version: '0.2.0',
					id: 'myShowStyleMockStep2',
					validate: (context: MigrationContextShowStyle) => {
						if (!context.getBaseConfig('mocktest2')) return `mocktest2 config not set`
						return false
					},
					canBeRunAutomatically: true,
					migrate: (context: MigrationContextShowStyle) => {
						if (!context.getBaseConfig('mocktest2')) {
							context.setBaseConfig('mocktest2', true)
						}
					},
				},
				{
					version: '0.3.0',
					id: 'myShowStyleMockStep3',
					validate: (context: MigrationContextShowStyle) => {
						if (!context.getBaseConfig('mocktest3')) return `mocktest3 config not set`
						return false
					},
					canBeRunAutomatically: true,
					migrate: (context: MigrationContextShowStyle) => {
						if (!context.getBaseConfig('mocktest3')) {
							context.setBaseConfig('mocktest3', true)
						}
					},
				},
				{
					version: '0.1.0',
					id: 'myShowStyleMockStep1',
					validate: (context: MigrationContextShowStyle) => {
						if (!context.getBaseConfig('mocktest1')) return `mocktest1 config not set`
						return false
					},
					canBeRunAutomatically: true,
					migrate: (context: MigrationContextShowStyle) => {
						if (!context.getBaseConfig('mocktest1')) {
							context.setBaseConfig('mocktest1', true)
						}
					},
				},
			],
			getShowStyleVariantId: () => null,
			getRundown: () => ({
				rundown: {
					externalId: '',
					name: '',
					timing: literal<PlaylistTimingNone>({
						type: PlaylistTimingType.None,
					}),
				},
				globalAdLibPieces: [],
				globalActions: [],
				baseline: { timelineObjects: [] },
			}),
			getSegment: () => ({
				segment: { name: '' },
				parts: [],
			}),
		})

		await Blueprints.insertAsync(
			generateFakeBlueprint('showStyle0', BlueprintManifestType.SHOWSTYLE, showStyleManifest)
		)

		await ShowStyleBases.insertAsync({
			_id: protectString('showStyle0'),
			name: '',
			organizationId: null,
			blueprintId: protectString('showStyle0'),
			outputLayersWithOverrides: wrapDefaultObject({}),
			sourceLayersWithOverrides: wrapDefaultObject({}),
			hotkeyLegend: [],
			blueprintConfigWithOverrides: wrapDefaultObject({}),
			_rundownVersionHash: '',
			lastBlueprintConfig: undefined,
		})

		await ShowStyleVariants.insertAsync({
			_id: protectString('variant0'),
			name: '',
			showStyleBaseId: protectString('showStyle0'),
			blueprintConfigWithOverrides: wrapDefaultObject({}),
			_rundownVersionHash: '',
			_rank: 0,
		})

		await Blueprints.insertAsync(generateFakeBlueprint('studio0', BlueprintManifestType.STUDIO, studioManifest))
		await Studios.updateAsync(studio._id, {
			$set: {
				blueprintId: protectString('studio0'),
			},
		})

		// migrationStatus = Meteor.call(MigrationMethods.getMigrationStatus)
		migration = prepareMigration(true)

		expect(migration.migrationNeeded).toEqual(true)

		// const _steps = migration.steps as MigrationStep[]

		// Note: This test is temporarily disabled, pending discussion regarding migrations
		// /@nytamin 2020-08-27
		/*

		expect(migration.automaticStepCount).toEqual(3 + 6)

		const myCoreMockStep1 = _.find(steps, (s) => s.id.match(/myCoreMockStep1/)) as MigrationStep
		const myCoreMockStep2 = _.find(steps, (s) => s.id.match(/myCoreMockStep2/)) as MigrationStep
		const myCoreMockStep3 = _.find(steps, (s) => s.id.match(/myCoreMockStep3/)) as MigrationStep
		const myStudioMockStep1 = _.find(steps, (s) => s.id.match(/myStudioMockStep1/)) as MigrationStep
		const myStudioMockStep2 = _.find(steps, (s) => s.id.match(/myStudioMockStep2/)) as MigrationStep
		const myStudioMockStep3 = _.find(steps, (s) => s.id.match(/myStudioMockStep3/)) as MigrationStep
		const myShowStyleMockStep1 = _.find(steps, (s) => s.id.match(/myShowStyleMockStep1/)) as MigrationStep
		const myShowStyleMockStep2 = _.find(steps, (s) => s.id.match(/myShowStyleMockStep2/)) as MigrationStep
		const myShowStyleMockStep3 = _.find(steps, (s) => s.id.match(/myShowStyleMockStep3/)) as MigrationStep

		expect(myCoreMockStep1).toBeTruthy()
		expect(myCoreMockStep2).toBeTruthy()
		expect(myCoreMockStep3).toBeTruthy()
		expect(myStudioMockStep1).toBeTruthy()
		expect(myStudioMockStep2).toBeTruthy()
		expect(myStudioMockStep3).toBeTruthy()
		expect(myShowStyleMockStep1).toBeTruthy()
		expect(myShowStyleMockStep2).toBeTruthy()
		expect(myShowStyleMockStep3).toBeTruthy()

		// Check that the steps are in the correct order:

		// First, the Core migration steps:
		expect(steps.indexOf(myCoreMockStep1)).toEqual(0)
		expect(steps.indexOf(myCoreMockStep2)).toEqual(1)
		expect(steps.indexOf(myCoreMockStep3)).toEqual(2)
		// Then, the System-blueprints migration steps:
		to-be-implemented..

		// Then, the Studio-blueprints migration steps:
		expect(steps.indexOf(myStudioMockStep1)).toEqual(3)
		expect(steps.indexOf(myStudioMockStep2)).toEqual(4)
		expect(steps.indexOf(myStudioMockStep3)).toEqual(5)

		// Then, the ShowStyle-blueprints migration steps:
		expect(steps.indexOf(myShowStyleMockStep1)).toEqual(6)
		expect(steps.indexOf(myShowStyleMockStep2)).toEqual(7)
		expect(steps.indexOf(myShowStyleMockStep3)).toEqual(8)
		*/
	})
})
