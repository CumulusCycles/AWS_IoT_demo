/*
 * Copyright 2015-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

// Set the 3 following attributes depending on your environment
// poolId: Your Cognito Identity Pool ID, e.g. 'us-east-1:12345678-1234-1234-1234-123456789012'
// endpoint: Your AWS IoT Endpoint, e.g. 'prefix-ats.iot.region.amazonaws.com'
// region: The AWS Region you are working in, e.g. 'us-east-1'
var AWSConfiguration = {
   poolId: 'YOUR_COGNITO_POOL_ID',
   endpoint: 'YOUR_ENDPOONT',
   region: 'YOUR_REGION'
};
