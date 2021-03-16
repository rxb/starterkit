import useSWR, { mutate }  from 'swr'
export const apiHost = process.env.NEXT_PUBLIC_API_HOST;


// REQUEST
// vanilla fetch only throws js error for js problems
// this will throw js error for js AND http problems
// also provides some syntactic sugar for data and token 
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

export const fetcher = (url, token='') => request(url, {token: token});

export const buildQs = (params) => {
   return (params) ? "?"+Object.keys(params).map(key => key + '=' + params[key]).join('&') : '';
}

export const parsePageObj = (swr) => {
   const {data, ...meta} = swr.data || {}; 
   return { 
      ...swr,
      data: data, 
      meta: meta
   }
}


// URL BUILDERS

export const getShowsUrl = (params) => `${apiHost}/shows/${buildQs(params)}`; 
export const getShowUrl = (id='') => `${apiHost}/shows/${id}`; 

export const getShowCommentsUrl = (params) => `${apiHost}/show_comments/${buildQs(params)}`;
export const getShowCommentUrl = (id='') => `${apiHost}/show_comments/${id}`; 

export const getTagsUrl = () => `${apiHost}/tags/`; 

export const getEventsUrl = (params) => `${apiHost}/events/${buildQs(params)}`; 
export const getEventUrl = (id='') => `${apiHost}/events/${id}`; 

export const getTldrsUrl = (params) => `${apiHost}/tldrs/${buildQs(params)}`; 
export const getTldrUrl = (id='') => `${apiHost}/tldrs/${id}`; 

export const getUsersUrl = (params) => `${apiHost}/users/${buildQs(params)}`; 
export const getUserUrl = (id='') => `${apiHost}/users/${id}`; 


// ###################################################
// DEPRECATED FNs
// it's better to just do these straight


// SHOWS
export const useShows = (params, options) => {
   return parsePageObj(useSWR(getShowsUrl(params), options))
}
export const useShow = (id, options) => {
   return useSWR(getShowUrl(id), options)
}

export const postShow = (data, token) => {
   return request(getShowUrl(), {method: 'POST', data, token} );
}
export const patchShow = (id, data, token) => {
   return request(getShowUrl(id), {method: 'PATCH', data, token} );
}
export const deleteShow = (id, token) => {
   return request(getShowUrl(id), {method: 'DELETE', token} );
}

// SHOWCOMMENTS
export const useShowComments = (params, options) => {
   return parsePageObj(useSWR(getShowCommentsUrl(params), options))
}
export const useShowComment = (id, options) => {
   return useSWR(getShowCommentUrl(id), options)
}

export const postShowComment = (data, token) => {
   return request(getShowCommentUrl(), {method: 'POST', data, token} );
}
export const patchShowComment = (id, data, token) => {
   return request(getShowCommentUrl(id), {method: 'PATCH', data, token} );
}
export const deleteShowComment = (id, token) => {
   return request(getShowCommentUrl(id), {method: 'DELETE', token} );
}


// TAGS
export const useTags = (options) => {
   return parsePageObj(useSWR(getTagsUrl(), options));
}


// EVENTS
export const useEvents = (params, options) => {
   return parsePageObj(useSWR(getEventsUrl(params), options))
}
export const useEvent = (id, options) => {
   return useSWR(getEventUrl(id), options)
}

export const postEvent = (data, token) => {
   return request(getEventUrl(), {method: 'POST', data, token} );
}
export const patchEvent = (id, data, token) => {
   return request(getEventUrl(id), {method: 'PATCH', data, token} );
}
export const deleteEvent = (id, token) => {
   return request(getEventUrl(id), {method: 'DELETE', token} );
}