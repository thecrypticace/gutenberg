/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';

const { name } = metadata;
export { metadata, name };

export const settings = {
	title: __( 'Widget Area' ),
	description: __( 'A widget area container.' ),
	supports: {
		html: false,
		inserter: false,
		customClassName: false,
	},
	__experimentalLabel: ( { name: label } ) => label,
	edit,
};
