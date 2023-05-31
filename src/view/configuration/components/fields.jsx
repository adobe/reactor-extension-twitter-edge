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
import {
  Content,
  Flex,
  Link,
  ContextualHelp,
  Heading
} from '@adobe/react-spectrum';
import WrappedTextField from '../../components/wrappedTextField';

export default function ConfigurationFields() {
  return (
    <Flex gap="size-150" direction="column">
      <WrappedTextField
        width="size-4600"
        name="pixelId"
        label="Pixel ID"
        necessityIndicator="label"
        isRequired
        supportDataElement
      />

      <Flex alignItems="center" gap="size-75">
        <Heading level="3">Authentication</Heading>

        <ContextualHelp>
          <Heading>Need help?</Heading>
          <Content>
            <p>
              Learn more about how to authenticate via{' '}
              <Link>
                <a
                  href="https://developer.twitter.com/en/docs/authentication/oauth-1-0a"
                  rel="noreferrer"
                  target="_blank"
                >
                  OAuth 1.0a
                </a>
              </Link>
              .
            </p>
          </Content>
        </ContextualHelp>
      </Flex>

      <WrappedTextField
        width="size-4600"
        name="authentication.consumerKey"
        label="Consumer Key"
        necessityIndicator="label"
        isRequired
        supportDataElement
      />
      <WrappedTextField
        width="size-4600"
        name="authentication.consumerSecret"
        label="Consumer Secret"
        necessityIndicator="label"
        isRequired
        supportDataElement
      />
      <WrappedTextField
        width="size-4600"
        name="authentication.token"
        label="Token"
        necessityIndicator="label"
        isRequired
        supportDataElement
      />
      <WrappedTextField
        width="size-4600"
        name="authentication.tokenSecret"
        label="Token Secret"
        necessityIndicator="label"
        isRequired
        supportDataElement
      />
    </Flex>
  );
}
