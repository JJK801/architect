import test from 'ava';
import { expect } from 'chai';

import { map } from 'lodash';

import User,    { generate as generateUser }    from '../models/User';
import Address, { generate as generateAddress } from '../models/Address';
import Person,  { generate as generatePerson }  from '../models/Person';
import '../models/Profile';

test('Functional test of relations', () => {
	const userData = generateUser();
	const personData = generatePerson();
	const addressesData = generateAddress(5);
	const addressData = generateAddress();

	const addresses = map([].concat(addressesData), (addressData) => Address.load(addressData));
	const address = Address.load(addressData);
	const user = User.load(userData);
	const person = Person.load(personData);

	user.person = person;
	person.addresses = addresses;
	person.addresses.push(address);

	expect(user.person).to.equal(person);
	expect(person.user).to.equal(user);
});
