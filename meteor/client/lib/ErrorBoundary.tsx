import * as React from 'react'

interface IState {
	error: {
		error: Error
		info: React.ErrorInfo
	} | null
}

export class ErrorBoundary extends React.Component<{}, IState> {
	static style: { [key: string]: React.CSSProperties } = {
		container: {
			position: 'relative',
			display: 'block',
			margin: '10px',
			padding: '10px',
			// fontSize: '12px',
			// lineHeight: '1.2em',

			// fontWeight: 300,
			textDecoration: 'none',
			// width: '100%',
			height: 'auto',
			overflow: 'visible',
			background: '#ffdddd',
			color: 'black',
			border: '2px solid red',

			cursor: 'text',
		},
		h1: {
			fontSize: '18px',
			fontWeight: 'bold',

			margin: '10px',
			padding: '0',

			color: 'red',
		},
		friendlyMessage: {
			margin: '10px',
			padding: '0',

			fontWeight: 'bold',
		},
		errorDescription: {
			padding: '10px',

			border: '1px solid red',
			boxShadow: '0px 0px 10px inset #e00',
			backgroundColor: '#ebebeb',

			overflow: 'auto',
			minHeight: '5em',
			fontSize: '12px',
			fontFamily: 'monospace',
		},
		stack: {
			display: 'block',
			whiteSpace: 'pre',
			margin: '0',
			padding: '0',

			fontFamily: 'monospace',
		},
		expandedStack: {
			// whiteSpace: 'pre',
		},
		resetButton: {
			display: 'block',
			margin: '10px 0',
			fontWeight: 'normal',

			// position: 'static',
			// margin: '0 0 0 0',
			// padding: '0',
			// fontSize: '10px',
			// lineHeight: '1.2em',
			// fontFamily: 'Roboto, sans-serif',
			// fontWeight: 600,
			// width: '100%',
			// height: 'auto',
			// overflow: 'visible',
			// background: 'white',
			// textDecoration: 'underline',
			// color: 'red',
			// border: 'none',
			// cursor: 'pointer',
		},
	}

	constructor(props) {
		super(props)
		this.state = {
			error: null,
		}
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		this.setState({
			error: { error, info },
		})
	}

	// toggleComponentStack = () => {
	// 	this.setState({ expandedComponentStack: !this.state.expandedComponentStack })
	// }

	// toggleStack = () => {
	// 	this.setState({ expandedStack: !this.state.expandedStack })
	// }

	resetComponent = () => {
		this.setState({ error: null })
	}

	render() {
		if (this.state.error) {
			const error = this.state.error.error
			const info = this.state.error.info
			return (
				<div style={ErrorBoundary.style.container}>
					<h1 style={ErrorBoundary.style.h1}>Whoops, something went wrong!</h1>

					<div style={ErrorBoundary.style.friendlyMessage}>
						There was an error in the Sofie GUI which caused it to crash.
						<br />
						Please copy the error description below and report it to your system administrator.
						<br />
						<button style={ErrorBoundary.style.resetButton} onClick={this.resetComponent}>
							Click here to try to restart component
						</button>
					</div>

					<div style={ErrorBoundary.style.errorDescription}>
						<b>{error.name}</b>
						<br />
						<p style={ErrorBoundary.style.stack}>{error.message}</p>
						<p style={ErrorBoundary.style.stack}>{error.stack ?? ''}</p>
						<p style={ErrorBoundary.style.stack}>{info.componentStack}</p>
					</div>
				</div>
			)
		} else {
			return this.props.children || null
		}
	}
}
