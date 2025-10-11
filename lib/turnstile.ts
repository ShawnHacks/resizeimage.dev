"use server"

import { env } from "@/env.mjs"

export interface TurnstileVerificationResult {
  success: boolean
  error?: string
  challengeTs?: string
  hostname?: string
}

/**
 * Verify Cloudflare Turnstile token on the server side
 */
export async function verifyTurnstileToken(token: string): Promise<TurnstileVerificationResult> {
  if (!token) {
    return {
      success: false,
      error: "No token provided"
    }
  }

  try {
    const formData = new FormData()
    formData.append('secret', env.TURNSTILE_SECRET_KEY)
    formData.append('response', token)

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`
      }
    }

    const result = await response.json()
    
    return {
      success: result.success,
      error: result.success ? undefined : 'Turnstile verification failed',
      challengeTs: result['challenge_ts'],
      hostname: result.hostname
    }
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return {
      success: false,
      error: 'Failed to verify Turnstile token'
    }
  }
}
