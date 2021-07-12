const buildUrl = (pageUrl, params) => {
	const pageRoot = "/tldr"
	const qs = (params) ? "?" + Object.keys(params).map(key => {
		if(Array.isArray(params[key])){
			return params[key].map(v => `${key}[]=${v}`).join('&'); // express style qs array
		}
		else{
			return `${key}=${params[key]}`;
		}		
	}).join('&') : '';
	return pageRoot + pageUrl + qs;
}

export const getIndexPageUrl = (options) => buildUrl('/', options);
export const getCategoryPageUrl = (options) => buildUrl('/category', options);
export const getSearchPageUrl = (options) => buildUrl('/search', options);
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
export const getIssuesPageUrl = (options) => buildUrl('/issues', options);
export const getIssuePageUrl = (options) => buildUrl('/issue', options);
export const getIssueEditPageUrl = (options) => buildUrl('/issueedit', options);
export const getContactPageUrl = (options) => buildUrl('/contact', options);


const loginRedirectKey = "loginRedirect";
export const getLoginRedirect = () => {
	const storedRedirect = localStorage.getItem(loginRedirectKey);
	localStorage.removeItem(loginRedirectKey);
	return storedRedirect ? JSON.parse(storedRedirect) : false;
}

export const saveLoginRedirect = (redirect) => {
	localStorage.setItem(loginRedirectKey, JSON.stringify(redirect));
}

import { updateUi } from '@/actions';
export const detourIfAuthNeeded = (url, authentication, dispatch, Router) => {
	if (!authentication.accessToken) {
		dispatch(updateUi({
			logInModalVisible: true,
			logInModalOptions: {
				redirect: { url },
				callbackForNonRedirectFlow: () => {
					Router.push( url )
				}
			}
		}));
	}
	else{
		Router.push( url )
	}
}