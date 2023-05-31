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

/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Heading, View, Link } from '@adobe/react-spectrum';
import getEmptyDataJson from './getEmptyValue';

import WrappedTextField from '../../components/wrappedTextField';
import ContentsEditor from '../../components/rawJsonEditor';
import ContentsRow from './row';

import {
  addToVariablesFromEntity,
  addToEntityFromVariables
} from '../../utils/entityVariablesConverter';

export default function ConversionDataSectionFields() {
  const { setValue, watch } = useFormContext();
  const [contentsRaw, contentsJsonPairs] = watch([
    'contentsRaw',
    'contentsJsonPairs'
  ]);

  return (
    <View>
      <Heading level="3">Conversion Data</Heading>

      <WrappedTextField
        name="conversion_time"
        width="size-4600"
        label="Conversion Time"
        necessityIndicator="label"
        isRequired
        description={
          <span>
            Date as a string in{' '}
            <Link>
              <a
                href="https://en.wikipedia.org/wiki/ISO_8601"
                rel="noreferrer"
                target="_blank"
              >
                ISO 8601
              </a>
            </Link>{' '}
            format.
          </span>
        }
        supportDataElement
      />

      <WrappedTextField
        name="event_id"
        width="size-4600"
        label="Event ID"
        necessityIndicator="label"
        isRequired
        description={
          'The base-36 ID of a specific event. It matches a pre-configured event contained ' +
          'within this ad account. This is called ID in the corresponding event in Events Manager.'
        }
        supportDataElement
      />

      <WrappedTextField
        name="number_items"
        width="size-4600"
        label="Number of Items"
        description="A positive number greater than zero or a data element."
        supportDataElement
      />

      <WrappedTextField
        name="price_currency"
        width="size-4600"
        label="Currency"
        description={
          <span>
            Currency as a string in{' '}
            <Link>
              <a
                href="https://en.wikipedia.org/wiki/ISO_4217"
                rel="noreferrer"
                target="_blank"
              >
                ISO-4217
              </a>
            </Link>{' '}
            format.
          </span>
        }
        supportDataElement
      />

      <WrappedTextField
        name="value"
        width="size-4600"
        label="Value"
        supportDataElement
      />

      <WrappedTextField
        name="conversion_id"
        width="size-4600"
        label="Conversion ID"
        description={
          'An identifier for a conversion event that can be used for de-duplication between ' +
          'Web Pixel and Conversion API conversions.'
        }
        supportDataElement
      />

      <WrappedTextField
        name="description"
        width="size-4600"
        label="Description"
        supportDataElement
      />

      <ContentsEditor
        label="Contents"
        radioLabel="Select the way you want to provide the contents object"
        description={
          <span>
            List of details relating to a specific product/content to provide
            granular information. It must be a valid JSON array or a data
            element. The elements of the array must be objects containing the
            following properties: content_id, content_group_id, content_name,
            content_price, content_type, num_items. Find more about{' '}
            <Link>
              <a
                href="https://developer.twitter.com/en/docs/twitter-ads-api/measurement/web-conversions/api-reference/conversions#contents-object"
                rel="noreferrer"
                target="_blank"
              >
                contents objects
              </a>
            </Link>{' '}
            .
          </span>
        }
        typeVariable="contentsType"
        rawVariable="contentsRaw"
        jsonVariable="contentsJsonPairs"
        getEmptyJsonValueFn={getEmptyDataJson}
        row={ContentsRow}
        onTypeSwitch={(v) => {
          // Auto Update Data Content
          if (v === 'json') {
            let variables = [];
            try {
              variables = addToVariablesFromEntity([], JSON.parse(contentsRaw));
            } catch (e) {
              // Don't do anything
            }

            if (variables.length === 0) {
              variables.push(getEmptyDataJson());
            }

            setValue('contentsJsonPairs', variables, {
              shouldValidate: true,
              shouldDirty: true
            });
          } else if (contentsJsonPairs.length > 1 || contentsJsonPairs[0].key) {
            let entity = JSON.stringify(
              addToEntityFromVariables([], contentsJsonPairs),
              null,
              2
            );

            if (entity === '{}') {
              entity = '';
            }

            setValue('contentsRaw', entity, {
              shouldValidate: true,
              shouldDirty: true
            });
          }
          // END: Auto Update Data Content
        }}
      />
    </View>
  );
}
