document.addEventListener('DOMContentLoaded', function () {
    const chatBox = document.getElementById('neptune-chat-messages');
    const chatForm = document.getElementById('neptune-chat-form');
    const chatInput = document.getElementById('neptune-chat-input');
    const roomTitle = document.getElementById('neptune-current-room');

    if (!chatForm || !chatBox || !chatInput) return;

    let currentRoom = 'general';

    // URL du sticker personnalisé basé sur l'URL du plugin
    const stickerUrl = `${neptuneSettings.pluginUrl}assets/images/marsey.png`;

    // Création de la barre d'émojis / stickers au-dessus du formulaire de chat
    const emojiBar = document.createElement('div');
    emojiBar.className = 'neptune-emoji-bar';
    emojiBar.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px; align-items: center; flex-wrap: wrap;';

    // Liste des émojis de base
    const emojis = ['👍', '❤️', '🔥', '😂', '⭐'];

    // Ajout des émojis classiques
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

    // Ajout du bouton pour le sticker Marsey personnalisé
    const stickerBtn = document.createElement('button');
    stickerBtn.type = 'button';
    stickerBtn.title = 'Sticker Marsey';
    stickerBtn.style.cssText = 'background: transparent; border: 1px solid #00d2ff; cursor: pointer; padding: 2px 6px; border-radius: 4px; display: flex; align-items: center;';
    
    const stickerImg = document.createElement('img');
    stickerImg.src = stickerUrl;
    stickerImg.alt = 'Marsey';
    stickerImg.style.width = '24px';
    stickerImg.style.height = '24px';
    stickerImg.style.objectFit = 'contain';
    
    stickerBtn.appendChild(stickerImg);
    stickerBtn.addEventListener('click', () => {
        chatInput.value += '[marsey]';
        chatInput.focus();
    });
    emojiBar.appendChild(stickerBtn);

    // Insérer la barre d'outils juste avant le formulaire
    chatForm.parentNode.insertBefore(emojiBar, chatForm);

    // S'assure que l'overlay de sang existe dès le chargement
    let bloodOverlay = document.getElementById('neptune-blood-overlay');
    if (!bloodOverlay) {
        bloodOverlay = document.createElement('div');
        bloodOverlay.id = 'neptune-blood-overlay';
        document.body.appendChild(bloodOverlay);
    }

    // S'assure que l'overlay arc-en-ciel existe dès le chargement
    let rainbowOverlay = document.getElementById('neptune-rainbow-overlay');
    if (!rainbowOverlay) {
        rainbowOverlay = document.createElement('div');
        rainbowOverlay.id = 'neptune-rainbow-overlay';
        document.body.appendChild(rainbowOverlay);
    }

    // Fonction pour déclencher l'effet visuel de sang
    function triggerBloodEffect() {
        if (!bloodOverlay) return;
        bloodOverlay.classList.add('active');
        setTimeout(() => {
            bloodOverlay.classList.remove('active');
        }, 3000);
    }

    // Fonction pour déclencher l'effet multicolore (/gay)
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
        const time = msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        
        // Sécurisation du texte et conversion du raccourci [marsey] en image de sticker
        let parsedText = escapeHtml(msg.text);
        const renderedStickerHtml = `<img src="${stickerUrl}" alt="Marsey" style="width: 28px; height: 28px; vertical-align: middle; display: inline-block;" />`;
        parsedText = parsedText.replace(/\[marsey\]/g, renderedStickerHtml);

        // Bouton de suppression affiché uniquement si le message appartient à l'utilisateur actuel
        let deleteBtnHtml = '';
        if (msg.pseudonym === (neptuneSettings.userPseudo || 'Membre')) {
            deleteBtnHtml = `<button type="button" class="neptune-delete-msg-btn" data-id="${msg.id}" style="background: transparent; border: none; color: #ff5555; cursor: pointer; font-size: 11px; margin-left: 8px;" title="Supprimer ce message">🗑️ Supprimer</button>`;
        }

        div.innerHTML = `
            <div>
                <span style="color:#888;">[${time}]</span>
                <strong style="color:#00d2ff;">${escapeHtml(msg.pseudonym)} :</strong>
                <span>${parsedText}</span>${deleteBtnHtml}
            </div>
        `;

        // Écouteur pour supprimer un message individuel
        const delBtn = div.querySelector('.neptune-delete-msg-btn');
        if (delBtn) {
            delBtn.addEventListener('click', () => {
                if (confirm('Voulez-vous vraiment supprimer ce message ?')) {
                    deleteSingleMessage(msg.id);
                }
            });
        }

        chatBox.appendChild(div);
    }

    // Fonction pour supprimer un seul message via l'API REST
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

        // 1. Interception : Effet de sang (wdp, /wdp, /wpd)
        if (lowerText === 'wdp' || lowerText === '/wdp' || lowerText === '/wpd') {
            triggerBloodEffect();
            chatInput.value = '';
            return;
        }

        // 2. Interception : Effet multicolore (/gay)
        if (lowerText === '/gay') {
            triggerRainbowEffect();
            chatInput.value = '';
            return;
        }

        // 3. Interception de la commande /join
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

        // 4. Interception de la commande /clear pour effacer les messages
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

        // 5. Envoi du message classique via l'API REST
        fetch(`${neptuneSettings.restUrl}chat`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'X-WP-Nonce': neptuneSettings.nonce 
            },
            body: JSON.stringify({ 
                room: currentRoom, 
                text: text, 
                pseudonym: neptuneSettings.userPseudo || 'Membre' 
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
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    loadMessages();
    setInterval(loadMessages, 5000);
});