import React, { useState, useRef, useEffect } from 'react';

const COLORS = ['#ffffff', '#f59e0b', '#06b6d4', '#ef4444', '#10b981', '#a855f7', '#000000'];
const BRUSH_SIZES = [2, 5, 10, 18];

const DrawingStudioModal = ({ isOpen, onClose, slotInfo, onSubmit }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(5);
  const [tool, setTool] = useState('brush'); // 'brush' | 'text' | 'eraser'
  const [textInput, setTextInput] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid background
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e) => {
    if (tool === 'text') return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || tool === 'text') return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = tool === 'eraser' ? '#18181b' : color;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 2.5 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleCanvasClick = (e) => {
    if (tool !== 'text' || !textInput.trim()) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = color;
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText(textInput, x, y);
    setTextInput('');
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canvasRef.current || !authorName.trim()) return;

    try {
      setSubmitting(true);
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/webp', 0.7);

      await onSubmit({
        name: authorName.trim(),
        message: JSON.stringify({
          wall: slotInfo?.wall || 'north',
          col: slotInfo?.col || 0,
          row: slotInfo?.row || 0,
          drawing: dataUrl,
        }),
      });

      setAuthorName('');
      onClose();
    } catch (err) {
      console.error('Error submitting drawing:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.82)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        background: '#09090b', border: '1px solid #27272a', borderRadius: '16px',
        width: '100%', maxWidth: '620px', padding: '24px', color: '#ffffff',
        boxShadow: '0 25px 50px rgba(0,0,0,0.9)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              🎨 10x10 Signature & Graffiti Studio
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#a1a1aa' }}>
              Wall Slot: [{slotInfo?.wall?.toUpperCase() || 'NORTH'} | Row {slotInfo?.row + 1}, Col {slotInfo?.col + 1}]
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#a1a1aa', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        {/* Toolbar Controls */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
          {/* Tool Selector */}
          <div style={{ display: 'flex', background: '#18181b', borderRadius: '6px', padding: '3px', border: '1px solid #27272a' }}>
            <button
              type="button"
              onClick={() => setTool('brush')}
              style={{
                padding: '6px 12px', background: tool === 'brush' ? '#3f3f46' : 'transparent',
                color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
              }}
            >
              🖌️ Brush
            </button>
            <button
              type="button"
              onClick={() => setTool('text')}
              style={{
                padding: '6px 12px', background: tool === 'text' ? '#3f3f46' : 'transparent',
                color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
              }}
            >
              🔤 Text
            </button>
            <button
              type="button"
              onClick={() => setTool('eraser')}
              style={{
                padding: '6px 12px', background: tool === 'eraser' ? '#3f3f46' : 'transparent',
                color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
              }}
            >
              🧹 Eraser
            </button>
          </div>

          {/* Color Palette */}
          {tool !== 'eraser' && (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: '24px', height: '24px', borderRadius: '50%', background: c,
                    border: color === c ? '2px solid #38bdf8' : '1px solid #52525b',
                    cursor: 'pointer', transform: color === c ? 'scale(1.15)' : 'scale(1)'
                  }}
                />
              ))}
            </div>
          )}

          {/* Line Width */}
          {tool === 'brush' && (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {BRUSH_SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setLineWidth(sz)}
                  style={{
                    padding: '4px 8px', background: lineWidth === sz ? '#3b82f6' : '#18181b',
                    color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem'
                  }}
                >
                  {sz}px
                </button>
              ))}
            </div>
          )}

          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClear}
            style={{
              marginLeft: 'auto', padding: '6px 12px', background: '#ef4444', color: '#fff',
              border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
            }}
          >
            Clear Pad
          </button>
        </div>

        {/* Text Input Row when Text Tool selected */}
        {tool === 'text' && (
          <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Type signature/text then click canvas to stamp..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              style={{
                flex: 1, padding: '8px 12px', background: '#18181b', border: '1px solid #3f3f46',
                borderRadius: '6px', color: '#fff', fontSize: '0.85rem'
              }}
            />
          </div>
        )}

        {/* HTML5 Interactive Drawing Canvas */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <canvas
            ref={canvasRef}
            width={520}
            height={320}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onClick={handleCanvasClick}
            style={{
              border: '2px solid #3f3f46', borderRadius: '8px', cursor: tool === 'text' ? 'text' : 'crosshair',
              background: '#18181b', touchAction: 'none', width: '100%', maxWidth: '520px', height: 'auto'
            }}
          />
        </div>

        {/* Submit Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            required
            maxLength={30}
            placeholder="Your Name / Artist Handle *"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            style={{
              flex: 1, padding: '10px 14px', background: '#18181b', border: '1px solid #3f3f46',
              borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem', outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '10px 20px', background: '#3b82f6', color: '#ffffff',
              border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
              opacity: submitting ? 0.6 : 1
            }}
          >
            {submitting ? 'Publishing...' : 'Publish to 3D Wall'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DrawingStudioModal;
