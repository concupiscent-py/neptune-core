<?php
/**
- Plugin Name: Neptune Core
- Description: Secure plugin featuring dark-mode, avatar, multi-room chat, and styled pages.
- Version: 1.4.3
- Author: Neptune
- License: GPLv2+
 */

defined( 'ABSPATH' ) || exit;

define( 'NEPTUNE_VERSION', '1.4.3' );
define( 'NEPTUNE_PATH', plugin_dir_path( __FILE__ ) );
define( 'NEPTUNE_URL', plugin_dir_url( __FILE__ ) );

// Inclusion sécurisée des classes du plugin
if ( file_exists( NEPTUNE_PATH . 'includes/class-neptune-rest.php' ) ) {
    require_once NEPTUNE_PATH . 'includes/class-neptune-rest.php';
}
if ( file_exists( NEPTUNE_PATH . 'includes/class-neptune-shortcodes.php' ) ) {
    require_once NEPTUNE_PATH . 'includes/class-neptune-shortcodes.php';
}

// Activation sécurisée du plugin
register_activation_hook( __FILE__, 'neptune_activate_plugin' );
function neptune_activate_plugin() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'neptune_chat_messages';
    $charset_collate = $wpdb->get_charset_collate();

    $safe_table = esc_sql( $table_name );
    $sql = "CREATE TABLE `{$safe_table}` (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        room varchar(50) NOT NULL DEFAULT 'general',
        pseudonym varchar(100) NOT NULL,
        text text NOT NULL,
        reactions text DEFAULT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
}

// Initialisation des routes REST API
add_action( 'rest_api_init', function() {
    if ( class_exists( 'Neptune_REST' ) ) {
        $rest = new Neptune_REST();
        if ( method_exists( $rest, 'register_routes' ) ) {
            $rest->register_routes();
        }
    }
});

// Initialisation des shortcodes
add_action( 'init', function() {
    if ( class_exists( 'Neptune_Shortcodes' ) ) {
        $shortcodes = new Neptune_Shortcodes();
        if ( method_exists( $shortcodes, 'init' ) ) {
            $shortcodes->init();
        }
    }
});

// Enregistrement des scripts et styles frontend du chat (Ouvert à tous)
add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_style( 'neptune-style', NEPTUNE_URL . 'assets/css/style.css', array(), NEPTUNE_VERSION, 'all' );
    wp_enqueue_script( 'neptune-chat', NEPTUNE_URL . 'assets/js/chat.js', array(), NEPTUNE_VERSION, true );
    
    // Si l'utilisateur est connecté, on récupère son pseudo, sinon "Membre" par défaut
    $current_user = wp_get_current_user();
    $pseudo = ( $current_user && $current_user->exists() ) ? $current_user->display_name : 'Membre';

    wp_localize_script( 'neptune-chat', 'neptuneSettings', array(
        'restUrl'    => esc_url_raw( rest_url( 'neptune/v1/' ) ),
        'nonce'      => wp_create_nonce( 'wp_rest' ),
        'userPseudo' => sanitize_text_field( $pseudo ),
        'pluginUrl'  => NEPTUNE_URL
    ));
});