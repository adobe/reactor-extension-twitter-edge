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

import Configuration from '../configuration';
import createExtensionBridge from '../../__tests_helpers__/createExtensionBridge';

import { changeInputValue } from '../../__tests_helpers__/jsDomHelpers';

let extensionBridge;

beforeEach(() => {
  extensionBridge = createExtensionBridge();
  window.extensionBridge = extensionBridge;
});

afterEach(() => {
  delete window.extensionBridge;
});

const getFromFields = () => ({
  pixelIdInput: screen.getByLabelText(/pixel id/i),
  consumerKeyInput: screen.getByLabelText(/consumer key/i),
  consumerSecretInput: screen.getByLabelText(/consumer secret/i),
  tokenInput: screen.getByLabelText(/token/i, {
    selector: '[name="authentication.token"]'
  }),
  tokenSecretInput: screen.getByLabelText(/token secret/i)
});

describe('Configuration view', () => {
  test('sets form values from settings', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        pixelId: 'a',
        authentication: {
          consumerKey: 'b',
          consumerSecret: 'c',
          token: 'd',
          tokenSecret: 'e'
        }
      }
    });

    const {
      pixelIdInput,
      consumerKeyInput,
      consumerSecretInput,
      tokenInput,
      tokenSecretInput
    } = getFromFields();

    expect(pixelIdInput.value).toBe('a');
    expect(consumerKeyInput.value).toBe('b');
    expect(consumerSecretInput.value).toBe('c');
    expect(tokenInput.value).toBe('d');
    expect(tokenSecretInput.value).toBe('e');
  });

  test('sets settings from form values', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        pixelId: 'a',
        authentication: {
          consumerKey: 'b',
          consumerSecret: 'c',
          token: 'd',
          tokenSecret: 'e'
        }
      }
    });

    const {
      pixelIdInput,
      consumerKeyInput,
      consumerSecretInput,
      tokenInput,
      tokenSecretInput
    } = getFromFields();

    await changeInputValue(pixelIdInput, 'a1');
    await changeInputValue(consumerKeyInput, 'b1');
    await changeInputValue(consumerSecretInput, 'c1');
    await changeInputValue(tokenInput, 'd1');
    await changeInputValue(tokenSecretInput, 'e1');

    expect(extensionBridge.getSettings()).toEqual({
      pixelId: 'a1',
      authentication: {
        consumerKey: 'b1',
        consumerSecret: 'c1',
        token: 'd1',
        tokenSecret: 'e1'
      }
    });
  });

  test('handles form validation correctly', async () => {
    renderView(Configuration);

    extensionBridge.init({
      settings: {
        pixelId: 'a',
        authentication: {
          consumerKey: 'b',
          consumerSecret: 'c',
          token: 'd',
          tokenSecret: 'e'
        }
      }
    });

    const {
      pixelIdInput,
      consumerKeyInput,
      consumerSecretInput,
      tokenInput,
      tokenSecretInput
    } = getFromFields();

    expect(pixelIdInput).not.toHaveAttribute('aria-invalid');
    expect(consumerKeyInput).not.toHaveAttribute('aria-invalid');
    expect(consumerSecretInput).not.toHaveAttribute('aria-invalid');
    expect(tokenInput).not.toHaveAttribute('aria-invalid');
    expect(tokenSecretInput).not.toHaveAttribute('aria-invalid');

    await changeInputValue(pixelIdInput, '');
    await changeInputValue(consumerKeyInput, '');
    await changeInputValue(consumerSecretInput, '');
    await changeInputValue(tokenInput, '');
    await changeInputValue(tokenSecretInput, '');

    await extensionBridge.validate();

    expect(pixelIdInput).toHaveAttribute('aria-invalid', 'true');
    expect(consumerKeyInput).toHaveAttribute('aria-invalid');
    expect(consumerSecretInput).toHaveAttribute('aria-invalid');
    expect(tokenInput).toHaveAttribute('aria-invalid');
    expect(tokenSecretInput).toHaveAttribute('aria-invalid');
  });
});
