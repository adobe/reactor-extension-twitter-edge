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
import React from 'react';

import { Content, Link, Text } from '@adobe/react-spectrum';
import ExtensionView from '../components/extensionView';

import UserIdentificationFields from './userIdentificationSection/fields';
import getUserIdentificationInitValues from './userIdentificationSection/getInitValues';
import getUserIdentificationSettings from './userIdentificationSection/getSettings';
import validateUserIdentificationFields from './userIdentificationSection/validate';

import ConversionDataFields from './conversionDataSection/fields';
import getEventDataInitValues from './conversionDataSection/getInitValues';
import getEventDataSettings from './conversionDataSection/getSettings';
import validateEventDataFields from './conversionDataSection/validate';

export default function SendEvent() {
  return (
    <ExtensionView
      getInitialValues={({ initInfo }) => ({
        ...getUserIdentificationInitValues(initInfo),
        ...getEventDataInitValues(initInfo)
      })}
      getSettings={({ values }) => ({
        ...getUserIdentificationSettings(values),
        ...getEventDataSettings(values)
      })}
      validate={(values) => ({
        ...validateUserIdentificationFields(values),
        ...validateEventDataFields(values)
      })}
      render={() => (
        <>
          <Content>
            <Text>These events will be sent to Twitter using the</Text>{' '}
            <Link>
              <a
                href="https://developer.twitter.com/en/docs/twitter-ads-api/measurement/web-conversions/api-reference/conversions"
                target="_blank"
                rel="noreferrer"
              >
                Web Conversions
              </a>
            </Link>{' '}
            endpoint.
          </Content>
          <UserIdentificationFields />
          <ConversionDataFields />
        </>
      )}
    />
  );
}
