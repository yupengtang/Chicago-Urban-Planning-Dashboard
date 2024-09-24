// Data point interface used for API responses
export interface DataPoint {
    X1: number;
    X2: number;
    cluster: string;
}

export type DataArray = DataPoint[];

// Interface for quality data used in API responses
export interface QualityD {
    "Community": string;
    "GEOID": number;
    "Longitude": number;
    "Latitude": number;
    "UNS_2015-2019": number;
    "CZH_2017": number;
    "CZM_2017": number;
    "CZR_2017": number;
    "CZS_2017": number;
    "CZV_2017": number;
    "TRF_2017": number;
    "CCG_2015-2019": number;
    "CCR_2015-2019": number;
    "HCSATHP_2015-2017": number;
    "HCSDIAP_2015-2017": number;
    "HCSHYTP_2015-2017": number;
    "HCSOBP_2015-2017": number;
    "HCSOHSP_2015-2017": number;
    "HCSNSP_2015-2017": number;
    "EDB_2015-2019": number;
    "UMP_2015-2019": number;
    "POV_2015-2019": number;
    "HCSFVP_2015-2017": number;
    "HCSPAP_2015-2017": number;
    "HCSSP_2015-2017": number;
    "VRDIDR_2015-2019": number;
    "VRDO_2015-2019": number;
    "VRSUR_2015-2019": number;
    "VRCAR_2015-2019": number;
    "VRSTR_2015-2019": number;
    "VRLE_2017": number;
    "POP_2015-2019": number;
    "CZD_2017": number;
    "PARK_COUNT": number;
    "CLUSTER_LABEL": number;
    "PCA_0": number;
    "PCA_1": number;
}

export type QualityArray = QualityD[];

// Feature interface for geographic data
export interface FeatureD {
    type: string;
    features: [{
        type: string;
        properties: {};
        geometry: {};
    }];
}

// Scatter data interface
export interface ScatterD { 
    value: number;
    feature: string;
    years: number;
    park: string;
    lifeExpectancy: number;
    numberOfParks: number;
    trafficIntensity: number;
}
   
export type ScatterArray = ScatterD[];

// Prediction data interface
export interface PredD {
    value: string;
}

export type PredictionArray = PredD[];

// SHAP values data interface
export interface ShapD {
    feature: string;
    shapval: number;
}

export type ShapArray = ShapD[];

// Axios setup and API requests (added based on your project needs)
import axios from 'axios';

// Create axios client with base URL pointing to the backend
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://chicago-urban-planning-dashboard.onrender.com',
});

/**
 * Fetch data points from the backend
 * @param id - Identifier for the data array
 * @returns A promise resolving to DataArray
 */
export function postPoints(id: string): Promise<DataArray | undefined> {
  const url = `data/${id}`;
  return axiosClient.get<DataArray>(url)
    .then((res) => res.data)
    .catch((error) => {
      console.error("Error fetching data points:", error);
      return undefined;
    });
}

/**
 * Fetch quality data from the backend
 * @param id - Identifier for the quality array
 * @returns A promise resolving to QualityArray
 */
export function postQuality(id: string): Promise<QualityArray | undefined> {
  const url = `data/quality/${id}`;
  return axiosClient.post<QualityArray>(url)
    .then((res) => res.data)
    .catch((error) => {
      console.error("Error fetching quality data:", error);
      return undefined;
    });
}
