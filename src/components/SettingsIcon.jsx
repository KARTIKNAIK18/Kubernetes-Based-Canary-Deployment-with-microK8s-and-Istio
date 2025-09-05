import { useEffect, useRef } from 'react';
import '../styles/SettingsIcon.css';

// A custom settings icon that fits the elegant, analog theme
const SettingsIcon = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = 13;
    const innerRadius = 7;
    const teethCount = 12;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw gear
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'transparent';
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fill();
    
    // Draw center
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();
    
    // Draw teeth
    for (let i = 0; i < teethCount; i++) {
      const angle = (i / teethCount) * 2 * Math.PI;
      const x1 = centerX + innerRadius * Math.cos(angle);
      const y1 = centerY + innerRadius * Math.sin(angle);
      const x2 = centerX + outerRadius * Math.cos(angle);
      const y2 = centerY + outerRadius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, []);
  
  return (
    <canvas ref={canvasRef} width="32" height="32" className="settings-icon-canvas" />
  );
};

export default SettingsIcon;
