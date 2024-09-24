import axios from 'axios';
import { DataArray, QualityArray, ScatterArray, PredictionArray, ShapArray } from '../../types/data';

// Create an Axios instance with the backend base URL
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://chicago-urban-planning-dashboard.onrender.com', // Use the backend URL from .env or default
});

// Fetch data points from the backend based on the provided ID
export function postPoints(id: string): Promise<DataArray | undefined> {
  const url = `/data/${id}`; // API endpoint for data points
  return axiosClient.get<DataArray>(url)
    .then((res) => {
      if (res.status !== 204) {
        return res.data; // Return the data if the response is valid
      }
      return undefined;
    })
    .catch((error) => {
      console.error('Error fetching data points:', error); // Log any errors
      return undefined;
    });
}

// Fetch quality data from the backend
export function getQualityData(): Promise<QualityArray | undefined> {
  const url = '/data/quality'; // API endpoint for quality data
  return axiosClient.get<QualityArray>(url)
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((error) => {
      console.error('Error fetching quality data:', error);
      return undefined;
    });
}

// Fetch scatter plot data
export function getScatterData(): Promise<ScatterArray | undefined> {
  const url = '/data/scatter'; // API endpoint for scatter data
  return axiosClient.get<ScatterArray>(url)
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((error) => {
      console.error('Error fetching scatter data:', error);
      return undefined;
    });
}

// Fetch prediction data
export function getPrediction(): Promise<PredictionArray | undefined> {
  const url = '/data/model'; // API endpoint for predictions
  return axiosClient.get<PredictionArray>(url)
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((error) => {
      console.error('Error fetching predictions:', error);
      return undefined;
    });
}

// Fetch SHAP values from the backend
export function getShapValues(): Promise<ShapArray | undefined> {
  const url = '/data/model/shap_values'; // API endpoint for SHAP values
  return axiosClient.get<ShapArray>(url)
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((error) => {
      console.error('Error fetching SHAP values:', error);
      return undefined;
    });
}
