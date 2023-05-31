/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/* eslint-disable camelcase */

const sendWebConversion = require('../sendWebConversion');
const arc = {};

describe('Send Web Conversion library module', () => {
  test('makes a fetch call to the provided url', () => {
    const fetch = jest.fn(() => Promise.resolve({}));

    const extensionSettings = {
      pixelId: 'pixel',
      authentication: {
        consumerKey: 'ckey',
        consumerSecret: 'csecret',
        token: 't',
        tokenSecret: 'tsecret'
      }
    };

    const settings = {
      user_identification: {
        hashed_email: 'email@email.com'
      },
      event: {
        conversion_time: '7979',
        event_id: '7878',
        price_currency: 'eur',
        conversion_id: 'conversionid',
        description: 'asas',
        contents: '{{a}}'
      }
    };

    const utils = {
      fetch: fetch,
      getSettings: () => settings,
      getExtensionSettings: () => extensionSettings
    };

    return sendWebConversion({ arc, utils }).then(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://ads-api.twitter.com/12/measurement/conversions/pixel',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Accept: '*/*'
          }),
          body:
            '{' +
            '"conversions":[' +
            '{' +
            '"conversion_time":"7979",' +
            '"event_id":"7878",' +
            '"price_currency":"eur",' +
            '"conversion_id":"conversionid",' +
            '"description":"asas",' +
            '"contents":"{{a}}",' +
            '"identifiers":[{' +
            '"hashed_email":"f3273dd18d95bc19d51d3e6356e4a679e6f13824497272a270e7bb540b0abb9d"' +
            '}' +
            ']' +
            '}' +
            ']' +
            '}'
        })
      );
    });
  });

  test('throws an error when a hashable value is not string or a number', async () => {
    const fetch = jest.fn(() => Promise.resolve({}));

    const extensionSettings = {
      adAccountId: 'ID123',
      conversionAccessToken: 'token'
    };

    const settings = {
      user_identification: {
        hashed_email: { a: 'email@email.com' }
      },
      event: {
        conversion_time: '7979',
        event_id: '7878',
        price_currency: 'eur',
        conversion_id: 'conversionid',
        description: 'asas',
        contents: '{{a}}'
      }
    };

    const utils = {
      fetch: fetch,
      getSettings: () => settings,
      getExtensionSettings: () => extensionSettings
    };
    try {
      await sendWebConversion({ arc, utils });
    } catch (e) {
      expect(e.message).toBe(
        'The value of the "Email" field is not a string or a number. ' +
          'Cannot generate a SHA-256 string.'
      );
    }
  });
});
