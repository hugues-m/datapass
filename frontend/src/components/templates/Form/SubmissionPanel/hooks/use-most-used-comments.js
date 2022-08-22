import { useEffect, useState } from 'react';
import { useEnrollment } from '../../../../../services/enrollments';

const useMostUsedComments = (event, targetApi) => {
  const [comments, setComments] = useState([]);
  const { getMostUsedComments } = useEnrollment();

  useEffect(() => {
    async function fetchMostUsedComments() {
      if (!event || !targetApi) return null;

      const comments = await getMostUsedComments({
        event,
        targetApi,
      });

      setComments(comments);
    }

    fetchMostUsedComments();
  }, [event, targetApi]);

  return comments;
};

export default useMostUsedComments;
