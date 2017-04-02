import ModelInterface from './interface';

import { get, isArray, isFunction, isObject } from 'lodash';

const _relations = Symbol('relations');

/**
 * Relation manager class for models
 */
class RelationManager {
	/**
	 *
	 */
	constructor () {
		this[_relations] = {};
	}

	/**
	 * Set a relation between entities
	 *
	 * @param {string} 			localKey    Own relation key
	 * @param {string|function} [remoteKey] Remote relation key
	 *
	 * @return {Model} The current model
	 */
	setRelation (localKey, remoteKey) {
		let remote = remoteKey;

		if (!isFunction(remote)) {
			remote = () => remoteKey;
		}

		this[_relations][localKey] = remote;

		return this;
	}

	/**
	 * Retreive the relations of a model
	 *
	 * @param {Model|Proxy} model The managed model or its proxy
	 *
	 * @return {RelationManager|undefined} The metadata manager if exists
	 */
	static getRelations (model) {
		let relations;

		if (isFunction(model) || isObject(model)) {
			if (model instanceof ModelInterface) {
				model = model.constructor;
			}

			if (model.prototype instanceof ModelInterface) {
				if (!model[_relations] || (model[_relations] ===  Object.getPrototypeOf(model)[_relations])) {
					model[_relations] = new RelationManager();
				}

				relations = model[_relations];
			}
		}

		return relations;
	}
}

ModelInterface.emitter.on('change', (model, key) => {
	const relations = RelationManager.getRelations(model)[_relations];
	const remote = get(model, key);
	const relation = relations[key[0]];
	const remoteKey = relation ? relation(remote) : undefined;

	if (remote && remoteKey) {
		if (isArray(remote[remoteKey]))
			remote[remoteKey].push(model);

		remote[remoteKey] = model;
	}
});

export default RelationManager;
