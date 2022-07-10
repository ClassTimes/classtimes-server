import * as bcrypt from 'bcrypt'

type PayloadWithPassword = Record<'password', unknown>
type PayloadWithHashedPassword = Record<'passwordHash', string> &
  Omit<PayloadWithPassword, 'password'>

/**
 * hashPasswordForPayload
 *
 * A simple helper for password hashing
 *
 * @param {PayloadWithPassword} payload
 * @returns {Promise<PayloadWithHashedPassword>}
 */
export const hashPasswordForPayload = async (
  payload: PayloadWithPassword,
): Promise<PayloadWithHashedPassword> => {
  const { password, ...payloadWithoutPassword } = payload
  const passwordHash = await bcrypt.hash(password, 10)

  return { passwordHash, ...payloadWithoutPassword }
}
