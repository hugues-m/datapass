import nock from 'nock';
import { serializeEnrollment, useEnrollment } from './enrollments';
import { renderHook } from '@testing-library/react-hooks';
import FIRST_ENROLLMENT_1 from '../../mock/enrollment-form/first-form-enrollment.json';
import ENROLLMENTS from '../../mock/api/get-user-enrollments-response.json';
import SENT_ENROLLMENT from '../../mock/enrollment-form/sent-enrollment.json';
import axiosHttpAdapter from 'axios/lib/adapters/http'
import axios from 'axios';

// TODO this should be in a jest setup (jest.setup.ts) file this is for demo only
// axios will default to using the XHR adapter which
// can't be intercepted by nock. So, configure axios to use the node adapter.
axios.defaults.adapter = axiosHttpAdapter

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

const testUseEnrollment = () => renderHook(useEnrollment).result.current;

describe('getEnrollments', () => {
  describe('When there is a response', () => {
    nock(BACK_HOST, {
      reqheaders: {
        'Content-Type': 'application/json',
      },
    })
      .get('/api/enrollments/')
      .reply(200, ENROLLMENTS);

    it('should return the data', () => {
      return testUseEnrollment()
        .getEnrollments({})
        .then((response) => {
          expect(response).toEqual(ENROLLMENTS);
        });
    });
  });
});

describe('getUserEnrollment', () => {
  describe('When there is a response', () => {
    nock(BACK_HOST, {
      reqheaders: {
        'Content-Type': 'application/json',
      },
    })
      .get('/api/enrollments/1')
      .reply(200, SENT_ENROLLMENT);

    it('should return a 200 status', () => {
      return testUseEnrollment()
        .getUserEnrollment(1)
        .then((response) => {
          expect(response).toEqual(SENT_ENROLLMENT);
        });
    });
  });
});

describe('serializeEnrollment', () => {
  describe('When there is a response', () => {
    it('should return a 200 status', () => {
      const enrollment = FIRST_ENROLLMENT_1;
      const formData = serializeEnrollment(enrollment);
      expect(formData.getAll('enrollment[enrollment][status]')).toEqual([
        'draft',
      ]);
      expect(formData.getAll('enrollment[enrollment][intitule]')).toEqual([
        'Nom du fournisseur de service',
      ]);
      expect(formData.getAll('enrollment[enrollment][description]')).toEqual([
        'Description du service',
      ]);
      expect(formData.getAll('enrollment[enrollment][cgu_approved]')).toEqual([
        'true',
      ]);
      expect(
        formData.getAll('enrollment[enrollment][scopes][birthcountry]')
      ).toEqual(['true']);
      expect(formData.getAll('enrollment[enrollment][scopes][gender]')).toEqual(
        ['true']
      );
      expect(formData.getAll('enrollment[enrollment][target_api]')).toEqual([
        'franceconnect',
      ]);
      expect(formData.getAll('enrollment[enrollment][contacts][][id]')).toEqual(
        ['dpo']
      );
      expect(
        formData.getAll('enrollment[enrollment][contacts][][heading]')
      ).toEqual(['Délégué à la protection des données']);
      expect(
        formData.getAll('enrollment[enrollment][contacts][][nom]')
      ).toEqual(['user']);
      expect(
        formData.getAll('enrollment[enrollment][contacts][][email]')
      ).toEqual(['user@test']);
    });
  });
});
