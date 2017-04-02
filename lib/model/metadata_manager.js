import ModelInterface from './interface';
import Schema from '../schema';

import { isFunction, isObject, isString, compact } from 'lodash';

const instances = {};

const _metadata  = Symbol('metadata');
const _model     = Symbol('model');
const _schema    = Symbol('schema');
const _namespace = Symbol('namespace');

/**
 * Metadata manager class for Models
 */
class MetadataManager {
	/**
	 * Namespace of the model
	 *
	 * @type {string|undefined}
	 */
	get namespace () {
		return this[_namespace];
	}

	/**
	 * Validation schema of the model
	 *
	 * @type {Schema|undefined}
	 */
	get schema () {
		if (isFunction(this[_schema])) {
			this[_schema] = this[_schema]();
		}

		if (isObject(this[_schema])) {
			if (!(this[_schema] instanceof Schema)) {
				this[_schema] = new Schema(this[_schema]);
			}
		} else {
			this[_schema] = new Schema();
		}

		return this[_schema];
	}

	/**
	 * Full name of the model (including namespace)
	 *
	 * @type {string}
	 */
	get name () {
		return compact([this.namespace, this[_model].name]).join('/');
	}

	/**
	 * Handled model
	 *
	 * @type {Model}
	 */
	get model () {
		return this[_model];
	}

	/**
	 * @param {Model}  model       The handled model
	 * @param {Schema} [schema]    The validation schema
	 * @param {string} [namespace] The model's namespace
	 *
	 */
	constructor(model, schema, namespace) {
		this[_model]     = model;
		this[_schema]    = schema;
		this[_namespace] = namespace;

		instances[this.name] = this;
	}

	/**
	 * Register a model
	 *
 	 * @param {Model}  model       The handled model
 	 * @param {Schema} [schema]    The validation schema
 	 * @param {string} [namespace] The model's namespace
	 *
	 * @return {MetadataManager} The model's metadata manager
	 */
	static register(model, schema, namespace) {
		model[_metadata] = new MetadataManager(model, schema, namespace);

		return model[_metadata];
	}

	/**
	 * Retreive the metadata of a model
	 *
	 * @param {Model|Proxy} model The managed model or its proxy
	 *
	 * @return {MetadataManager|undefined} The metadata manager if exists
	 */
	static getMetadata (model) {
		let metadata;

		if (isString(model)) {
			metadata = instances[model];
		} else if (isFunction(model) || isObject(model)) {
			if (model instanceof ModelInterface) {
				model = model.constructor;
			}

			if (model.prototype instanceof ModelInterface) {
				if (!model[_metadata] || (model[_metadata] ===  Object.getPrototypeOf(model)[_metadata])) {
					MetadataManager.register(model);
				}

				metadata = model[_metadata];
			}
		}

		return metadata;
	}
}


ModelInterface.emitter.on('instanciate', (descriptor) => {
	const { instance } = descriptor;

	descriptor.instance = MetadataManager.getMetadata(descriptor.model).schema.proxify(instance);
});

export default MetadataManager;
