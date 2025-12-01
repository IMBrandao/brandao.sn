// === Simulador oficial (referência teste.html.txt) ===
const database = {
    abel: { email: 'abel.tuter@example.com', name: 'Abel Tuter' },
    abraham: { email: 'alincoln@usa.gov', name: 'Abraham Lincoln' },
    system: { email: 'admin@service-now.com', name: 'System Administrator' }
};

const AUTO_MODE_SPEED = 0.5;

let currentStepIndex = -1;
let autoPlayTimer = null;
let selectedUser = null;
const timelineEl = document.getElementById('debug-timeline');
let timelineAutoScrollLocked = false;

if (timelineEl) {
    timelineEl.addEventListener('scroll', () => {
        const nearBottom = (timelineEl.scrollTop + timelineEl.clientHeight) >= (timelineEl.scrollHeight - 4);
        timelineAutoScrollLocked = !nearBottom;
    });
}

const steps = [
    {
        name: 'init',
        delay: 500,
        action: () => {
            const loader = document.getElementById('field-spinner');
            const emailField = document.getElementById('u_email');

            document.getElementById('debug-timeline').innerHTML = '';
            document.getElementById('anim-waiter').className = 'anim-actor actor-waiter';
            document.getElementById('anim-cook').classList.remove('cooking-animation');

            resetBubbles();

            loader.style.display = 'block';
            emailField.value = '...';

            addTimelineLog(`<strong>Client Script</strong> acionado pelo evento 'onChange'.`, 'client');
        }
    },
    {
        name: 'prepare',
        delay: 1000,
        action: () => {
            updateBubble('bubble-client', `Preciso do email de ${selectedUser}!`, true);
            addTimelineLog(`Preparando <strong>GlideAjax('UserDataHelper')</strong>...`, 'client');
        }
    },
    {
        name: 'send',
        delay: 1500,
        action: () => {
            updateBubble('bubble-client', '', false);
            updateBubble('bubble-waiter', 'Deixa comigo!', true);
            document.getElementById('anim-waiter').classList.add('move-to-server');
            addTimelineLog(`Enviando parâmetro: <code>sysparm_user_id = ${selectedUser}</code>`, 'client');

            const speed = getSpeed();
            const duration = 1.5 / resolveSpeedValue(speed) + 's';
            document.getElementById('anim-waiter').style.transitionDuration = duration;
        }
    },
    {
        name: 'server_receive',
        delay: 1000,
        action: () => {
            updateBubble('bubble-waiter', '', false);
            document.getElementById('anim-cook').classList.add('cooking-animation');
            updateBubble('bubble-server', 'Consultando BD...', true);

            addTimelineLog(`<strong>Script Include</strong> recebeu a requisição.`, 'server');
            addTimelineLog(`Executando Query: <code>GlideRecordSecure('sys_user')</code> para ID: ${selectedUser}`, 'server');
        }
    },
    {
        name: 'server_process',
        delay: 1000,
        action: () => {
            const userData = database[selectedUser];
            updateBubble('bubble-server', `Achei! É ${userData ? userData.email : 'N/A'}`, true);
            if (userData) {
                addTimelineLog(`Registro encontrado! <br>Retornando email: <span class="log-highlight">${userData.email}</span>`, 'server');
            }
        }
    },
    {
        name: 'return',
        delay: 1500,
        action: () => {
            updateBubble('bubble-server', '', false);
            document.getElementById('anim-cook').classList.remove('cooking-animation');
            updateBubble('bubble-waiter', 'Levando resposta!', true);
            document.getElementById('anim-waiter').classList.remove('move-to-server');
        }
    },
    {
        name: 'callback',
        delay: 2000,
        action: () => {
            const userData = database[selectedUser];
            updateBubble('bubble-waiter', '', false);
            updateBubble('bubble-client', 'Obrigado!', true);

            document.getElementById('field-spinner').style.display = 'none';
            if (userData) {
                document.getElementById('u_email').value = userData.email;
            }

            addTimelineLog(`<strong>Callback Function</strong> recebeu a resposta do servidor.`, 'client');
            addTimelineLog(`Atualizando campo: <code>g_form.setValue('u_email', ...)</code>`, 'client');

            setTimeout(() => updateBubble('bubble-client', '', false), 1500);
        }
    }
];

function toggleControls() {
    const speed = document.getElementById('speed-control').value;
    const stepControls = document.getElementById('step-controls');
    stepControls.style.display = speed === 'step' ? 'flex' : 'none';
}

