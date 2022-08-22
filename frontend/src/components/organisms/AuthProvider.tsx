import React, { FunctionComponent, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { getErrorMessages } from '../../lib';

export const AuthProvider: FunctionComponent = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const reset = () => {
    setUser(null);
    setIsLoading(false);
    setConnectionError(null);
  };

  const login = () => {
    setIsLoading(true);

    // Using axios directly for this request as useBackendClient depends on this provider
    axios
      .get(`${process.env.REACT_APP_BACK_HOST}/api/users/me`, {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setUser(null);
        setIsLoading(false);
        setConnectionError(getErrorMessages(e).join(' '));
      });
  };

  const logout = () => {
    // will also empty user from state by reloading the entire app
    window.location.href = `${process.env.REACT_APP_BACK_HOST}/api/users/sign_out`;
  };

  useEffect(() => {
    login();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        connectionError,
        login,
        logout,
        reset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
