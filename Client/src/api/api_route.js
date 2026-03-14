const BASE_URL = import.meta.env.VITE_BASEURL;

const API_ROUTES = {
  USER: {
    PROFILE: `${BASE_URL}/api/user/profile`,
    LOGIN: `${BASE_URL}/api/user/login`,
    REGISTER: `${BASE_URL}/api/user/register`,
    PASSWORD: `${BASE_URL}/api/user/password`,
  },
  INCOME: {
    GET: `${BASE_URL}/api/income/get`,
    ADD: `${BASE_URL}/api/income/add`,
    UPDATE: (id) => `${BASE_URL}/api/income/update/${id}`,
    DELETE: (id) => `${BASE_URL}/api/income/delete/${id}`,
    OVERVIEW: `${BASE_URL}/api/income/overview`,
    DOWNLOAD: `${BASE_URL}/api/income/download`,
  },
  EXPENSE: {
    GET: `${BASE_URL}/api/expense/get`,
    ADD: `${BASE_URL}/api/expense/add`,
    UPDATE: (id) => `${BASE_URL}/api/expense/update/${id}`,
    DELETE: (id) => `${BASE_URL}/api/expense/delete/${id}`,
    OVERVIEW: `${BASE_URL}/api/expense/overview`,
    DOWNLOAD: `${BASE_URL}/api/expense/download`,
  },
  DASHBOARD: {
    OVERVIEW: `${BASE_URL}/api/dashboard/overview`,
  },
};

export default API_ROUTES;
