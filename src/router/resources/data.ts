import { DataArray } from '../../types/data';

import { QualityD } from '../../types/data';
import axiosClient from '../apiClient'

/**
 * get the data points through a post request
 * @param id the identifier of the point array
*/
export function postPoints(id: string): Promise<DataArray | undefined> {
  const url = `data/${id}`
  const promise = axiosClient.get<DataArray>(url)
  return promise
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

export function getPointsFromBackend(id: string): Promise<undefined> {
  const url = `data/${id}`
  const promise = axiosClient.get<undefined>(url)
  return promise
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

export function getPointsQuality(url: string): Promise<QualityD | undefined> {
  const promise = axiosClient.get<undefined>(url)
  return promise
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}


