/**
 * External dependencies
 */
import { some, groupBy } from 'lodash';

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useCallback } from '@wordpress/element';
import { close as closeIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import EntityTypeList from './entity-type-list';

export default function EntitiesSavedStates( { isOpen, close } ) {
	const { dirtyEntityRecords } = useSelect( ( select ) => {
		return {
			dirtyEntityRecords: select(
				'core'
			).__experimentalGetDirtyEntityRecords(),
		};
	}, [] );
	const { saveEditedEntityRecord } = useDispatch( 'core' );

	// To group entities by type.
	const partitionedSavables = Object.values(
		groupBy( dirtyEntityRecords, 'name' )
	);

	// Unchecked entities to be ignored by save function.
	const [ unselectedEntities, _setUnselectedEntities ] = useState( [] );

	const setUnselectedEntities = ( { kind, name, key }, checked ) => {
		if ( checked ) {
			_setUnselectedEntities(
				unselectedEntities.filter(
					( elt ) =>
						elt.kind !== kind ||
						elt.name !== name ||
						elt.key !== key
				)
			);
		} else {
			_setUnselectedEntities( [
				...unselectedEntities,
				{ kind, name, key },
			] );
		}
	};

	const saveCheckedEntities = () => {
		const entitiesToSave = dirtyEntityRecords.filter(
			( { kind, name, key } ) => {
				return ! some(
					unselectedEntities,
					( elt ) =>
						elt.kind === kind &&
						elt.name === name &&
						elt.key === key
				);
			}
		);

		entitiesToSave.forEach( ( { kind, name, key } ) => {
			saveEditedEntityRecord( kind, name, key );
		} );

		close( entitiesToSave );
	};

	const [ isReviewing, setIsReviewing ] = useState( false );
	const toggleIsReviewing = useCallback(
		() => setIsReviewing( ! isReviewing ),
		[ isReviewing ]
	);

	// Explicitly define this with no argument passed.  Using `close` on
	// its own will use the event object in place of the expected saved entities.
	const dismissPanel = useCallback( () => close(), [ close ] );

	return isOpen ? (
		<div className="entities-saved-states__panel">
			<div className="entities-saved-states__panel-header">
				<Button
					isPrimary
					disabled={
						dirtyEntityRecords.length -
							unselectedEntities.length ===
						0
					}
					onClick={ saveCheckedEntities }
					className="editor-entities-saved-states__save-button"
				>
					{ __( 'Save' ) }
				</Button>
				<Button
					onClick={ dismissPanel }
					icon={ closeIcon }
					label={ __( 'Close panel' ) }
				/>
			</div>

			<div className="entities-saved-states__text-prompt">
				<strong>{ __( 'Are you ready to save?' ) }</strong>
				<p>
					{ __(
						'Changes were made to this template, its content, and the contents of the page.'
					) }
				</p>
				<p>
					<Button
						onClick={ toggleIsReviewing }
						isLink
						className="entities-saved-states__review-changes-button"
					>
						{ isReviewing
							? __( 'Hide changes.' )
							: __( 'Review changes.' ) }
					</Button>
				</p>
			</div>

			{ isReviewing &&
				partitionedSavables.map( ( list ) => {
					return (
						<EntityTypeList
							key={ list[ 0 ].name }
							list={ list }
							closePanel={ dismissPanel }
							unselectedEntities={ unselectedEntities }
							setUnselectedEntities={ setUnselectedEntities }
						/>
					);
				} ) }
		</div>
	) : null;
}
