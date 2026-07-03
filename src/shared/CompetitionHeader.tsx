import React from 'react';
import {FONT} from './tokens';

export const CompetitionHeader: React.FC<{competition: string}> = ({competition}) => (
  <div
    style={{
      position: 'absolute',
      top: '4.9%',
      width: '100%',
      textAlign: 'center',
      fontFamily: FONT,
      fontSize: 24,
      color: 'rgba(255,255,255,0.7)',
      fontWeight: 700,
      letterSpacing: 3,
    }}
  >
    {competition}
  </div>
);
