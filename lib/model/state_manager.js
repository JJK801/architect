import ModelInterface from './interface';

import { clone, isString, map, reduce, toPath, includes } from 'lodash';

const _model   = Symbol('model');
const _proxy   = Symbol('proxy');
const _state   = Symbol('state');
const _changes = Symbol('changes');

const STATE = {
	'NEW':      1,
	'MODIFIED': 2,
	'DELETED':  4
};

/**
 * Resolve the state bitmask from string notation
 *
 * @param {string|number} mask The bitmask to resolve
 *
 * @return {number} The resolved mask
 */
function resolveState (mask) {
	if (isString(mask)) {
		mask =  reduce(
					map(
						mask.split('|'),
						(stateName) => STATE[stateName.toUpperCase()]
					),
					(mask, state) => state ? mask | state : mask,
					0
				);
	}

	return mask;
}

/**
 * State Manager for models
 */
class StateManager
{
	/**
	 * @param {Model} model The model to manage
	 */
	constructor (model) {
		this[_model] = model;

		this.init();
	}

	/**
	 * (Re-)Init the state
	 *
	 * @return {StateManager} The current state manager
	 */
	init () {
		this[_state] = 0;
		this[_changes] = [];

		return this;
	}

	/**
	 * Set the state mask
	 *
	 * @param {string|number} mask The new state bitmask
	 *
	 * @return {StateManager} The current state manager
	 */
	set (mask) {
		this[_state] = resolveState(mask);

		return this;
	}

	/**
	 * Add a new state to the state mask
	 *
	 * @param {string|number} mask The new state to add to the mask
	 *
	 * @return {StateManager} The current state manager
	 */
	add (mask) {
		this[_state] |= resolveState(mask);

		return this;
	}

	/**
	 * Remove a state from the state mask
	 *
	 * @param {string|number} mask The new state to remove from the mask
	 *
	 * @return {StateManager} The current state manager
	 */
	remove (mask) {
		this[_state] &= ~resolveState(mask);

		return this;
	}

	/**
	 * Compare the current state to a desired state
	 *
	 * @param {string|number} mask The desired state mask
	 *
	 * @return {StateManager} The current state manager
	 */
	is (mask) {
		mask = resolveState(mask);

		return ((this[_state] & mask) === mask);
	}

	/**
	 * Retreive the state of a model
	 *
	 * @param {Model|Proxy} model The managed model or its proxy
	 *
	 * @return {StateManager|undefined} The state manager if exists
	 */
	static getState (model) {
		return model && model[_state];
	}

	/**
	 * List possible states
	 *
	 * @type {object}
	 */
	static get STATE () {
		return clone(STATE);
	}
}

ModelInterface.emitter.on('instanciate.before', (model) => {
	model[_state] = new StateManager(model);
	model[_state].set(STATE.NEW);
});
ModelInterface.emitter.on('load', (model) => model[_state].init());
ModelInterface.emitter.on('proxify', ({ proxy: model }) => {
	model[_state][_proxy] = model;
});
ModelInterface.emitter.on('change', (model, k) => {
	model[_state].add(STATE.MODIFIED);

	const key = toPath(k).join('.');

	if (!includes(model[_state][_changes], key))
		model[_state][_changes].push(key);
});

export default StateManager;
