import useProgress from './useProgress';
import { displayWeight } from '../utils/converters';

/**
 * Global Unit Hook
 * Provides centralized access to unit preference and conversion
 */
export const useUnit = () => {
  const { profile, updateProfile } = useProgress();
  const unit = profile?.unit || 'lbs';

  const convert = (lbsValue) => displayWeight(lbsValue, unit);

  const toggleUnits = () => {
    const newUnit = unit === 'lbs' ? 'kg' : 'lbs';
    updateProfile({ unit: newUnit });
  };

  return {
    unit,
    convert,
    toggleUnits,
    label: unit.toUpperCase(),
  };
};

export default useUnit;
