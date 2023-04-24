import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { withTracker } from '../../lib/ReactMeteorData/react-meteor-data'

import { RundownTimingProvider } from '../RundownView/RundownTiming/RundownTimingProvider'

import { objectPathGet } from '../../../lib/lib'
import { MeteorReactComponent } from '../../lib/MeteorReactComponent'
import { PubSub } from '../../../lib/api/pubsub'
import { StudioScreenSaver } from '../StudioScreenSaver/StudioScreenSaver'
import { PresenterScreen } from './PresenterScreen'
import { OverlayScreen } from './OverlayScreen'
import { OverlayScreenSaver } from './OverlayScreenSaver'
import { RundownPlaylists } from '../../collections'
import { RundownPlaylist } from '../../../lib/collections/RundownPlaylists'
import { StudioId } from '@sofie-automation/corelib/dist/dataModel/Ids'
import { CameraScreen } from './CameraScreen'

interface IPropsHeader {
	key: string
	playlist: RundownPlaylist | undefined
	studioId: StudioId
}

interface IStateHeader {}

export const ClockView = withTracker(function (props: IPropsHeader) {
	const studioId = objectPathGet(props, 'match.params.studioId')
	const playlist = RundownPlaylists.findOne({
		activationId: { $exists: true },
		studioId,
	})

	return {
		playlist,
		studioId,
	}
})(
	class ClockView extends MeteorReactComponent<IPropsHeader, IStateHeader> {
		componentDidMount(): void {
			const { studioId } = this.props
			if (studioId) {
				this.subscribe(PubSub.rundownPlaylists, {
					activationId: { $exists: true },
					studioId,
				})
			}
		}

		render(): JSX.Element {
			return (
				<Switch>
					<Route path="/countdowns/:studioId/presenter">
						{this.props.playlist ? (
							<RundownTimingProvider playlist={this.props.playlist}>
								<PresenterScreen playlistId={this.props.playlist._id} studioId={this.props.studioId} />
							</RundownTimingProvider>
						) : (
							<StudioScreenSaver studioId={this.props.studioId} ownBackground={true} />
						)}
					</Route>
					<Route path="/countdowns/:studioId/overlay">
						{this.props.playlist ? (
							<RundownTimingProvider playlist={this.props.playlist}>
								<OverlayScreen playlistId={this.props.playlist._id} studioId={this.props.studioId} />
							</RundownTimingProvider>
						) : (
							<OverlayScreenSaver studioId={this.props.studioId} />
						)}
					</Route>
					<Route path="/countdowns/:studioId/camera">
						<RundownTimingProvider playlist={this.props.playlist}>
							<CameraScreen playlist={this.props.playlist} studioId={this.props.studioId} />
						</RundownTimingProvider>
					</Route>
					<Route>
						<Redirect to="/" />
					</Route>
				</Switch>
			)
		}
	}
)
