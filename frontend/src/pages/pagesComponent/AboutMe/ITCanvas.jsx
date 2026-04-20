import { useRef, useEffect } from 'react';

function ITCanvas() {
    const canvasRef = useRef(null);
    const angleRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        function drawGear(ctx, angle) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);

            // Thông số bánh răng
            const radius = 80;
            const teeth = 8;
            const toothWidth = 20;
            const toothHeight = 20;

            // Vẽ phần răng cưa (gai răng)
            ctx.fillStyle = '#1976d2';
            for (let i = 0; i < teeth; i++) {
                const a = (i * 2 * Math.PI) / teeth;
                const x = Math.cos(a) * (radius + 2);
                const y = Math.sin(a) * (radius + 2);
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(a);
                ctx.fillRect(-toothWidth / 2, -radius - toothHeight, toothWidth, toothHeight);
                ctx.restore();
            }

            // Vẽ thân bánh răng tròn
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();

            // Vẽ vòng tròn trắng ở giữa
            ctx.beginPath();
            ctx.arc(0, 0, radius - 30, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            // Vẽ biểu tượng </> ở giữa
            ctx.fillStyle = '#333';
            ctx.font = 'bold 36px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('</>', 0, 0);

            ctx.restore();
        }

        function animate() {
            angleRef.current += 0.01;
            drawGear(ctx, angleRef.current);
            requestAnimationFrame(animate);
        }

        animate();
    }, []);

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={300}
                height={300}
                // style={{ border: '1px solid #ccc', borderRadius: '8px' }}
            />
        </div>
    );
}

export default ITCanvas;
