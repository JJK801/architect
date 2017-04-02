import { expect } from 'chai';
import test from 'ava';

import SchemaType from '../../../../lib/schema/type/abstract';
import Type from '../../../../lib/schema/type';

const AlternativesSchemaType = Type.Types.alternatives;

test('Should extends SchemaType', () => expect(AlternativesSchemaType.prototype).to.be.instanceof(SchemaType));

const createEmpty   = () => { new AlternativesSchemaType(); };

test('Should instanciate without a descriptor', () => expect(createEmpty).to.not.throw());

test('Should allow defined types only', () => {
	const oneOf = new AlternativesSchemaType({ try: ['string', 'boolean'] });

	expect(oneOf.cast('bla')).to.equal('bla');
	expect(oneOf.cast(true)).to.equal(true);
	expect(() => oneOf.cast(new Date())).to.throw(Error);
});
