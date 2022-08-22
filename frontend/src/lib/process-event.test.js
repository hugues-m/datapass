jest.mock('../services/enrollments');

import {
  EnrollmentEvent,
  eventConfigurations,
} from '../config/event-configuration';
// eslint-disable-next-line import/first
import { useEnrollment } from '../services/enrollments';
// eslint-disable-next-line import/first
import { useProcessEvent } from './process-event';
// eslint-disable-next-line import/first
import { renderHook } from '@testing-library/react-hooks';

describe('When submitting the enrollment form', () => {
  const mockUseEnrollment = () => {
    const mockedFunctions = {
      createOrUpdateEnrollment: jest.fn(),
      changeEnrollmentState: jest.fn(),
      deleteEnrollment: jest.fn(),
    };
    useEnrollment.mockReturnValue(mockedFunctions);

    return mockedFunctions;
  };

  const testUseProcessEvent = () => renderHook(useProcessEvent).result.current;

  const enrollment = { id: Symbol(), acl: {} };
  const updateEnrollment = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('with the notify event', () => {
    const event = EnrollmentEvent.notify;
    const eventConfiguration = eventConfigurations.notify;

    it('calls for the enrollment state update', async () => {
      const userMessage = 'La barbe de la femme à Georges Moustaki';

      const { changeEnrollmentState } = mockUseEnrollment();

      const output = await testUseProcessEvent()(
        event,
        eventConfiguration,
        enrollment,
        updateEnrollment,
        userMessage,
        false
      );

      expect(changeEnrollmentState).toHaveBeenCalledWith({
        event: 'notify',
        comment: userMessage,
        id: enrollment.id,
      });
      expect(output).toMatchSnapshot();
    });
  });

  describe('with the destroy event', () => {
    const event = EnrollmentEvent.destroy;
    const eventConfiguration = eventConfigurations.destroy;

    it('calls the delete endpoint', async () => {
      const { deleteEnrollment } = mockUseEnrollment();

      const output = await testUseProcessEvent()(
        event,
        eventConfiguration,
        enrollment,
        updateEnrollment
      );

      expect(deleteEnrollment).toHaveBeenCalledWith({
        id: enrollment.id,
      });
      expect(output).toMatchSnapshot();
    });
  });

  describe('with the update event', () => {
    const event = EnrollmentEvent.update;
    const eventConfiguration = eventConfigurations.update;

    const enrollmentToUpdate = { ...enrollment, acl: { update: true } };

    it('calls the update endpoint', async () => {
      const { createOrUpdateEnrollment } = mockUseEnrollment();

      createOrUpdateEnrollment.mockResolvedValue(enrollmentToUpdate);

      const output = await testUseProcessEvent()(
        event,
        eventConfiguration,
        enrollmentToUpdate,
        updateEnrollment
      );

      expect(createOrUpdateEnrollment).toHaveBeenCalledWith({
        enrollment: enrollmentToUpdate,
      });
      expect(output).toMatchSnapshot();
    });

    it('displays an error if update fails', async () => {
      const { createOrUpdateEnrollment } = mockUseEnrollment();

      createOrUpdateEnrollment.mockRejectedValue("Pas d'update désolé");

      const output = await testUseProcessEvent()(
        event,
        eventConfiguration,
        enrollmentToUpdate,
        updateEnrollment
      );

      expect(output).toMatchSnapshot();
    });
  });
});
