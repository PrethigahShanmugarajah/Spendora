// Client / src / api / api_route.js
const BASE_URL = import.meta.env.VITE_BASEURL;

const API_ROUTES = {
  USER: {
    PROFILE: `${BASE_URL}/api/user/profile`,
  },
};

export default API_ROUTES;
