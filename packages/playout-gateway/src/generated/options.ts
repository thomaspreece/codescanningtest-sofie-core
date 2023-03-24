/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run "yarn generate-schema-types" to regenerate this file.
 */

export interface PlayoutGatewayConfig {
	/**
	 * Activate Debug Logging
	 */
	debugLogging?: boolean
	debugState?: boolean
	/**
	 * Activate Multi-Threading
	 */
	multiThreading?: boolean
	/**
	 * Activate Multi-Threaded Timeline Resolving
	 */
	multiThreadedResolver?: boolean
	/**
	 * Activate Partial resolving, when resolving the Timeline
	 */
	useCacheWhenResolving?: boolean
	/**
	 * Report command timings on all commands
	 */
	reportAllCommands?: boolean
	/**
	 * Adjust resolve-time estimation
	 */
	estimateResolveTimeMultiplier?: boolean
}
