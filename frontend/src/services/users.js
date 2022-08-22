import { hashToQueryParams } from '../lib';
import { useBackendClient } from '../components/organisms/hooks/useBackendClient';

export const useUsers = () => {
  const client = useBackendClient();

  return {
    getUsers({ usersWithRolesOnly = true }) {
      const queryParam = hashToQueryParams({
        users_with_roles_only: usersWithRolesOnly,
      });
      return client.get(`/api/users${queryParam}`).then(({ data }) => data);
    },
    updateUser({ id, roles = [] }) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      return client
        .patch(`/api/users/${id}`, { user: { roles } }, config)
        .then(({ data }) => data);
    },
    createUser({ email }) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      return client
        .post(`/api/users`, { user: { email } }, config)
        .then(({ data }) => data);
    },
  };
};
