import jwt from 'jsonwebtoken'

/**
 * Chave de item do localstorage usado para guardar o token do usuário logado.
 */
export const TOKEN_KEY = '@motorman-Token'

/**
 * Obtém o token JWT do usuário autenticado, guardado no localstorage
 */
export const getToken = () => window.localStorage.getItem(TOKEN_KEY)

/**
 * Verifica se o usuário está autenticado
 */
export const isAuthenticated = () => !!getToken()

/**
 * Guarda o token do localstorage
 * @param {string} token Token JWT
 */
export const login = token => {
  window.localStorage.setItem(TOKEN_KEY, token)
}

/**
 * Apaga o token do localstorage
 */
export const logout = () => {
  window.localStorage.removeItem(TOKEN_KEY)
}

/**
 * Obtém o payload do token JWT decodificado do usuário autenticado.
 *
 * Retorna `null` caso o token não exista.
 *
 * @returns {{[key:string]: any} | null} JWT payload
 */
export const getPayload = () => {
  const token = getToken()

  if (token) {
    const payload = jwt.decode(token)
    return payload
  }

  return null
}

export const getUser = () => {
  const payload = getPayload()
  if (payload && payload.data) {
    return payload.data.user
  }
  return null
}
