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

const {
  emailNormalizer,
  phoneNumberNormalizer
} = require('./helpers/normalizers');

const getAuthorizationToken = require('./helpers/getAuthorizationToken');

/* eslint-disable camelcase */

const buildFetchObject = async ({
  settings: { event, user_identification },
  authentication,
  url,
  method
}) => {
  const normalizers = [
    ['hashed_email', emailNormalizer],
    ['hashed_phone_number', phoneNumberNormalizer]
  ];

  for await (const [field, normalizer] of normalizers) {
    if (user_identification[field]) {
      user_identification[field] = await normalizer(user_identification[field]);
    }
  }

  event.identifiers = Object.keys(user_identification).map((k) => ({
    [k]: user_identification[k]
  }));

  const body = event;

  return {
    method,
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
      Authorization: await getAuthorizationToken(authentication, url, method)
    },
    body: JSON.stringify({ conversions: [body] })
  };
};

const buildUrl = (pixelId) =>
  `https://ads-api.twitter.com/12/measurement/conversions/${pixelId}`;

module.exports = async ({ utils }) => {
  const { getExtensionSettings, getSettings, fetch } = utils;
  const { pixelId, authentication } = getExtensionSettings();
  const settings = getSettings();

  const url = buildUrl(pixelId);
  const method = 'POST';

  return fetch(
    url,
    await buildFetchObject({
      method,
      settings,
      authentication,
      url
    })
  );
};
