import Spackle from '../Spackle'
import { SpackleSession } from './DynamoDBStore'
import {
  AssumeRoleWithWebIdentityCommand,
  STSClient,
} from '@aws-sdk/client-sts'
import { AwsCredentialIdentityProvider } from '@aws-sdk/types'
import { CredentialsProviderError } from '@aws-sdk/property-provider'
import crypto from 'crypto'
import fetch from 'node-fetch'

export async function createSession(spackle: Spackle): Promise<SpackleSession> {
  const url = `${spackle.apiBase}/sessions`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${spackle.apiKey}`,
    },
  })

  if (!response.ok) {
    throw new Error(`spackle: session not created status: (${response.status})`)
  }

  return await response.json()
}

export const fromSpackleCredentials = (
  spackle: Spackle,
  session: any,
  setSession: (s: any) => void,
): AwsCredentialIdentityProvider => {
  async function spackleCredentials() {
    if (!session) {
      session = await createSession(spackle)
      setSession(session)
    }

    const sts = new STSClient({
      region: session.adapter.region,
    })

    const { Credentials } = await sts.send(
      new AssumeRoleWithWebIdentityCommand({
        RoleArn: session.adapter.role_arn,
        RoleSessionName: crypto.randomBytes(16).toString('hex'),
        WebIdentityToken: session.adapter.token,
      }),
    )

    if (
      !Credentials ||
      !Credentials.AccessKeyId ||
      !Credentials.SecretAccessKey
    ) {
      throw new CredentialsProviderError('Credentials not found')
    }

    return {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretAccessKey,
      sessionToken: Credentials.SessionToken,
      expiration: Credentials.Expiration,
    }
  }

  return spackleCredentials
}
