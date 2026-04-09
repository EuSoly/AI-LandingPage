document.addEventListener('DOMContentLoaded', () => {
            
    // --- 1. Mobile Menu Toggle ---
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    // --- 2. Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-md');
            navbar.classList.replace('bg-white/90', 'bg-white/98');
        } else {
            navbar.classList.remove('shadow-md');
            navbar.classList.replace('bg-white/98', 'bg-white/90');
        }
    });

    // --- 3. Integração Gemini API (Test-Drive) ---
    const btnAnalyzeAi = document.getElementById('btn-analyze-ai');
    const projectInput = document.getElementById('project-input');
    const loadingUi = document.getElementById('ai-loading');
    const resultContainer = document.getElementById('ai-result-container');
    const resultContent = document.getElementById('ai-result-content');

    // IMPORTANTE: Insira sua chave de API real do Google Gemini aqui para funcionar localmente
    const apiKey = "SUA_CHAVE_DE_API_AQUI"; 
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const systemPrompt = `
        Você é o motor de Inteligência Artificial da StratAI (um produto da Realize Hub).
        Sua tarefa é avaliar a descrição de um projeto fornecida pelo usuário e verificar o seu alinhamento com 
        um pilar estratégico genérico de 'Inovação, Transformação Digital e Eficiência'.
        
        Regras para a resposta:
        1. Seja direto, profissional e atue como um consultor sênior de dados/negócios.
        2. Comece sempre dando uma "Nota de Alinhamento" de 0% a 100%.
        3. Em seguida, escreva 2 parágrafos curtos: um destacando pontos fortes do projeto e outro sugerindo melhorias ou alertando sobre riscos no alinhamento com a estratégia.
        4. Use negrito para destacar termos chave.
    `;

    async function fetchGeminiWithRetry(prompt, retries = 5) {
        const delays = [1000, 2000, 4000, 8000, 16000];
        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
        };

        for (let i = 0; i < retries; i++) {
            try {
                if(apiKey === "SUA_CHAVE_DE_API_AQUI") {
                    throw new Error("Chave de API não configurada. Substitua 'SUA_CHAVE_DE_API_AQUI' no main.js pela sua chave real do Google Studio.");
                }

                const response = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) throw new Error(`Erro na API (Status: ${response.status})`);
                
                const data = await response.json();
                const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                
                if (!rawText) throw new Error("Resposta da IA veio vazia.");
                return rawText;

            } catch (error) {
                console.warn(`Tentativa ${i + 1} falhou. Motivo: ${error.message}`);
                if (i === retries - 1) throw error; 
                await new Promise(res => setTimeout(res, delays[i])); 
            }
        }
    }

    btnAnalyzeAi.addEventListener('click', async () => {
        const projectText = projectInput.value.trim();
        
        if (!projectText) {
            alert("Por favor, descreva um projeto antes de analisar.");
            projectInput.focus();
            return;
        }

        btnAnalyzeAi.classList.add('hidden');
        resultContainer.classList.add('hidden');
        loadingUi.classList.remove('hidden');

        try {
            const aiResponse = await fetchGeminiWithRetry(projectText);
            
            const formattedResponse = aiResponse
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
                
            resultContent.innerHTML = formattedResponse;
            
            loadingUi.classList.add('hidden');
            resultContainer.classList.remove('hidden');
            
        } catch (error) {
            loadingUi.classList.add('hidden');
            resultContainer.classList.remove('hidden');
            resultContent.innerHTML = `<span class="text-red-500 font-bold">Ocorreu um erro:</span><br>${error.message}`;
        } finally {
            btnAnalyzeAi.innerHTML = '<i class="ph-bold ph-arrows-clockwise text-xl text-realize-accent"></i> Analisar Outro Projeto';
            btnAnalyzeAi.classList.remove('hidden');
        }
    });

    // --- 4. Form Submission Handling (Lead Capture) ---
    const form = document.getElementById('lead-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('success-message');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        submitBtn.innerHTML = '<i class="ph ph-spinner animate-spin text-xl"></i> Processando Conta...';
        submitBtn.classList.add('opacity-80', 'cursor-not-allowed');
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.classList.add('hidden');
            successMsg.classList.remove('hidden');
        }, 1500);
    });

    // --- 5. Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            menu.classList.add('hidden'); 
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 6. PARTICLES.JS (EFEITO TEIA DE ARANHA) ---
    const particlesConfig = {
        "particles": {
            "number": { 
                "value": 80, 
                "density": { "enable": true, "value_area": 800 } 
            },
            "color": { "value": "#ffc800" }, 
            "shape": { "type": "circle" },
            "opacity": { 
                "value": 0.5, 
                "random": false
            },
            "size": { 
                "value": 3, 
                "random": true
            },
            "line_linked": { 
                "enable": true, 
                "distance": 150, 
                "color": "#fe7905", 
                "opacity": 0.6, 
                "width": 2
            }, 
            "move": { 
                "enable": true, 
                "speed": 2, 
                "direction": "none", 
                "random": false, 
                "straight": false, 
                "out_mode": "out", 
                "bounce": false
            }
        },
        "interactivity": {
            // AQUI ESTÁ A CHAVE: Usar "window" garante que as teias sigam o mouse
            // mesmo quando o mouse estiver em cima dos textos!
            "detect_on": "window",
            "events": {
                "onhover": { "enable": true, "mode": "grab" }, 
                "onclick": { "enable": true, "mode": "push" },
                "resize": true
            },
            "modes": {
                "grab": { "distance": 220, "line_linked": { "opacity": 1 } },
                "push": { "particles_nb": 4 }
            }
        },
        "retina_detect": true
    };

    if (document.getElementById('particles-hero')) {
        particlesJS('particles-hero', particlesConfig);
    }

    if (document.getElementById('particles-contact')) {
        particlesJS('particles-contact', particlesConfig);
    }
});