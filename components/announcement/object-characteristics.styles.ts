import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 8,
    paddingRight: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 66,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    flexShrink: 0,
  },
  icon: {
    width: 20,
    height: 20,
  },
  separatorContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  separator: {
    width: 1,
    height: 24,
    borderRadius: 13,
    backgroundColor: '#F1F1F1',
  },
  depositRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#F1F1F1',
    borderWidth: 1,
    borderColor: '#F1F1F1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  depositIcon: {
    width: 32,
    height: 32,
  },
});
