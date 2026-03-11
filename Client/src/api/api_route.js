// Client / src / api / api_route.js
const BASE_URL = import.meta.env.VITE_BASEURL;

const API_ROUTES = {
  USER: {
    PROFILE: `${BASE_URL}/api/user/profile`,
    LOGIN: `${BASE_URL}/api/user/login`,
    REGISTER: `${BASE_URL}/api/user/register`,
  },
  INCOME: {
    GET: `${BASE_URL}/api/income/get`,
    ADD: `${BASE_URL}/api/income/add`,
    UPDATE: (id) => `${BASE_URL}/api/income/update/${id}`,
    DELETE: (id) => `${BASE_URL}/api/income/delete/${id}`,
  },
  EXPENSE: {
    GET: `${BASE_URL}/api/expense/get`,
    ADD: `${BASE_URL}/api/expense/add`,
    UPDATE: (id) => `${BASE_URL}/api/expense/update/${id}`,
    DELETE: (id) => `${BASE_URL}/api/expense/delete/${id}`,
  },
};

export default API_ROUTES;
