/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { screen } from '@testing-library/react';
import renderView from '../../__tests_helpers__/renderView';

import SendWebConversion from '../sendWebConversion';
import createExtensionBridge from '../../__tests_helpers__/createExtensionBridge';

import {
  changeInputValue,
  changeComboboxValue
} from '../../__tests_helpers__/jsDomHelpers';

let extensionBridge;

beforeEach(() => {
  extensionBridge = createExtensionBridge();
  window.extensionBridge = extensionBridge;
});

afterEach(() => {
  delete window.extensionBridge;
});

const getFormFields = () => ({
  twclidInput: screen.getByLabelText(/twitter click id/i),
  emailInput: screen.getByLabelText(/email/i),
  phoneInput: screen.getByLabelText(/phone/i),
  conversionTimeInput: screen.getByLabelText(/conversion time/i),
  eventIdInput: screen.getByLabelText(/event id/i),
  numberOfItemsInput: screen.getByLabelText(/number of items/i),
  currencyInput: screen.getByLabelText(/currency/i),
  valueInput: screen.getByLabelText(/value/i, { selector: '[name="value"]' }),
  conversionIdInput: screen.getByLabelText(/conversion id/i),
  descriptionInput: screen.getByLabelText(/description/i),
  contentsRawTextarea: screen.getByLabelText(/contents raw/i)
});

describe('Send Event view', () => {
  test('sets form values from settings', async () => {
    renderView(SendWebConversion);

    extensionBridge.init({
      settings: {
        user_identification: {
          hashed_phone_number: 'phone',
          hashed_email: 'email',
          twclid: 'twclid'
        },
        event: {
          conversion_time: '123',
          event_id: 'ABC',
          number_items: 5,
          price_currency: 'EUR',
          value: 100,
          conversion_id: 'conversionid',
          description: 'description',
          contents: '{{a}}'
        }
      }
    });

    const {
      twclidInput,
      emailInput,
      phoneInput,
      conversionTimeInput,
      contentsRawTextarea,
      eventIdInput,
      numberOfItemsInput,
      currencyInput,
      valueInput,
      conversionIdInput,
      descriptionInput
    } = getFormFields();

    expect(twclidInput.value).toBe('twclid');
    expect(emailInput.value).toBe('email');
    expect(phoneInput.value).toBe('phone');
    expect(conversionTimeInput.value).toBe('123');
    expect(eventIdInput.value).toBe('ABC');
    expect(numberOfItemsInput.value).toBe('5');
    expect(currencyInput.value).toBe('EUR');
    expect(valueInput.value).toBe('100');
    expect(conversionIdInput.value).toBe('conversionid');
    expect(descriptionInput.value).toBe('description');
    expect(contentsRawTextarea.value).toBe('{{a}}');
  });

  test('sets settings from form values', async () => {
    renderView(SendWebConversion);

    extensionBridge.init();

    const {
      twclidInput,
      emailInput,
      phoneInput,
      conversionTimeInput,
      eventIdInput,
      numberOfItemsInput,
      currencyInput,
      valueInput,
      conversionIdInput,
      descriptionInput,
      contentsRawTextarea
    } = getFormFields();

    await changeComboboxValue(twclidInput, 'twclid');
    await changeComboboxValue(emailInput, 'email');
    await changeInputValue(phoneInput, 'phone');
    await changeInputValue(conversionTimeInput, '123');
    await changeInputValue(eventIdInput, 'ABC');
    await changeInputValue(numberOfItemsInput, '5');
    await changeInputValue(currencyInput, 'EUR');
    await changeInputValue(valueInput, '100');
    await changeInputValue(conversionIdInput, 'conversionid');
    await changeInputValue(descriptionInput, 'description');
    await changeInputValue(contentsRawTextarea, '{{{{a}}');

    expect(extensionBridge.getSettings()).toEqual({
      user_identification: {
        hashed_phone_number: 'phone',
        hashed_email: 'email',
        twclid: 'twclid'
      },
      event: {
        conversion_time: '123',
        event_id: 'ABC',
        number_items: 5,
        price_currency: 'EUR',
        value: 100,
        conversion_id: 'conversionid',
        description: 'description',
        contents: '{{a}}'
      }
    });
  });

  test('handles form validation correctly', async () => {
    renderView(SendWebConversion);

    extensionBridge.init();

    const { twclidInput } = getFormFields();

    await extensionBridge.validate();

    expect(twclidInput).toHaveAttribute('aria-invalid', 'true');
  });
});
