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

import checkRequired from '../../utils/checkRequired';

export default ({
  pixelId,
  authentication: { consumerKey, consumerSecret, token, tokenSecret }
}) => {
  const errors = {};

  [
    ['pixelId', pixelId, 'a pixel ID'],
    ['authentication.consumerKey', consumerKey, 'a consumer key'],
    ['authentication.consumerSecret', consumerSecret, 'a consumer secret'],
    ['authentication.token', token, 'a token'],
    ['authentication.tokenSecret', tokenSecret, 'a token secret']
  ].forEach(([key, value, errorVariableDescription]) => {
    checkRequired(key, value, errorVariableDescription || `a ${key}`, errors);
  });

  return errors;
};
