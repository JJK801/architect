import test from 'ava';
import { expect } from 'chai';

import * as root from '../../lib';
import Model from '../../lib/model';
import Schema from '../../lib/schema';

test('Should export model and schema', () => {
	expect(root.Model).to.equal(Model);
	expect(root.Schema).to.equal(Schema);
});
