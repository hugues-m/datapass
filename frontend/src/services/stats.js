import { memoize } from 'lodash';
import { hashToQueryParams } from '../lib';
import axios from 'axios';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

export async function getAPIStats(target_api_list) {
  return axios.get(
    `${BACK_HOST}/api/stats${hashToQueryParams({
      target_api_list,
    })}`,
    {
      headers: { 'Content-type': 'application/json' },
    }
  );
}

export async function getMajorityPercentileProcessingTimeInDays(target_api) {
  return axios.get(
    `${BACK_HOST}/api/stats/majority_percentile_processing_time_in_days${hashToQueryParams(
      {
        target_api,
      }
    )}`,
    {
      headers: { 'Content-type': 'application/json' },
    }
  );
}

export const getCachedMajorityPercentileProcessingTimeInDays = memoize(
  getMajorityPercentileProcessingTimeInDays
);
