import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Linkify } from '../../../molecules/Linkify';
import Alert from '../../../atoms/Alert';
import { useEnrollment } from '../../../../services/enrollments';

const EnrollmentHasCopiesNotification = ({ enrollmentId }) => {
  const [enrollmentCopies, setEnrollmentCopies] = useState(false);
  const { getEnrollmentCopies } = useEnrollment();

  useEffect(() => {
    async function fetchEnrollmentCopies() {
      if (!enrollmentId) return setEnrollmentCopies(false);

      const enrollmentsCopies = await getEnrollmentCopies(enrollmentId);

      setEnrollmentCopies(getEnrollmentCopies);
    }

    fetchEnrollmentCopies();
  }, [enrollmentId, getEnrollmentCopies]);

  if (isEmpty(enrollmentCopies)) return null;

  const enrollmentCopyId = enrollmentCopies[0].id;

  return (
    <Alert
      type="warning"
      title={'Il existe une copie plus récente de cette habilitation'}
    >
      <Linkify message={`L’habilitation #${enrollmentCopyId}.`} />
    </Alert>
  );
};

export default EnrollmentHasCopiesNotification;
