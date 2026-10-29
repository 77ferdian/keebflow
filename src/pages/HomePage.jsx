import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import CommandHub from '../components/CommandHub';
import { useTheme } from '../contexts/ThemeContext';

export default function HomePage({
  personalBest = 0,
  streak = 0,
  weakKeys = {},
  soundProfile = 'thock',
  codeLanguage = 'javascript',
  onChangeCodeLanguage,
  timeSelected = 30,
  onChangeTimeSelected
}) {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleStartMode = (selectedMode) => {
    if (selectedMode === 'time') {
      navigate(`/type/time?sub=${timeSelected}`);
    } else if (selectedMode === 'drill') {
      const sortedKeys = Object.entries(weakKeys || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([k]) => k.toLowerCase());
      const query = sortedKeys.length > 0 ? `?keys=${sortedKeys.join(',')}` : '';
      navigate(`/type/drill${query}`);
    } else {
      navigate(`/type/${selectedMode}`);
    }
  };

  // Keyboard shortcut di Beranda untuk navigasi cepat menggunakan React Router
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Jangan tangani jika sedang fokus di input tester
      if (e.target.tagName === 'INPUT') return;

      if (e.key === '1') {
        e.preventDefault();
        navigate(`/type/time?sub=${timeSelected}`);
      } else if (e.key === '2') {
        e.preventDefault();
        navigate('/type/code');
      } else if (e.key === '3') {
        e.preventDefault();
        navigate('/type/daily');
      } else if (e.key === '4') {
        e.preventDefault();
        const sortedKeys = Object.entries(weakKeys || {})
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([k]) => k.toLowerCase());
        const query = sortedKeys.length > 0 ? `?keys=${sortedKeys.join(',')}` : '';
        navigate(`/type/drill${query}`);
      } else if (e.key === '5') {
        e.preventDefault();
        navigate('/type/custom');
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        navigate(`/type/time?sub=${timeSelected}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, timeSelected]);

  return (
    <div className="w-full my-auto py-4">
      <CommandHub
        personalBest={personalBest}
        streak={streak}
        weakKeys={weakKeys}
        soundProfile={soundProfile}
        onStartMode={handleStartMode}
        codeLanguage={codeLanguage}
        onChangeCodeLanguage={onChangeCodeLanguage}
        timeSelected={timeSelected}
        onChangeTimeSelected={onChangeTimeSelected}
        theme={theme}
      />
    </div>
  );
}

HomePage.propTypes = {
  personalBest: PropTypes.number,
  streak: PropTypes.number,
  weakKeys: PropTypes.object,
  soundProfile: PropTypes.string,
  codeLanguage: PropTypes.string,
  onChangeCodeLanguage: PropTypes.func.isRequired,
  timeSelected: PropTypes.number,
  onChangeTimeSelected: PropTypes.func.isRequired
};
