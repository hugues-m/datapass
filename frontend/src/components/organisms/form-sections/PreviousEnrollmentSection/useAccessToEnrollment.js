import { useState, useEffect } from 'react';
import { useEnrollment } from '../../../../services/enrollments';

const useAccessToEnrollment = (enrollmentId) => {
  const [hasAccessToPreviousEnrollment, setHasAccessToPreviousEnrollment] =
    useState(false);

  const { hasAccessToEnrollment } = useEnrollment();

  useEffect(() => {
    async function fetchHasAccessToEnrollment() {
      if (!enrollmentId) return null;

      const result = await hasAccessToEnrollment(enrollmentId);

      setHasAccessToPreviousEnrollment(result);
    }

    fetchHasAccessToEnrollment();
  }, [enrollmentId, hasAccessToEnrollment]);

  return hasAccessToPreviousEnrollment;
};

export default useAccessToEnrollment;
