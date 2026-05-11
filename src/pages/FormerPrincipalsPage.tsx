import React, { useEffect, useRef } from 'react';
import FormerLeadersPage from './FormerLeadersPage';
import { AppData } from '../types';
import paper from 'paper';

const FormerPrincipalsPage = ({ data }: { data: AppData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    paper.setup(canvas);

    const width = paper.view.size.width;
    const height = paper.view.size.height;

    // Create some floating decorative circles
    const circles: paper.Path.Circle[] = [];
    const count = 15;

    for (let i = 0; i < count; i++) {
      const center = paper.Point.random().multiply(paper.view.size);
      const radius = Math.random() * 50 + 10;
      const circle = new paper.Path.Circle(center, radius);
      circle.fillColor = new paper.Color(0.85, 0.7, 0.2, 0.05); // school-gold like color with very low opacity
      circles.push(circle);
    }

    paper.view.onFrame = (event: any) => {
      circles.forEach((circle, index) => {
        circle.position.y += Math.sin(event.time + index) * 0.5;
        circle.position.x += Math.cos(event.time + index) * 0.2;

        if (circle.position.y > paper.view.size.height + circle.bounds.height) {
          circle.position.y = -circle.bounds.height;
        }
        if (circle.position.x > paper.view.size.width + circle.bounds.width) {
          circle.position.x = -circle.bounds.width;
        }
      });
    };

    const handleResize = () => {
      paper.view.viewSize = new paper.Size(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      paper.project?.remove();
    };
  }, []);

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none opacity-50 z-0 h-full w-full"
      />
      <div className="relative z-10">
        <FormerLeadersPage 
          data={data} 
          type="Principal" 
          title="Principals" 
          description="Visionary leaders who have steered our academic journey and nurtured countless students since 1941."
        />
      </div>
    </div>
  );
};

export default FormerPrincipalsPage;
