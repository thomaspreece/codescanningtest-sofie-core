import * as React from 'react'
import * as ClassNames from 'classnames'
import { RundownAPI } from '../../../lib/api/rundown'

import { DEFAULT_BUTTON_HEIGHT, DEFAULT_BUTTON_WIDTH } from './DashboardPieceButton'
import { DashboardLayoutActionButton, ActionButtonType } from '../../../lib/collections/RundownLayouts'
import { DashboardActionButton } from './DashboardActionButton'
import { doUserAction } from '../../lib/userAction'
import { UserActionAPI } from '../../../lib/api/userActions'
import { translate } from 'react-i18next'
import { Translated } from '../../lib/ReactMeteorData/react-meteor-data'
import { Rundown } from '../../../lib/collections/Rundowns'
import { doModalDialog } from '../../lib/ModalDialog'

export interface IDashboardButtonGroupProps {
	buttons: DashboardLayoutActionButton[]
	studioMode: boolean
	rundown: Rundown

	onChangeQueueAdLib?: (isQueue: boolean, e: any) => void
}

export const DashboardActionButtonGroup = translate()(class DashboardActionButtonGroup extends React.Component<Translated<IDashboardButtonGroupProps>> {

	take = (e: any) => {
		const { t } = this.props
		if (this.props.studioMode) {
			doUserAction(t, e, UserActionAPI.methods.take, [this.props.rundown._id])
		}
	}

	klarOnAir = (e: any) => {
		const { t } = this.props
		if (this.props.studioMode) {
			if (this.props.rundown.active) {
				doModalDialog({
					title: this.props.rundown.name,
					message: t('Are you sure you want to deactivate this Rundown?\n(This will clear the outputs)'),
					warning: true,
					onAccept: () => {
						doUserAction(t, e, UserActionAPI.methods.deactivate, [this.props.rundown._id])
					}
				})
			} else {
				doUserAction(t, e, UserActionAPI.methods.resetAndActivate, [this.props.rundown._id])
				doUserAction(t, e, UserActionAPI.methods.take, [this.props.rundown._id])
			}
		}
	}

	onButtonDown = (button: DashboardLayoutActionButton, e: React.SyntheticEvent<HTMLElement>) => {
		switch (button.type) {
			case ActionButtonType.QUEUE_ADLIB:
				this.props.onChangeQueueAdLib && this.props.onChangeQueueAdLib(true, e)
				break
		}
	}

	onButtonUp = (button: DashboardLayoutActionButton, e: React.SyntheticEvent<HTMLElement>) => {
		switch (button.type) {
			case ActionButtonType.TAKE:
				this.take(e)
				break
			case ActionButtonType.QUEUE_ADLIB:
				this.props.onChangeQueueAdLib && this.props.onChangeQueueAdLib(false, e)
				break
			case ActionButtonType.KLAR_ON_AIR:
				this.klarOnAir(e)
				break
		}
	}

	render () {
		return this.props.buttons
				.map((button: DashboardLayoutActionButton, index) =>
					<DashboardActionButton
						key={button._id}
						onButtonDown={this.onButtonDown}
						onButtonUp={this.onButtonUp}
						button={button}
						rundown={this.props.rundown} />
				)
	}
})
