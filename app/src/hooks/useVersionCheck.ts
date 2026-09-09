
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLatestVersionApi } from '../api/versionSlice';
import { RootState } from '../redux/store';
import { AppDispatch } from '../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { Linking, Platform } from 'react-native';
import { useAuthData } from './useAuthData';

const appVersion = require('../../../assets/config/app.version.json');

export const useVersionCheck = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);

  const { token } = useAuthData();
  const {
    data: versionData,
    loading,
    error,
  } = useSelector((state: RootState) => state.version);

  useEffect(() => {
    const checkVersion = async () => {
      const lastCheckDate = null;
      const today = new Date().toISOString().split('T')[0];

      if (lastCheckDate !== today) {
        await dispatch(getLatestVersionApi({ token }));
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_VERSION_CHECK_DATE, today);
      }
    };

    if (token) {
      checkVersion();
    }
  }, [dispatch, token]);

  const isVersionNewer = (latest: string, current: string) => {
    const lParts = latest.split('.').map(n => parseInt(n, 10) || 0);
    const cParts = current.split('.').map(n => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(lParts.length, cParts.length); i++) {
      const l = lParts[i] || 0;
      const c = cParts[i] || 0;
      if (l > c) return true;
      if (l < c) return false;
    }
    return false;
  };

  useEffect(() => {
    if (versionData && versionData.currentVersion) {
      if (isVersionNewer(versionData.currentVersion, appVersion.currentVersion)) {
        setShowUpdateModal(true);
        if (versionData.isForceUpdate) {
          setIsUpdateRequired(true);
        }
      }
    }
  }, [versionData]);

  const handleUpdate = () => {
    // Logic to open the app store
    const storeUrl = Platform.OS === 'android'
      ? 'market://details?id=com.ajgold.app'
      : 'itms-apps://itunes.apple.com/app/id6740000000';
    Linking.openURL(storeUrl).catch(err => console.error('An error occurred', err));
  };

  const handleLater = () => {
    setShowUpdateModal(false);
  };

  return {
    showUpdateModal,
    isUpdateRequired,
    versionData,
    loading,
    error,
    handleUpdate,
    handleLater,
  };
};
