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

import { addToEntityFromVariables } from '../../utils/entityVariablesConverter';
import { isDataElementToken } from '../../utils/validators';

export default ({ contentsType, contentsRaw, contentsJsonPairs, ...rest }) => {
  let data;
  const settings = {};

  [
    'conversion_time',
    'event_id',
    'number_items',
    'price_currency',
    'value',
    'conversion_id',
    'description'
  ].forEach((k) => {
    if (rest[k]) {
      if (!settings.event) {
        settings.event = {};
      }

      settings.event[k] = rest[k];

      if (['number_items', 'value'].includes(k)) {
        let v = settings.event[k];
        v = isDataElementToken(v) ? v : Number(v);
        settings.event[k] = v;
      }
    }
  });

  if (contentsType === 'json') {
    data = addToEntityFromVariables(
      {},
      contentsJsonPairs.filter((p) => p.key || p.value)
    );

    if (Object.keys(data).length === 0) {
      data = null;
    }
  } else {
    try {
      data = JSON.parse(contentsRaw);
    } catch {
      data = contentsRaw;
    }
  }
  if (data) {
    if (!settings.event) {
      settings.event = {};
    }
    settings.event.contents = data;
  }

  return settings;
};
