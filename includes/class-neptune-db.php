<?php
defined('ABSPATH') || exit;

class Neptune_DB {
    public static function get_table_name() {
        global $wpdb;
        return $wpdb->prefix . 'neptune_chat_messages';
    }

    public static function activate() {
        global $wpdb;
        $table_name = self::get_table_name();
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            room varchar(50) DEFAULT 'general' NOT NULL,
            pseudonym varchar(50) NOT NULL,
            text text NOT NULL,
            file_data longtext DEFAULT NULL,
            file_name varchar(255) DEFAULT NULL,
            file_type varchar(100) DEFAULT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
}