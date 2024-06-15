import React, { useRef, useState } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState({ x: 0, y: 0 });
  const [controlPoints, setControlPoints] = useState([]);
  const [isAddingControlPoint, setIsAddingControlPoint] = useState(false);

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleExportImage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'drawing.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (isAddingControlPoint) {
        setControlPoints([...controlPoints, { x, y }]);
      } else {
        setStartPosition({ x, y });
        setIsDrawing(true);
      }
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (canvas && isDrawing) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setEndPosition({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(startPosition.x, startPosition.y);

      if (controlPoints.length === 0) {
        ctx.lineTo(endPosition.x, endPosition.y);
      } else {
        ctx.bezierCurveTo(
          controlPoints[0].x, controlPoints[0].y,
          controlPoints[1].x, controlPoints[1].y,
          endPosition.x, endPosition.y
        );
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = 3; // Độ dày của đường thẳng
      ctx.stroke();

      // Reset các điểm kiểm soát
      setControlPoints([]);
    }
  };

  const toggleAddControlPoint = () => {
    setIsAddingControlPoint(!isAddingControlPoint);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">PHẦN MỀM VẼ <span>by hiubdn</span></h1>
      </header>
      <div className="main-content">
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          ></canvas>
        </div>
        <div className="toolbar">
          <button onClick={handleClearCanvas}>Xóa hết</button>
          <button onClick={handleExportImage}>Xuất ảnh</button>
          <input
            type="color"
            className="color-picker"
            value={color}
            onChange={handleColorChange}
          />
          <button onClick={toggleAddControlPoint}>
            {isAddingControlPoint ? 'Dừng thêm điểm' : 'Thêm điểm kiểm soát'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
