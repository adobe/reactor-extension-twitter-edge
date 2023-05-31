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
  Badge,
  Content,
  Heading,
  Link,
  Text,
  View
} from '@adobe/react-spectrum';
import Alert from '@spectrum-icons/workflow/Alert';
import WrappedTextField from '../../components/wrappedTextField';

export default function ServerEventParametersFields() {
  return (
    <View>
      <Heading level="3">User Identification</Heading>

      <Content marginBottom="size-150">
        <Text>
          For tying the event to an user you need to fill in either the
          &rsquo;Twitter Click ID&rsquo; , or the &rsquo;Email&rsquo; or the
          &rsquo;Phone&rsquo; fields.
        </Text>
      </Content>

      <WrappedTextField
        name="user_identification.twclid"
        width="size-4600"
        label="Twitter Click ID"
        description="Twitter Click ID as parsed from the click-through URL."
        supportDataElement
      />

      <WrappedTextField
        name="user_identification.hashed_email"
        width="size-4600"
        label="Email"
        supportDataElement
      />

      <WrappedTextField
        name="user_identification.hashed_phone_number"
        width="size-4600"
        label="Phone"
        description={
          <span>
            A phone number with{' '}
            <Link>
              <a
                href="https://en.wikipedia.org/wiki/E.164"
                rel="noreferrer"
                target="_blank"
              >
                E164
              </a>
            </Link>{' '}
            format.
          </span>
        }
        supportDataElement
      />

      <Badge variant="info" marginTop="size-100">
        <Alert aria-label="Information about field hashing" />
        <Text>
          Before sending the data to the Twitter API endpoint, the extension
          will hash and normalize the values of the following fields: Email, and
          Phone.
          <br />
          The extension will not hash the value of these fields if a SHA256
          string is already present.
        </Text>
      </Badge>
    </View>
  );
}
