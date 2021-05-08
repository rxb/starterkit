const buildUrl = (pageUrl, params) => {
   const pageRoot = "/tldr"
   const qs = (params) ? "?"+Object.keys(params).map(key => key + '=' + params[key]).join('&') : '';
   return pageRoot + pageUrl + qs;
}

export const getIndexPageUrl = (options) => buildUrl('/', options);
export const getCategoryPageUrl = (options) => buildUrl('/', options);
export const getProfilePageUrl = (options) => buildUrl('/profile', options);
export const getProfileEditPageUrl = (options) => buildUrl('/profileedit', options);
export const getTldrPageUrl = (options) => buildUrl('/tldr', options);
export const getTldrEditPageUrl = (options) => buildUrl('/edit', options);
export const getVersionEditPageUrl = (options) => buildUrl('/versionedit', options);
export const getRequestPasswordPageUrl = (options) => buildUrl('/requestpassword', options);
export const getResetPasswordPageUrl = (options) => buildUrl('/resetpassword', options);
export const getOauthPageUrl = (options) => buildUrl('/oauth', options);
export const getLoginPageUrl = (options) => buildUrl('/login', options);
export const getRegisterPageUrl = (options) => buildUrl('/register', options);
export const getSavedPageUrl = (options) => buildUrl('/saved', options);


const loginRedirectKey = "loginRedirect";
export const getLoginRedirect = () => {
   const storedRedirect = localStorage.getItem(loginRedirectKey);
   localStorage.removeItem(loginRedirectKey);
   return storedRedirect ? JSON.parse(storedRedirect) : false;
}

export const saveLoginRedirect = (redirect) => {
   localStorage.setItem(loginRedirectKey, JSON.stringify(redirect) );
}