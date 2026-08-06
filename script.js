const canvas = document.getElementById('networkCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray;
    
    // Canvas boyutlandırma
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Renk paleti (Neon renkler)
    const colors = ['#00ff9d', '#bd00ff', '#00d2ff']; 

    let mouse = {
        x: null,
        y: null,
        radius: 200 // Etkileşim alanını genişlettik
    }

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.baseColor = color;
            this.color = color;
            this.angle = Math.random() * 360; // Renk döngüsü için açı
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10; // Parlama efekti
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0; // Performans için diğer çizimleri etkilemesin
        }

        update() {
            // Kenarlardan sekme
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

            // Mouse etkileşimi (Manyetik itme/çekme)
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 3;
                if (mouse.x > this.x && this.x > this.size * 10) this.x -= 3;
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 3;
                if (mouse.y > this.y && this.y > this.size * 10) this.y -= 3;
            }

            // Hareket
            this.x += this.directionX;
            this.y += this.directionY;

            // Renk Döngüsü (Nefes alma efekti)
            this.angle += 0.05;
            // Renkleri hafifçe değiştirerek canlılık katıyoruz
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        // Yoğunluğu ekran boyutuna göre ayarla
        let numberOfParticles = (canvas.height * canvas.width) / 8000; 
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 3) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            // Hızları farklılaştırarak derinlik hissi ver
            let directionX = (Math.random() * 1) - 0.5; 
            let directionY = (Math.random() * 1) - 0.5;
            let color = colors[Math.floor(Math.random() * colors.length)];

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                    + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                // Bağlantı mesafesini dinamik tut
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    
                    // Çizgi rengi olarak iki noktanın ortalamasını veya sabit bir neon kullanabiliriz
                    ctx.strokeStyle = 'rgba(100, 255, 218,' + opacityValue + ')'; 
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
            
            // Fare ile bağlantı kurma (Extra özellik)
            let mouseDistance = ((particlesArray[a].x - mouse.x) * (particlesArray[a].x - mouse.x)) + ((particlesArray[a].y - mouse.y) * (particlesArray[a].y - mouse.y));
            if (mouseDistance < 20000) { // Yakındaysa çizgi çek
                 ctx.strokeStyle = 'rgba(189, 0, 255, 0.4)'; // Mor çizgiler fareye özel
                 ctx.lineWidth = 1.5;
                 ctx.beginPath();
                 ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                 ctx.lineTo(mouse.x, mouse.y);
                 ctx.stroke();
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    window.addEventListener('resize', function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    });

    window.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    })

    init();
    animate();
}