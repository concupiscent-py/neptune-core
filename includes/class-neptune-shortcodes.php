<?php
defined( 'ABSPATH' ) || exit;

/**
 * Classe de gestion des shortcodes du plugin Neptune Core.
 * Gère l'affichage des différentes pages thématiques et du chat protégé.
 */
class Neptune_Shortcodes {

    /**
     * Initialisation des shortcodes du plugin.
     */
    public function init() {
        add_shortcode( 'neptune_chat', array( $this, 'render_chat_shortcode' ) );
        add_shortcode( 'neptune_home', array( $this, 'render_home_template' ) );
        add_shortcode( 'neptune_gallery', array( $this, 'render_gallery_template' ) );
        add_shortcode( 'neptune_about', array( $this, 'render_about_template' ) );
    }

    /**
     * Rendu du shortcode du chat avec protection intégrée et affichage sécurisé.
     */
    public function render_chat_shortcode( $atts ) {
        // Vérification de connexion WordPress de base requise pour le chat
        if ( ! is_user_logged_in() ) {
            return '<p style="color: #fff; text-align: center; padding: 20px;">Veuillez vous connecter pour accéder au chat Neptune.</p>';
        }

        $avatar_url = plugin_dir_url( dirname( __FILE__ ) ) . 'assets/images/avatar.jpg';

        ob_start();
        ?>
        <div class="neptune-chat-wrapper">
            <div class="neptune-chat-header">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="<?php echo esc_url( $avatar_url ); ?>" alt="Avatar" class="neptune-avatar" />
                    <span>Salon actuel : <strong id="neptune-current-room">#general</strong></span>
                </div>
            </div>
            
            <div id="neptune-chat-messages" class="neptune-chat-box"></div>

            <form id="neptune-chat-form" class="neptune-chat-form-box">
                <input type="text" id="neptune-chat-input" placeholder="Tapez un message ou /join nom_du_salon..." autocomplete="off" />
                <button type="submit">Envoyer</button>
            </form>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Rendu de la page d'accueil personnalisée Neptune.
     */
    public function render_home_template( $atts ) {
        $avatar_url = plugin_dir_url( dirname( __FILE__ ) ) . 'assets/images/avatar.jpg';

        ob_start();
        ?>
        <div class="neptune-home-container">
            <div class="neptune-home-avatar-box">
                <img src="<?php echo esc_url( $avatar_url ); ?>" alt="Avatar Neptune" />
            </div>
            <h1>Neptune Core</h1>
            <p class="neptune-subtitle">Votre univers sombre, immersif et interactif.</p>

            <div class="neptune-features-grid">
                <div class="neptune-feature-card">
                    <h3>💬 Chat Multi-Salons</h3>
                    <p>Rejoignez le salon général ou créez votre propre espace de discussion en un clin d'œil avec la commande <code>/join</code>.</p>
                </div>
                <div class="neptune-feature-card">
                    <h3>🌙 delice pour les yeux</h3>
                    <p>Une interface entièrement pensée pour le confort visuel, aux tons profonds et élégants.</p>
                </div>
                <div class="neptune-feature-card">
                    <h3>🎵 Espace Musical chill</h3>
                    <p>Un coin dédié à vos ambiances sonores et intégrations pour vibrer au rythme de 180 bpm avec fuck leeche sur spotify.</p>
                </div>
            </div>

            <div class="neptune-actions">
                <a href="/chat" class="neptune-btn-main">Entrer dans le Chat</a>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Rendu de la galerie des visuels officiels de la plateforme.
     */
    public function render_gallery_template( $atts ) {
        $bg_url = plugin_dir_url( dirname( __FILE__ ) ) . 'assets/images/background.jpg';
        $chat_bg_url = plugin_dir_url( dirname( __FILE__ ) ) . 'assets/images/chat-bg.jpg';
        $avatar_url = plugin_dir_url( dirname( __FILE__ ) ) . 'assets/images/avatar.jpg';

        ob_start();
        ?>
        <div class="neptune-page-container">
            <h1>Галерея Neptune</h1>
            <p class="neptune-subtitle">Исследуйте официальные визуальные материалы вселенной.</p>

            <div class="neptune-gallery-grid">
                <div class="neptune-gallery-item">
                    <img src="<?php echo esc_url( $bg_url ); ?>" alt="Background" />
                    <div class="neptune-gallery-caption">Fond Principal</div>
                </div>
                <div class="neptune-gallery-item">
                    <img src="<?php echo esc_url( $chat_bg_url ); ?>" alt="Chat BG" />
                    <div class="neptune-gallery-caption">Texture Chat</div>
                </div>
                <div class="neptune-gallery-item">
                    <img src="<?php echo esc_url( $avatar_url ); ?>" alt="Avatar" />
                    <div class="neptune-gallery-caption">Avatar Officiel</div>
                </div>
            </div>
            
            <p style="margin-top: 30px; color: #00d2ff; font-style: italic; font-weight: 600;">*спасибо нептун*</p>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Rendu de la page À propos avec les motifs sombres caractéristiques.
     */
    public function render_about_template( $atts ) {
        $about_img_url = plugin_dir_url( dirname( __FILE__ ) ) . 'assets/images/about.jpg';

        ob_start();
        ?>
        <div class="neptune-page-container neptune-about-dark-motifs">
            <h1>À propos de Neptune</h1>
            <p class="neptune-subtitle">L'histoire derrière le projet.</p>

            <div class="neptune-content-box">
                <div class="neptune-about-image-wrapper" style="margin-bottom: 25px;">
                    <img src="<?php echo esc_url( $about_img_url ); ?>" alt="À propos de Neptune" class="neptune-about-img" />
                </div>
                <p>Neptune Core est né de la volonté de créer un espace web intimiste, sombre et hautement interactif. Conçu sur-mesure pour s'affranchir des regles, il fusionne esthétique et communication en temps réel.</p>
                <p>Rejoignez la communauté, discutez dans les salons isolés et profitez d'une expérience visuelle soignée comme donk XD.</p>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}