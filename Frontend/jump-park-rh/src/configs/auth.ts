export default {
  meEndpoint: `${process.env.API_URL}/auth/me/`,
  loginEndpoint: `${process.env.API_URL}/auth/login/`,
  registerEndpoint: `${process.env.API_URL}v1/users/`,
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken'
}
