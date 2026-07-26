import React from 'react';
import OtherPlayerAvatar from './OtherPlayerAvatar';

const OtherPlayersList = ({ activePlayersList = [], playersRef }) => {
  if (!activePlayersList || activePlayersList.length === 0) return null;

  return (
    <group>
      {activePlayersList.map((player) => (
        <OtherPlayerAvatar
          key={player.id}
          player={player}
          playersRef={playersRef}
        />
      ))}
    </group>
  );
};

export default OtherPlayersList;
