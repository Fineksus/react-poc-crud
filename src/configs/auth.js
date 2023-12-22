import endPointConfig from './endPoint';

export default {
  meEndpoint: `${endPointConfig.jsonServer}/me`,
  loginEndpoint: `${endPointConfig.jsonServer}/login`,
  storageTokenKeyName: 'token',
  onTokenExpiration: 'logout' // logout | refreshToken
}
