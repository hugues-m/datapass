import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { DATA_PROVIDER_PARAMETERS } from '../../../../config/data-provider-parameters';
import { Linkify } from '../../../molecules/Linkify';
import Alert from '../../../atoms/Alert';
import IndexPointingRightEmoji from '../../../atoms/icons/IndexPointingRightEmoji';
import { useEnrollment } from '../../../../services/enrollments';

const formatNextEnrollment = (enrollment) =>
  `${
    DATA_PROVIDER_PARAMETERS[enrollment.target_api]?.label ||
    enrollment.target_api
  } : #${enrollment.id}`;

const HasNextEnrollmentsNotification = ({ enrollmentId }) => {
  const [nextEnrollments, setNextEnrollments] = useState(false);
  const { getNextEnrollments } = useEnrollment();

  useEffect(() => {
    async function fetchNextEnrollments() {
      if (!enrollmentId) return setNextEnrollments(false);

      const fetchedNextEnrollments = await getNextEnrollments(enrollmentId);

      setNextEnrollments(fetchedNextEnrollments);
    }

    fetchNextEnrollments();
  }, [enrollmentId, getNextEnrollments]);

  if (isEmpty(nextEnrollments)) {
    return null;
  }

  const severalNexts = nextEnrollments.length > 1;

  return (
    <Alert
      title={
        <>
          Cette habilitation est liée{' '}
          {severalNexts
            ? 'aux habilitations suivantes'
            : 'à l’habilitation suivante'}
        </>
      }
    >
      {nextEnrollments.map((enrollment) => (
        <p key={enrollment.id}>
          <IndexPointingRightEmoji />
          {' '}
          <Linkify
            message={`Habilitation ${formatNextEnrollment(enrollment)}`}
          />
        </p>
      ))}
    </Alert>
  );
};

export default HasNextEnrollmentsNotification;
