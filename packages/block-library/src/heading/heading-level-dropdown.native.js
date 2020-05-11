/**
 * External dependencies
 */
import { range } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { ToolbarGroup } from '@wordpress/components';

/**
 * Internal dependencies
 */
import HeadingLevelIcon from './heading-level-icon';

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

/** @typedef {import('@wordpress/element').WPComponent} WPComponent */

/**
 * HeadingLevelDropdown props.
 *
 * @typedef WPHeadingLevelDropdownProps
 *
 * @property {number}                 selectedLevel The chosen heading level.
 * @property {(newValue:number)=>any} onChange      Callback to run when
 *                                                  toolbar value is changed.
 */

/**
 * Dropdown for selecting a heading level (1 through 6).
 *
 * @param {WPHeadingLevelDropdownProps} props Component props.
 *
 * @return {WPComponent} The toolbar.
 */
export default function HeadingLevelDropdown({ selectedLevel, onChange }) {
	
	const createLevelControl = ( targetLevel, selectedLevel, onChange ) => {
		const isActive = targetLevel === selectedLevel;
		return {
			icon: (
				<HeadingLevelIcon
					level={ targetLevel }
					isPressed={ isActive }
				/>
			),
			// translators: %s: heading level e.g: "1", "2", "3"
			title: sprintf( __( 'Heading %d' ), targetLevel ),
			isActive,
			onClick: () => onChange( targetLevel ),
		};
	}

	return (
		<ToolbarGroup
			isCollapsed={ true }
			icon={ <HeadingLevelIcon level={ selectedLevel } /> }
			controls={ HEADING_LEVELS.map( ( index ) =>
				createLevelControl( index, selectedLevel, onChange )
			) }
			label={ __( 'Change heading level' ) }
		/>
	);	
}