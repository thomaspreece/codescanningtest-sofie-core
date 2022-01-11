import { PieceLifespan, SourceLayerType } from '@sofie-automation/blueprints-integration'
import classNames from 'classnames'
import { RundownAPI } from '../../../lib/api/rundown'
import { PartId } from '../../../lib/collections/Parts'
import { PieceUi } from '../../ui/SegmentContainer/withResolvedSegment'
import { RundownUtils } from '../rundown'

export function pieceUiClassNames(
	pieceInstance: PieceUi,
	baseClassName: string,
	layerType?: SourceLayerType,
	partId?: PartId,
	highlight?: boolean,
	relative?: boolean,
	uiState?: {
		leftAnchoredWidth: number
		rightAnchoredWidth: number
		elementWidth: number
	}
): string {
	const typeClass = layerType ? RundownUtils.getSourceLayerClassName(layerType) : ''

	const innerPiece = pieceInstance.instance.piece

	return classNames(baseClassName, typeClass, {
		'with-in-transition':
			!relative &&
			innerPiece.transitions &&
			innerPiece.transitions.inTransition &&
			(innerPiece.transitions.inTransition.duration || 0) > 0,
		'with-out-transition':
			!relative &&
			innerPiece.transitions &&
			innerPiece.transitions.outTransition &&
			(innerPiece.transitions.outTransition.duration || 0) > 0,

		'hide-overflow-labels': uiState
			? uiState.leftAnchoredWidth > 0 &&
			  uiState.rightAnchoredWidth > 0 &&
			  uiState.leftAnchoredWidth + uiState.rightAnchoredWidth > uiState.elementWidth
			: undefined,

		'super-infinite':
			innerPiece.lifespan !== PieceLifespan.WithinPart &&
			innerPiece.lifespan !== PieceLifespan.OutOnSegmentChange &&
			innerPiece.lifespan !== PieceLifespan.OutOnSegmentEnd,
		'infinite-starts':
			innerPiece.lifespan !== PieceLifespan.WithinPart &&
			innerPiece.lifespan !== PieceLifespan.OutOnSegmentChange &&
			innerPiece.lifespan !== PieceLifespan.OutOnSegmentEnd &&
			innerPiece.startPartId === partId,

		'not-in-vision': innerPiece.notInVision,

		'next-is-touching': pieceInstance.cropped,

		'source-missing':
			innerPiece.status === RundownAPI.PieceStatusCode.SOURCE_MISSING ||
			innerPiece.status === RundownAPI.PieceStatusCode.SOURCE_NOT_SET,
		'source-broken': innerPiece.status === RundownAPI.PieceStatusCode.SOURCE_BROKEN,
		'unknown-state': innerPiece.status === RundownAPI.PieceStatusCode.UNKNOWN,
		disabled: pieceInstance.instance.disabled,

		'invert-flash': highlight,
	})
}