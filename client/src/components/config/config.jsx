const localHost = window.location.hostname === "localhost";

export const config = localHost
  ? { uniClinicAPI: import.meta.env.VITE_LOCAL_API }
  : { uniClinicAPI: import.meta.env.VITE_PROD_API };

export const endpoints = {
  staff:         "/api/staff",
  students:      "/api/students",
  visits:        "/api/visits",
  medicines:     "/api/medicines",
  prescriptions: "/api/prescriptions",
  treatments:    "/api/treatments",
};