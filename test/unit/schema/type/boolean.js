import { expect } from 'chai';
import test from 'ava';

import SchemaType from '../../../../lib/schema/type/abstract';
import BooleanSchemaType from '../../../../lib/schema/type/boolean';

test('Should extends SchemaType', () => expect(BooleanSchemaType.prototype).to.be.instanceof(SchemaType));

const createEmpty   = () => { new BooleanSchemaType(); };

test('Should instanciate without a descriptor', () => expect(createEmpty).to.not.throw());
