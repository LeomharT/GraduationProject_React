import AuthingSSO from '@authing/sso';

let auth = new AuthingSSO({
    appId: '5fc0a9285330540d530ceb86',
    appDomain: "house-domain.authing.cn"
});

export { auth };
