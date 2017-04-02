import { assign } from 'lodash';

import ModelInterface  from './interface';

import StateManager from './state_manager';
import MetadataManager from './metadata_manager';
import RelationManager from './relation_manager';

/**
 * Base Model class
 */
class Model extends ModelInterface {
	/**
	 * @inheritDoc
	 */
	static load (data = {}, instance) {
		if (!(instance instanceof this)) {
			instance = new this(data);
		} else {
			assign(instance, data);
		}

		return super.load(data, instance);
	}

	/**
	 * Get a registered model class by it name (with namespace), class, or instance
	 *
	 * @param {Class|Model|string} name The model identifier
	 *
	 * @return {Model|undefined} The model class if exists
	 */
	static get (name) {
		const metadata = MetadataManager.getMetadata(name);

		return metadata ? metadata.model : metadata;
	}
}

export default Model;
export {
	StateManager,
	MetadataManager,
	RelationManager
};
