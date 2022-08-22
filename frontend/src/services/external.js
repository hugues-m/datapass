import { RateLimiter } from 'limiter';
import { memoize } from 'lodash';
import { useBackendClient } from '../components/organisms/hooks/useBackendClient';

const limiter = new RateLimiter({ tokensPerInterval: 2, interval: 300 });

const getOrganizationInformation = async (siret, client) => {
  await limiter.removeTokens(1);

  const {
    etablissement: {
      nom_raison_sociale,
      adresse,
      code_postal,
      libelle_commune,
      activite_principale,
      activite_principale_label,
      etat_administratif,
    },
  } = await client
    .get(`/api/insee/etablissements/${siret}`, {
      headers: { 'Content-type': 'application/json' },
    })
    .then(({ data }) => data);

  return {
    title: nom_raison_sociale,
    activite: activite_principale,
    activite_label: activite_principale_label,
    adresse,
    code_postal,
    ville: libelle_commune,
    etat_administratif,
    siret,
  };
};

const memoizedGetOrganizationInformation = memoize(getOrganizationInformation);

export const useExternal = () => {
  const client = useBackendClient();
  const getCachedOrganizationInformation = async (siret) => {
    try {
      return await memoizedGetOrganizationInformation(siret, client);
    } catch (e) {
      memoizedGetOrganizationInformation.cache.delete(siret);
      throw e;
    }
  };
  return {
    getCachedOrganizationInformation,
  };
};
