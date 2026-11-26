document.addEventListener('DOMContentLoaded', function () {
    // --- PROTECTION PAR CODE PIN (MODALE ESTHÉTIQUE) ---
    const correctPin = '6615'; // Code secret à 4 chiffres

    // On vérifie si l'utilisateur est déjà authentifié pour cette session
    if (sessionStorage.getItem('neptune_chat_auth') !== 'true') {
        const lockOverlay = document.createElement('div');
        lockOverlay.id = 'neptune-lock-overlay';
        lockOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(10, 10, 15, 0.95); z-index: 999999; display: flex; justify-content: center; align-items: center; font-family: inherit;';

        lockOverlay.innerHTML = `
            <div style="background: #161b22; border: 1px solid #30363d; padding: 30px; border-radius: 12px; text-align: center; box-shadow: 0 8px 24px rgba(0,0,0,0.5); width: 320px;">
                <h3 style="color: #00d2ff; margin-top: 0; margin-bottom: 10px; font-size: 20px;">🔒 Salon Protégé</h3>
                <p style="color: #8b949e; font-size: 14px; margin-bottom: 20px;">Entrez le code à 4 chiffres pour accéder au chat Neptune.</p>
                <form id="neptune-pin-form">
                    <input type="password" id="neptune-pin-input" maxlength="4" placeholder="••••" style="background: #0d1117; border: 1px solid #30363d; color: #fff; font-size: 24px; text-align: center; letter-spacing: 8px; padding: 10px; width: 150px; border-radius: 6px; outline: none; margin-bottom: 15px;" autofocus />
                    <br>
                    <button type="submit" style="background: #00d2ff; color: #0d1117; border: none; font-weight: bold; padding: 10px 20px; border-radius: 6px; cursor: pointer; width: 100%; font-size: 14px;">Déverrouiller</button>
                </form>
                <p id="neptune-pin-error" style="color: #ff5555; font-size: 12px; margin-top: 10px; display: none;">Code incorrect, réessayez.</p>
            </div>
        `;
        document.body.appendChild(lockOverlay);

        const pinForm = document.getElementById('neptune-pin-form');
        const pinInput = document.getElementById('neptune-pin-input');
        const pinError = document.getElementById('neptune-pin-error');

        pinForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (pinInput.value === correctPin) {
                sessionStorage.setItem('neptune_chat_auth', 'true');
                lockOverlay.style.opacity = '0';
                lockOverlay.style.transition = 'opacity 0.3s ease';
                setTimeout(() => lockOverlay.remove(), 300);
            } else {
                pinError.style.display = 'block';
                pinInput.value = '';
                pinInput.focus();
            }
        });
        return;
    }
    // --------------------------------------------------

    // --- STYLE CSS MODERNE POUR LA SCROLLBAR ---
    const customScrollStyle = document.createElement('style');
    customScrollStyle.innerHTML = `
        #neptune-chat-messages::-webkit-scrollbar {
            width: 6px;
        }
        #neptune-chat-messages::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }
        #neptune-chat-messages::-webkit-scrollbar-thumb {
            background: rgba(0, 210, 255, 0.3);
            border-radius: 10px;
            transition: background 0.2s ease;
        }
        #neptune-chat-messages::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 210, 255, 0.6);
        }
        #neptune-chat-messages {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 210, 255, 0.3) transparent;
        }
    `;
    document.head.appendChild(customScrollStyle);
    // --------------------------------------------------

    const chatBox = document.getElementById('neptune-chat-messages');
    const chatForm = document.getElementById('neptune-chat-form');
    const chatInput = document.getElementById('neptune-chat-input');
    const roomTitle = document.getElementById('neptune-current-room');

    if (!chatForm || !chatBox || !chatInput) return;

    let currentRoom = 'general';
    let currentPseudo = sessionStorage.getItem('neptune_chat_pseudo') || neptuneSettings.userPseudo || 'Membre';
    
    const defaultAvatarUrl = `${neptuneSettings.pluginUrl}assets/images/avatar.jpg`;
    let currentAvatar = sessionStorage.getItem('neptune_chat_avatar') || defaultAvatarUrl;

    const naviUrl = `${neptuneSettings.pluginUrl}assets/images/navi.png`;
    const marseyUrl = `${neptuneSettings.pluginUrl}assets/images/marsey.png`;
    const whosbroUrl = `${neptuneSettings.pluginUrl}assets/images/whosbro.gif`;

    const emojiBar = document.createElement('div');
    emojiBar.className = 'neptune-emoji-bar';
    emojiBar.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px; align-items: center; flex-wrap: wrap;';

    const emojis = ['👍', '❤️', '🔥', '😂', '⭐'];

    emojis.forEach(emo => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = emo;
        btn.style.cssText = 'background: transparent; border: 1px solid #444; color: #fff; cursor: pointer; padding: 4px 8px; border-radius: 4px; font-size: 16px;';
        btn.addEventListener('click', () => {
            chatInput.value += emo;
            chatInput.focus();
        });
        emojiBar.appendChild(btn);
    });

    const naviBtn = document.createElement('button');
    naviBtn.type = 'button';
    naviBtn.title = 'Sticker Navi';
    naviBtn.style.cssText = 'background: transparent; border: 1px solid #00d2ff; cursor: pointer; padding: 2px 6px; border-radius: 4px; display: flex; align-items: center;';
    
    const naviImg = document.createElement('img');
    naviImg.src = naviUrl;
    naviImg.alt = 'Navi';
    naviImg.style.width = '24px';
    naviImg.style.height = '24px';
    naviImg.style.objectFit = 'contain';
    
    naviBtn.appendChild(naviImg);
    naviBtn.addEventListener('click', () => {
        chatInput.value += '[navi]';
        chatInput.focus();
    });
    emojiBar.appendChild(naviBtn);

    const marseyBtn = document.createElement('button');
    marseyBtn.type = 'button';
    marseyBtn.title = 'Sticker Marsey';
    marseyBtn.style.cssText = 'background: transparent; border: 1px solid #00d2ff; cursor: pointer; padding: 2px 6px; border-radius: 4px; display: flex; align-items: center;';
    
    const marseyImg = document.createElement('img');
    marseyImg.src = marseyUrl;
    marseyImg.alt = 'Marsey';
    marseyImg.style.width = '24px';
    marseyImg.style.height = '24px';
    marseyImg.style.objectFit = 'contain';
    
    marseyBtn.appendChild(marseyImg);
    marseyBtn.addEventListener('click', () => {
        chatInput.value += '[marsey]';
        chatInput.focus();
    });
    emojiBar.appendChild(marseyBtn);

    chatForm.parentNode.insertBefore(emojiBar, chatForm);

    let bloodOverlay = document.getElementById('neptune-blood-overlay');
    if (!bloodOverlay) {
        bloodOverlay = document.createElement('div');
        bloodOverlay.id = 'neptune-blood-overlay';
        document.body.appendChild(bloodOverlay);
    }

    let rainbowOverlay = document.getElementById('neptune-rainbow-overlay');
    if (!rainbowOverlay) {
        rainbowOverlay = document.createElement('div');
        rainbowOverlay.id = 'neptune-rainbow-overlay';
        document.body.appendChild(rainbowOverlay);
    }

    function triggerBloodEffect() {
        if (!bloodOverlay) return;
        bloodOverlay.classList.add('active');
        setTimeout(() => {
            bloodOverlay.classList.remove('active');
        }, 3000);
    }

    function triggerRainbowEffect() {
        if (!rainbowOverlay) return;
        rainbowOverlay.classList.add('active');
        setTimeout(() => {
            rainbowOverlay.classList.remove('active');
        }, 4000);
    }

    function loadMessages() {
        fetch(`${neptuneSettings.restUrl}chat?room=${encodeURIComponent(currentRoom)}`, {
            headers: { 'X-WP-Nonce': neptuneSettings.nonce }
        })
        .then(response => {
            if (!response.ok) throw new Error('Erreur réseau / API');
            return response.json();
        })
        .then(messages => {
            chatBox.innerHTML = '';
            if (Array.isArray(messages)) {
                messages.forEach(msg => appendMessage(msg));
            }
            chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch(err => console.error('Erreur de chargement :', err));
    }

    function appendMessage(msg) {
        const div = document.createElement('div');
        div.className = 'neptune-chat-message';
        div.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        const time = msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        
        let parsedText = msg.text;
        const naviStickerHtml = `<img src="${naviUrl}" alt="Navi" class="neptune-chat-sticker" style="width: 28px; height: 28px; vertical-align: middle; display: inline-block;" />`;
        const marseyStickerHtml = `<img src="${marseyUrl}" alt="Marsey" class="neptune-chat-sticker" style="width: 28px; height: 28px; vertical-align: middle; display: inline-block;" />`;
        
        // Formattage des tags système / images / actions
        parsedText = parsedText.replace(/\[whosbro:(.*?)\]/g, (match, p1) => {
            return `<span style="color:#00d2ff; font-style:italic;">[Système] Regardez ${escapeHtml(p1)} :</span><br><img src="${whosbroUrl}" alt="whosbro" style="max-width: 200px; border-radius: 8px; border: 1px solid #30363d; margin-top: 6px; display: block;" />`;
        });

        parsedText = parsedText.replace(/\[guide_ui\]/g, () => {
            return `<div style="background: #161b22; border: 1px solid #30363d; padding: 12px; border-radius: 8px; margin-top: 6px;">
                <strong style="color: #00d2ff; display: block; margin-bottom: 6px;">📖 Guide complet des commandes :</strong>
                <ul style="margin: 0; padding-left: 18px; color: #c9d1d9; font-size: 13px; line-height: 1.5;">
                    <li><code>/pseudo [nom]</code> ou <code>/nick [nom]</code> : Change ton pseudo.</li>
                    <li><code>/avatar [url]</code> ou <code>/pfp [url]</code> : Change ton avatar.</li>
                    <li><code>/join [salon]</code> : Change de salon de discussion.</li>
                    <li><code>/clear</code> : Efface l'historique du salon actuel.</li>
                    <li><code>/whosbro [pseudo]</code> ou <code>/rdm [pseudo]</code> : Affiche le GIF personnalisé.</li>
                    <li><code>/tp wpd</code> : Téléporte / redirige vers un lien fixe.</li>
                    <li><code>/rdm tp</code> : Téléporte vers un lien aléatoire rigolo !</li>
                    <li><code>/musique [url]</code> : Partage un lien de musique cliquable.</li>
                    <li><code>/me [action]</code> : Envoie une action textuelle.</li>
                    <li><code>/roll [max]</code> : Tire un dé aléatoire (ex: /roll 50).</li>
                    <li><code>/flip</code> ou <code>/coin</code> : Pile ou face.</li>
                    <li><code>/slap [pseudo]</code> : Donne une claque virtuelle.</li>
                    <li><code>/hug [pseudo]</code> : Fait un câlin virtuel.</li>
                    <li><code>/afk [raison]</code> : Signale ton absence.</li>
                    <li><code>/time</code> : Affiche l'heure exacte.</li>
                    <li><code>/ping</code> : Teste la latence.</li>
                    <li><code>/guide</code> : Affiche ce panneau d'aide.</li>
                    <li><code>/wdp</code> ou <code>/gay</code> : Active les effets visuels spéciaux.</li>
                </ul>
            </div>`;
        });

        if (!parsedText.includes('<img') && !parsedText.includes('[Système]') && !parsedText.includes('guide_ui') && !parsedText.includes('div') && !parsedText.includes('audio') && !parsedText.includes('<a ')) {
            parsedText = escapeHtml(parsedText);
        }

        parsedText = parsedText.replace(/\[navi\]/g, naviStickerHtml);
        parsedText = parsedText.replace(/\[marsey\]/g, marseyStickerHtml);

        const msgAuthor = msg.pseudonym || currentPseudo;
        const msgAvatar = (msgAuthor === currentPseudo) ? currentAvatar : defaultAvatarUrl;

        let deleteBtnHtml = '';
        if (msgAuthor === currentPseudo) {
            deleteBtnHtml = `<button type="button" class="neptune-delete-msg-btn" data-id="${msg.id}" style="background: transparent; border: none; color: #ff5555; cursor: pointer; font-size: 11px; margin-left: 8px;" title="Supprimer ce message">🗑️ Supprimer</button>`;
        }

        div.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <img src="${msgAvatar}" alt="Avatar" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; flex-shrink: 0; margin-top: 2px;" />
                <div style="flex-grow: 1;">
                    <span style="color:#888;">[${time}]</span>
                    <strong style="color:#00d2ff;">${escapeHtml(msgAuthor)} :</strong>
                    <span>${parsedText}</span>${deleteBtnHtml}
                </div>
            </div>
        `;

        const delBtn = div.querySelector('.neptune-delete-msg-btn');
        if (delBtn) {
            delBtn.addEventListener('click', () => {
                div.style.opacity = '0';
                div.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    deleteSingleMessage(msg.id);
                }, 200);
            });
        }

        chatBox.appendChild(div);
    }

    function deleteSingleMessage(messageId) {
        fetch(`${neptuneSettings.restUrl}chat?id=${messageId}`, {
            method: 'DELETE',
            headers: { 'X-WP-Nonce': neptuneSettings.nonce }
        })
        .then(response => {
            if (!response.ok) throw new Error('Erreur lors de la suppression');
            return response.json();
        })
        .then(() => loadMessages())
        .catch(err => console.error('Erreur suppression :', err));
    }

    chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        const lowerText = text.toLowerCase();

        // 1. Commande : Changer de pseudo (/pseudo ou /nick)
        if (lowerText.startsWith('/pseudo ') || lowerText.startsWith('/nick ')) {
            const newPseudo = text.replace(/^\/(pseudo|nick)\s+/, '').trim();
            if (newPseudo) {
                currentPseudo = newPseudo;
                sessionStorage.setItem('neptune_chat_pseudo', currentPseudo);
                
                const sysDiv = document.createElement('div');
                sysDiv.className = 'neptune-chat-message';
                sysDiv.innerHTML = `<span style="color:#00d2ff; font-style:italic;">[Système] Votre pseudo est désormais : ${escapeHtml(currentPseudo)}</span>`;
                chatBox.appendChild(sysDiv);
                chatBox.scrollTop = chatBox.scrollHeight;
            }
            chatInput.value = '';
            return;
        }

        // 2. Commande : Changer d'avatar (/avatar ou /pfp)
        if (lowerText.startsWith('/avatar ') || lowerText.startsWith('/pfp ')) {
            const newAvatarUrl = text.replace(/^\/(avatar|pfp)\s+/, '').trim();
            if (newAvatarUrl) {
                currentAvatar = newAvatarUrl;
                sessionStorage.setItem('neptune_chat_avatar', currentAvatar);
                
                const sysDiv = document.createElement('div');
                sysDiv.className = 'neptune-chat-message';
                sysDiv.innerHTML = `<span style="color:#00d2ff; font-style:italic;">[Système] Votre photo de profil a été mise à jour !</span>`;
                chatBox.appendChild(sysDiv);
                chatBox.scrollTop = chatBox.scrollHeight;
            }
            chatInput.value = '';
            return;
        }

        // 3. Commandes d'effets visuels (Sang / Gay)
        if (lowerText === 'wdp' || lowerText === '/wdp' || lowerText === '/wpd') {
            triggerBloodEffect();
            chatInput.value = '';
            return;
        }

        if (lowerText === '/gay') {
            triggerRainbowEffect();
            chatInput.value = '';
            return;
        }

        // --- COMMANDE : /rdm tp (Redirection vers un lien aléatoire rigolo) ---
        if (lowerText === '/rdm tp' || lowerText === '/rdmtp') {
            chatInput.value = '';
            
            const randomUrls = [
                'https://fr.wikipedia.org/wiki/Sp%C3%A9cial:Au_hasard',
                'https://thezen.zone/',
                'https://pointerpointer.com/',
                'https://cat-bounce.com/',
                'https://longdogechallenge.com/',
                'https://neal.fun/'
            ];
            
            const randomIndex = Math.floor(Math.random() * randomUrls.length);
            const selectedUrl = randomUrls[randomIndex];
            
            window.open(selectedUrl, '_blank');
            return;
        }

        // --- COMMANDE : /tp wpd (Redirection vers un lien fixe) ---
        if (lowerText === '/tp wpd' || lowerText === '/tpwpd') {
            chatInput.value = '';
            const targetUrl = 'https://exemple.com'; 
            window.open(targetUrl, '_blank');
            return;
        }

        // --- COMMANDE : /musique ou /music [url] ---
        if (lowerText.startsWith('/musique') || lowerText.startsWith('/music')) {
            const musicUrl = text.replace(/^\/(musique|music)\s*/i, '').trim();
            if (musicUrl) {
                const musicHtml = `<a href="${musicUrl}" target="_blank" style="color: #ff7700; font-weight: bold; text-decoration: underline;">🎧 Écouter le son (SoundCloud / Autre)</a>`;
                const msg = `partage une musique : ${musicHtml}`;

                fetch(`${neptuneSettings.restUrl}chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': neptuneSettings.nonce },
                    body: JSON.stringify({ room: currentRoom, text: msg, pseudonym: currentPseudo })
                }).then(() => { chatInput.value = ''; loadMessages(); });
            }
            chatInput.value = '';
            return;
        }

        // 4. Commande de changement de salon (/join)
        if (lowerText.startsWith('/join ')) {
            const newRoom = text.replace('/join ', '').trim();
            if (newRoom) {
                currentRoom = newRoom;
                if (roomTitle) roomTitle.textContent = `#${currentRoom}`;
                chatInput.value = '';
                loadMessages();
            }
            return;
        }

        // 5. Commande de nettoyage de salon (/clear)
        if (lowerText === '/clear') {
            fetch(`${neptuneSettings.restUrl}chat?room=${encodeURIComponent(currentRoom)}`, {
                method: 'DELETE',
                headers: { 'X-WP-Nonce': neptuneSettings.nonce }
            })
            .then(response => {
                if (!response.ok) throw new Error('Erreur lors du nettoyage');
                return response.json();
            })
            .then(() => {
                chatBox.innerHTML = '';
                chatInput.value = '';
            })
            .catch(err => console.error('Erreur :', err));
            return;
        }

        // 6. Commande : /whosbro ou /rdm [pseudo] pour afficher l'image persistante
        if (lowerText.startsWith('/whosbro ') || lowerText.startsWith('/rdm ')) {
            const targetUser = text.replace(/^\/(whosbro|rdm)\s+/, '').trim();
            if (targetUser) {
                const commandMessage = `[whosbro:${targetUser}]`;
                
                fetch(`${neptuneSettings.restUrl}chat`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'X-WP-Nonce': neptuneSettings.nonce 
                    },
                    body: JSON.stringify({ 
                        room: currentRoom, 
                        text: commandMessage, 
                        pseudonym: currentPseudo 
                    })
                })
                .then(response => {
                    if (!response.ok) throw new Error('Erreur lors de l\'envoi de la commande');
                    return response.json();
                })
                .then(() => {
                    chatInput.value = '';
                    loadMessages();
                })
                .catch(err => console.error('Erreur :', err));
            }
            return;
        }

        // --- COMMANDES CACHÉES INTÉGRÉES ---

        // Commande /guide
        if (lowerText === '/guide') {
            fetch(`${neptuneSettings.restUrl}chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': neptuneSettings.nonce },
                body: JSON.stringify({ room: currentRoom, text: '[guide_ui]', pseudonym: 'Système' })
            }).then(() => { chatInput.value = ''; loadMessages(); });
            return;
        }

        // Commande /me
        if (lowerText.startsWith('/me ')) {
            const actionText = text.replace(/^\/me\s+/, '').trim();
            if (actionText) {
                const msg = `<span style="color: #ff7b72; font-style: italic;">* ${escapeHtml(currentPseudo)} ${escapeHtml(actionText)} *</span>`;
                fetch(`${neptuneSettings.restUrl}chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': neptuneSettings.nonce },
                    body: JSON.stringify({ room: currentRoom, text: msg, pseudonym: '' })
                }).then(() => { chatInput.value = ''; loadMessages(); });
            }
            return;
        }

        // Commande /roll
        if (lowerText.startsWith('/roll')) {
            const arg = text.replace(/^\/roll\s*/, '').trim();
            let max = parseInt(arg, 10);
            if (isNaN(max) || max <= 0) max = 100;
            const res = Math.floor(Math.random() * max) + 1;
            const msg = `<span style="color: #d2a8ff; font-weight: bold;">🎲 ${escapeHtml(currentPseudo)} a lancé un dé (1-${max}) : ${res}</span>`;
            fetch(`${neptuneSettings.restUrl}chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': neptuneSettings.nonce },
                body: JSON.stringify({ room: currentRoom, text: msg, pseudonym: '' })
            }).then(() => { chatInput.value = ''; loadMessages(); });
            return;
        }

        // Commande /flip
        if (lowerText === '/flip' || lowerText === '/coin') {
            const res = Math.random() < 0.5 ? '🪙 Pile !' : '🪙 Face !';
            const msg = `<span style="color: #e3b341; font-weight: bold;">${escapeHtml(currentPseudo)} a lancé une pièce : ${res}</span>`;
            fetch(`${neptuneSettings.restUrl}chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': neptuneSettings.nonce },
                body: JSON.stringify({ room: currentRoom, text: msg, pseudonym: '' })
            }).then(() => { chatInput.value = ''; loadMessages(); });
            return;
        }

        // Commande /slap
        if (lowerText.startsWith('/slap ')) {
            const target = text.replace(/^\/slap\s+/, '').trim();
            if (target) {
                const msg = `<span style="color: #ff7b72; font-style: italic;">👋 ${escapeHtml(currentPseudo)} donne une claque à ${escapeHtml(target)} ! Ouch !</span>`;
                fetch(`${neptuneSettings.restUrl}chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': neptuneSettings.nonce },
                    body: JSON.stringify({ room: currentRoom, text: msg, pseudonym: '' })
                }).then(() => { chatInput.value = ''; loadMessages(); });
            }
            return;
        }

        // Commande /hug
        if (lowerText.startsWith('/hug ')) {
            const target = text.replace(/^\/hug\s+/, '').trim();
            if (target) {
                const msg = `<span style="color: #f778ba; font-style: italic;">🤗 ${escapeHtml(currentPseudo)} fait un gros câlin chaleureux à ${escapeHtml(target)} ! ❤️</span>`;
                fetch(`${neptuneSettings.restUrl}chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': neptuneSettings.nonce },
                    body: JSON.stringify({ room: currentRoom, text: msg, pseudonym: '' })
                }).then(() => { chatInput.value = ''; loadMessages(); });
            }
            return;
        }

        // Commande /afk
        if (lowerText.startsWith('/afk')) {
            const reason = text.replace(/^\/afk\s*/, '').trim() || 'Absent';
            const msg = `<span style="color: #ffa657; font-style: italic;">💤 ${escapeHtml(currentPseudo)} est maintenant absent (AFK) : ${escapeHtml(reason)}</span>`;
            fetch(`${neptuneSettings.restUrl}chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': neptuneSettings.nonce },
                body: JSON.stringify({ room: currentRoom, text: msg, pseudonym: '' })
            }).then(() => { chatInput.value = ''; loadMessages(); });
            return;
        }

        // Commande /time
        if (lowerText === '/time') {
            const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const msg = `<span style="color: #79c0ff; font-style: italic;">⏰ Heure actuelle : ${now}</span>`;
            fetch(`${neptuneSettings.restUrl}chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': neptuneSettings.nonce },
                body: JSON.stringify({ room: currentRoom, text: msg, pseudonym: 'Système' })
            }).then(() => { chatInput.value = ''; loadMessages(); });
            return;
        }

        // Commande /ping
        if (lowerText === '/ping') {
            const start = performance.now();
            fetch(`${neptuneSettings.restUrl}chat?room=${encodeURIComponent(currentRoom)}`, {
                headers: { 'X-WP-Nonce': neptuneSettings.nonce }
            }).then(() => {
                const latency = Math.round(performance.now() - start);
                const msg = `<span style="color: #7ee787; font-style: italic;">🏓 Pong ! Latence : ${latency}ms</span>`;
                fetch(`${neptuneSettings.restUrl}chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': neptuneSettings.nonce },
                    body: JSON.stringify({ room: currentRoom, text: msg, pseudonym: 'Système' })
                }).then(() => { chatInput.value = ''; loadMessages(); });
            });
            chatInput.value = '';
            return;
        }

        // 7. Envoi d'un message classique
        fetch(`${neptuneSettings.restUrl}chat`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'X-WP-Nonce': neptuneSettings.nonce 
            },
            body: JSON.stringify({ 
                room: currentRoom, 
                text: text, 
                pseudonym: currentPseudo 
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => { throw errData; });
            }
            return response.json();
        })
        .then(() => {
            chatInput.value = '';
            loadMessages();
        })
        .catch(err => {
            console.error('Erreur lors de l\'envoi du message :', err);
        });
    });

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    loadMessages();
    setInterval(loadMessages, 5000);
});