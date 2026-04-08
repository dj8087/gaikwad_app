
import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import AppButton from './AppButton';
import colors from '../theme/colors';

interface UpdateModalProps {
  visible: boolean;
  isForceUpdate: boolean;
  releaseNote?: string;
  onUpdate: () => void;
  onLater: () => void;
}

const UpdateModal = ({
  visible,
  isForceUpdate,
  releaseNote,
  onUpdate,
  onLater,
}: UpdateModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={isForceUpdate ? () => {} : onLater}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Update Available</Text>
          <Text style={styles.message}>
            A new version of the app is available.
          </Text>
          {releaseNote && <Text style={styles.releaseNote}>{releaseNote}</Text>}
          <View style={styles.buttonContainer}>
            {!isForceUpdate && (
              <AppButton
                title="Later"
                onPress={onLater}
                bg={colors.light}
                color={colors.dark}
                style={{ flex: 1, marginRight: 10 }}
              />
            )}
            <AppButton
              title={isForceUpdate ? "Update Now" : "Update"}
              onPress={onUpdate}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  releaseNote: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: colors.medium,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default UpdateModal;
