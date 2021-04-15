import useSWR, { mutate }  from 'swr'
export const apiHost = process.env.NEXT_PUBLIC_API_HOST;

// URL BUILDERS
export const getShowsUrl = (params) => `${apiHost}/shows/${buildQs(params)}`; 
export const getShowUrl = (id='') => `${apiHost}/shows/${id}`; 

export const getShowCommentsUrl = (params) => `${apiHost}/show_comments/${buildQs(params)}`;
export const getShowCommentUrl = (id='') => `${apiHost}/show_comments/${id}`; 

export const getTagsUrl = (params) => `${apiHost}/tags/${buildQs(params)}`;
export const getTagUrl = (id) => `${apiHost}/tags/${id}`;  

export const getEventsUrl = (params) => `${apiHost}/events/${buildQs(params)}`; 
export const getEventUrl = (id='') => `${apiHost}/events/${id}`; 

export const getTldrsUrl = (params) => `${apiHost}/tldrs/${buildQs(params)}`; 
export const getTldrUrl = (id='') => `${apiHost}/tldrs/${id}`; 

export const getUsersUrl = (params) => `${apiHost}/users/${buildQs(params)}`; 
export const getUserUrl = (id='') => `${apiHost}/users/${id}`; 

export const getCategoriesUrl = (params) => `${apiHost}/categories/${buildQs(params)}`; 
export const getCategoryUrl = (id='') => `${apiHost}/categories/${id}`; 

export const getAuthManagmentUrl = () => `${apiHost}/authmanagement/`;


// REQUEST
// Vanilla fetch only throws js error for js problems.
// This will throw js error for js AND http problems
// It also provides some syntactic sugar for data and token 
export function request(url, options) {
   const buildOptions = (options = {}) => {
      const {
         data = false, 
         token = false, 
         headers = {}, 
         ...rest
      } = options

      return {
         ...data && {body: JSON.stringify(data)},
         headers: {
            'Accept': 'application/json', 
            'Content-Type': 'application/json',
            ...token && {'Authorization': `Bearer ${token}`},
            ...headers
         },
         ...rest
      }
   }
   const parseJSON = (response) => {
      return new Promise((resolve) => response.json()
        .then((json) => resolve({
          status: response.status,
          ok: response.ok,
          json,
      })));
   }
   return new Promise((resolve, reject) => {
     fetch(url, buildOptions(options))
       .then(parseJSON)
       .then((response) => {
         if (response.ok) {
           return resolve(response.json);
         }
         // extract the error from the server's json
         return reject(response.json);
       })
       .catch((error) => reject({
         networkError: error.message,
       }));
   });
}

// FETCHER
// Objects need to stay out of the useSWR key due to the way it compares keys.
// That means token needs to be passed in as a string arg, not the options object expected by request()
// This fn bridges what useSWR needs and what request needs
export const fetcher = (url, token='') => request(url, {token: token});

// BUILDQS
export const buildQs = (params) => {
   return (params) ? "?"+Object.keys(params).map(key => key + '=' + params[key]).join('&') : '';
}

// PARSEPAGEOBJ
// reorganizes pagination objects returned by feathers and outputted by useSWR
// into something a little flatter and easier to use 
export const parsePageObj = (swr) => {
   const {data, ...meta} = swr.data || {}; 
   return { 
      ...swr,
      data: data, 
      meta: meta
   }
}
