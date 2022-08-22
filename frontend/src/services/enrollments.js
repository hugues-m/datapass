import jsonToFormData from '../lib/json-form-data';
import { hashToQueryParams } from '../lib';
import { useBackendClient } from '../components/organisms/hooks/useBackendClient';
import React from 'react';

export const serializeEnrollment = (enrollment) =>
  jsonToFormData({ enrollment });
const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

export const useEnrollment = () => {
  const client = useBackendClient();

  const createOrUpdateEnrollment = ({
    enrollment: {
      status,
      updated_at,
      created_at,
      id,
      siret,
      nom_raison_sociale,
      acl,
      events,
      team_members,
      documents,
      ...enrollment
    },
  }) => {
    const serializedEnrollment = serializeEnrollment(enrollment);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (id) {
      return client
        .patch(`/api/enrollments/${id}`, serializedEnrollment, config)
        .then(({ data: enrollment }) => enrollment);
    }

    return (
      client
        .post(`/api/enrollments/`, serializedEnrollment, config)
        // format contact to a more usable structure
        // the backend should be able to use this structure to in the future
        .then(({ data: enrollment }) => enrollment)
    );
  };

  const getUserEnrollment = (id) => {
    return (
      client
        .get(`/api/enrollments/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        // format contact to a more usable structure
        // the backend should be able to use this structure to in the future
        .then(({ data: enrollment }) => enrollment)
    );
  };

  const hasAccessToEnrollment = (id) => {
    return getUserEnrollment(id)
      .then(() => true)
      .catch(() => false);
  };

  const getEnrollmentCopies = (id) => {
    return client
      .get(`/api/enrollments/${id}/copies`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(({ data: { enrollments: data } }) => data);
  };

  const getNextEnrollments = (id) => {
    return client
      .get(`/api/enrollments/${id}/next_enrollments`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(({ data: { enrollments: data } }) => data);
  };

  const getPublicValidatedEnrollments = ({
    targetApi,
    page = null,
    size = null,
  }) => {
    const queryParam = hashToQueryParams({
      target_api: targetApi,
      page,
      size,
    });

    return client
      .get(`/api/enrollments/public${queryParam}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(({ data }) => data);
  };

  const getEnrollments = ({
    page = null,
    sortBy = [],
    filter = [],
    detailed = null,
    size = null,
  }) => {
    const formatedSortBy = sortBy.map(({ id, desc }) => ({
      [id]: desc ? 'desc' : 'asc',
    }));
    const formatedFilter = filter.map(({ id, value }) => ({
      [id]: value,
    }));
    const queryParam = hashToQueryParams({
      page,
      detailed,
      size,
      sortedBy: formatedSortBy,
      filter: formatedFilter,
    });

    return client
      .get(`${BACK_HOST}/api/enrollments/${queryParam}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(({ data }) => data);
  };

  const getUserValidatedEnrollments = (targetApi) => {
    // NB. if the user has more than 100 validated franceconnect enrollments, he won’t be able to choose amongst them all
    // since we arbitrary limit the max size of the result to 100.
    return getEnrollments({
      filter: [
        { id: 'status', value: 'validated' },
        { id: 'target_api', value: targetApi },
      ],
      detailed: true,
      size: 100,
    }).then(({ enrollments }) => enrollments);
  };

  const getUserEnrollments = () => {
    return client
      .get(`/api/enrollments/user`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(({ data }) => data);
  };

  const changeEnrollmentState = ({ event, id, comment }) => {
    const options = {
      event,
    };

    if (comment) {
      options.comment = comment;
    }

    return client.patch(`/api/enrollments/${id}/change_state`, options, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const updateTeamMember = ({
    teamMemberId,
    nom,
    prenom,
    email,
    phoneNumber,
    job,
  }) => {
    const team_member = {};
    if (nom) team_member[`family_name`] = nom;
    if (prenom) team_member[`given_name`] = prenom;
    if (email) team_member[`email`] = email;
    if (phoneNumber) team_member[`phone_number`] = phoneNumber;
    if (job) team_member[`job`] = job;
    const serializedTeamMember = jsonToFormData({ team_member });
    return client
      .patch(`/api/team_members/${teamMemberId}`, serializedTeamMember, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data }) => data);
  };

  const deleteEnrollment = ({ id }) => {
    return client.delete(`/api/enrollments/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const getMostUsedComments = ({ event, targetApi } = {}) => {
    const queryParam = hashToQueryParams({
      event,
      target_api: targetApi,
    });

    return client
      .get(`/api/events/most-used-comments${queryParam}`, {
        headers: { 'Content-type': 'application/json' },
      })
      .then(({ data }) => data.map(({ comment }) => comment));
  };

  const getEmailTemplates = ({ id }) => {
    return client
      .get(`/api/enrollments/${id}/email_templates`, {
        headers: { 'Content-type': 'application/json' },
      })
      .then(({ data: { email_templates } }) => email_templates);
  };

  const copyEnrollment = ({ id }) => {
    return client
      .post(`/api/enrollments/${id}/copy`, {
        headers: { 'Content-type': 'application/json' },
      })
      .then(({ data }) => data);
  };

  const getHubeeValidatedEnrollments = () => {
    return client
      .get(`/api/enrollments/hubee_validated`, {
        headers: { 'Content-type': 'application/json' },
      })
      .then(({ data: { enrollments } }) => enrollments);
  };

  return {
    createOrUpdateEnrollment,
    getUserEnrollments,
    hasAccessToEnrollment,
    getEnrollmentCopies,
    getNextEnrollments,
    getPublicValidatedEnrollments,
    getEnrollments,
    getUserValidatedEnrollments,
    getUserEnrollment,
    changeEnrollmentState,
    updateTeamMember,
    deleteEnrollment,
    getMostUsedComments,
    getEmailTemplates,
    copyEnrollment,
    getHubeeValidatedEnrollments,
  };
};

// HOC for class components
export const withEnrollment = (Component) => (props) => {
  const enrollment = useEnrollment();
  return <Component {...props} enrollment={enrollment} />;
};
