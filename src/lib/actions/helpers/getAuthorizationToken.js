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
const generateUuid = require('./generateUuid');

const generateSignature = async (signKey, signatureBaseString) => {
  const enc = new TextEncoder('utf-8');
  const algorithm = { name: 'HMAC', hash: 'SHA-1' };

  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(signKey),
    algorithm,
    false,
    ['sign', 'verify']
  );

  const signature = await crypto.subtle.sign(
    algorithm.name,
    key,
    enc.encode(signatureBaseString)
  );

  // I tried to use TextDecoder, but it returns a different result
  // than String.fromCharCode.
  // const digest = new TextDecoder().decode(new Uint8Array(signature));
  const digest = String.fromCharCode(...new Uint8Array(signature));
  const base64Digest = btoa
    ? btoa(digest)
    : Buffer.from(digest, 'binary').toString('base64');
  return encodeURIComponent(base64Digest);
};

module.exports = async (
  { consumerKey, consumerSecret, token, tokenSecret },
  url,
  method
) => {
  const nonce = generateUuid();
  const timestamp = Math.floor(Date.now() / 1000);
  const signKey = consumerSecret + '&' + tokenSecret;

  const authParameter =
    `oauth_consumer_key=${consumerKey}` +
    `&oauth_nonce=${nonce}` +
    '&oauth_signature_method=HMAC-SHA1' +
    `&oauth_timestamp=${timestamp}` +
    `&oauth_token=${token}` +
    '&oauth_version=1.0';

  const encodedAuthParam = `${encodeURIComponent(url)}&${encodeURIComponent(
    authParameter
  )}`;

  const signatureBaseString = `${method}&${encodedAuthParam}`;

  return (
    `OAuth oauth_consumer_key="${consumerKey}", ` +
    `oauth_nonce="${nonce}", ` +
    `oauth_signature="${await generateSignature(
      signKey,
      signatureBaseString
    )}", ` +
    'oauth_signature_method="HMAC-SHA1", ' +
    `oauth_timestamp="${timestamp}", ` +
    `oauth_token="${token}", ` +
    'oauth_version="1.0"'
  );
};
