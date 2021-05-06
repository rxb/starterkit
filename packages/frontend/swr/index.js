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

export const getUsersSavedTldrsUrl = (params) => `${apiHost}/users-savedtldrs/${buildQs(params)}`; 

export const getTldrsVotesUrl = (params) => `${apiHost}/tldrs-votes/${buildQs(params)}`; 


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


// PAGEHELPER
// adds attributes for infinite/non-infinite pagination UI 
export const pageHelper = (swr) => {
   swr.isInfinite = (typeof swr.size !== "undefined");
   if(swr.isInfinite){
      // .data is an array of page objects [{total, offset, limit, items}, ...]
      swr.isLoadingInitialData = !swr.data && !swr.error;
      swr.isLoadingMore =
        swr.isLoadingInitialData ||
        (swr.size > 0 && swr.data && typeof swr.data[swr.size - 1] === "undefined");
      swr.total = swr.data?.[0]?.total || 0;
      swr.isEmpty = swr.data?.[0]?.items?.length === 0;
      swr.pageSize = swr.data?.[0]?.limit || 0;
      swr.isReachingEnd = 
         swr.isEmpty || (swr.data && swr.data[swr.data.length - 1]?.items.length < swr.pageSize);
      swr.isRefreshing = swr.isValidating && swr.data && swr.data.length === swr.size;
      //{ data, error, mutate, size, setSize, isValidating, isLoadingInitialData, isLoadingMore, total, isEmpty, pageSize, isReachingEnd, isRefreshing }
   }
   else{
      // data is a page object {total, offset, limit, items}
      swr.isEmpty = swr.data?.items?.length === 0;
      swr.pageSize = swr.data?.limit || 0;
      swr.total = swr.data?.total || 0;
      swr.pageCount = Math.ceil(swr.total / swr.pageSize);   
      //{ data, error, mutate, total, isEmpty, pageSize, pageCount }
   }
   return swr;
}