function getSpeed() {
    const val = document.getElementById('speed-control').value;
    return val === 'step' ? 'step' : parseFloat(val);
}

function resolveSpeedValue(speed) {
    return speed === 'step' ? AUTO_MODE_SPEED : speed;
}

function startSimulation(userId) {
    if (!userId) {
        document.getElementById('u_email').value = '';
        return;
    }

    resetAll();
    selectedUser = userId;
    currentStepIndex = -1;
    const speed = getSpeed();

    if (speed === 'step') {
        manualStep(1);
    } else {
        runNextAutoStep();
    }
}

function runNextAutoStep() {
    if (currentStepIndex >= steps.length - 1) return;
    currentStepIndex += 1;
    steps[currentStepIndex].action();
    const speed = getSpeed();
    const delay = steps[currentStepIndex].delay / resolveSpeedValue(speed);
    autoPlayTimer = setTimeout(runNextAutoStep, delay);
}

function manualStep(direction) {
    const callerId = document.getElementById('caller_id').value;
    if (!callerId) {
        const select = document.getElementById('caller_id');
        select.style.borderColor = '#c0392b';
        setTimeout(() => (select.style.borderColor = ''), 500);

        const timeline = document.getElementById('debug-timeline');
        if (timeline.querySelector('.timeline-placeholder')) {
            timeline.innerHTML = '';
        }

        const lastLog = timeline.lastElementChild;
        const msg = "Selecione um <strong>Caller</strong> para iniciar a simulação.";
        if (!lastLog || !lastLog.innerHTML.includes(msg)) {
            addTimelineLog(`<span style="color:#e74c3c"><i class="fa-solid fa-triangle-exclamation"></i> ${msg}</span>`, 'server');
        }
        return;
    }

    if (!selectedUser) selectedUser = callerId;

    if (direction === 1) {
        if (currentStepIndex < steps.length - 1) {
            currentStepIndex += 1;
            steps[currentStepIndex].action();
        }
    } else {
        if (currentStepIndex > 0) {
            const targetIndex = currentStepIndex - 1;
            resetVisualsForReplay();
            for (let i = 0; i <= targetIndex; i += 1) {
                steps[i].action();
            }
            currentStepIndex = targetIndex;
        } else if (currentStepIndex === 0) {
            resetAll();
        }
    }
}

function resetAll() {
    clearTimeout(autoPlayTimer);
    currentStepIndex = -1;
    const timeline = document.getElementById('debug-timeline');
    if (timeline) {
        timeline.innerHTML = `
        <div class="timeline-placeholder">
            <i class="fa-regular fa-comments fa-2x"></i><br>
            Selecione um usuário para iniciar...
        </div>
        `;
        timeline.scrollTop = 0;
    }
    timelineAutoScrollLocked = false;
    document.getElementById('field-spinner').style.display = 'none';
    document.getElementById('u_email').value = '';
    resetVisualsForReplay();
}

function resetVisualsForReplay() {
    const waiter = document.getElementById('anim-waiter');
    waiter.className = 'anim-actor actor-waiter';
    waiter.style.transitionDuration = '0s';
    document.getElementById('anim-cook').classList.remove('cooking-animation');
    resetBubbles();
    void waiter.offsetWidth;
    const restoredDuration = 1.5 / resolveSpeedValue(getSpeed()) + 's';
    waiter.style.transitionDuration = restoredDuration;
}

function addTimelineLog(message, type) {
    const timeline = timelineEl || document.getElementById('debug-timeline');
    if (!timeline) return;
    const lastEntry = timeline.lastElementChild;
    if (lastEntry && lastEntry.innerHTML.includes(message)) return;
    const time = new Date().toLocaleTimeString('pt-BR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const bubble = document.createElement('div');
    bubble.className = `log-entry log-${type}`;
    bubble.innerHTML = `${message}<span class="log-time">${time}</span>`;
    timeline.appendChild(bubble);
    if (!timelineAutoScrollLocked) {
        timeline.scrollTop = timeline.scrollHeight;
    }
}

function updateBubble(id, text, show) {
    const el = document.getElementById(id);
    if (text) el.innerText = text;
    if (show) el.classList.add('visible');
    else el.classList.remove('visible');
}

function resetBubbles() {
    updateBubble('bubble-client', '', false);
    updateBubble('bubble-waiter', '', false);
    updateBubble('bubble-server', '', false);
}

window.startSimulation = startSimulation;
window.manualStep = manualStep;
window.toggleControls = toggleControls;
window.resetAll = resetAll;

toggleControls();
