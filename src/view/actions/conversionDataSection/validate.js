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

/* eslint-disable camelcase */

import parseJson from '../../utils/parseJson';
import { isDataElementToken, isArray, isObject } from '../../utils/validators';
import checkRequired from '../../utils/checkRequired';

export default ({
  contentsJsonPairs = [],
  contentsType,
  contentsRaw,
  conversion_time,
  event_id,
  number_items,
  value
}) => {
  const errors = {};

  if (contentsType === 'raw') {
    if (contentsRaw && !isDataElementToken(contentsRaw)) {
      const { message = '', parsedJson } = parseJson(contentsRaw);
      if (message || !isArray(parsedJson)) {
        errors.contentsRaw = `Please provide a valid JSON object or an array containing objects.${
          message ? ` ${message}.` : ''
        }`;
      } else if (parsedJson.length === 0) {
        errors.contentsRaw =
          'The contents array must contain at least an element.';
      } else if (parsedJson.filter((i) => isObject(i)).length === 0) {
        errors.contentsRaw = 'The elements of the array must be objects.';
      } else if (
        parsedJson.filter((i) => Object.keys(i).length > 0).length === 0
      ) {
        errors.contentsRaw = 'The objects inside the array must contain keys.';
      }
    }
  } else {
    contentsJsonPairs.forEach((q, index) => {
      if (!q.key && q.value) {
        errors[`contentsJsonPairs.${index}.key`] = 'Please provide a key name.';
      }

      if (q.key && !q.value) {
        errors[`contentsJsonPairs.${index}.value`] = 'Please provide a value.';
      }
    });
  }

  [
    ['conversion_time', conversion_time, 'a conversion time'],
    ['event_id', event_id, 'an event id']
  ].forEach(([k, v, errorVariableDescription]) => {
    checkRequired(k, v, errorVariableDescription || `a ${k}`, errors);
  });

  [
    ['number_items', number_items],
    ['value', value]
  ].forEach(([k, v]) => {
    if (v && !isDataElementToken(v)) {
      const numberValue = Number(v);
      if (Number.isNaN(numberValue)) {
        errors[k] =
          'The value of this field must be a number or a data element.';
      }
    }
  });

  return errors;
};
