import React from 'react';
import './RightPanel.css';

function RightPanel() {
  return (
    <aside className="right-panel">
      <h3>Tendencias 🔥</h3>
      <ul>
        <li>#UnocialLovers</li>
        <li>#ModoOscuro</li>
        <li>#ReactVibes</li>
      </ul>

      <h3>Sugerencias </h3>
      <ul>
        <li>@sofia_dev</li>
        <li>@arturo_ui</li>
        <li>@diana_js</li>
      </ul>
    </aside>
  );
}

export default RightPanel;