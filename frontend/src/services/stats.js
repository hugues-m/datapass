import { memoize } from 'lodash';
import { hashToQueryParams } from '../lib';
import { useBackendClient } from '../components/organisms/hooks/useBackendClient';

export const useStats = () => {
  const client = useBackendClient();

  const getAPIStats = async (target_api_list) => {
    return client.get(
      `/api/stats${hashToQueryParams({
        target_api_list,
      })}`,
      {
        headers: { 'Content-type': 'application/json' },
      }
    );
  };

  const getMajorityPercentileProcessingTimeInDays = async (target_api) => {
    return client.get(
      `/api/stats/majority_percentile_processing_time_in_days${hashToQueryParams(
        {
          target_api,
        }
      )}`,
      {
        headers: { 'Content-type': 'application/json' },
      }
    );
  };

  const getCachedMajorityPercentileProcessingTimeInDays = memoize(
    getMajorityPercentileProcessingTimeInDays
  );

  return {
    getAPIStats,
    getMajorityPercentileProcessingTimeInDays,
    getCachedMajorityPercentileProcessingTimeInDays,
  };
};
