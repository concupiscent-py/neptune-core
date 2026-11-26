<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Neptune_REST {

    public function register_routes() {
        register_rest_route( 'neptune/v1', '/chat', array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_chat_messages' ),
                'permission_callback' => '__return_true',
            ),
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array( $this, 'post_chat_message' ),
                'permission_callback' => function() {
                    return current_user_can( 'read' );
                },
            ),
            array(
                'methods'             => WP_REST_Server::DELETABLE,
                'callback'            => array( $this, 'clear_chat_messages' ),
                'permission_callback' => function() {
                    return current_user_can( 'read' );
                },
            ),
        ));

        // Nouvelle route dédiée aux réactions sur les messages
        register_rest_route( 'neptune/v1', '/chat/react', array(
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array( $this, 'post_chat_reaction' ),
                'permission_callback' => function() {
                    return current_user_can( 'read' );
                },
            ),
        ));
    }

    public function get_chat_messages( $request ) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'neptune_chat_messages';
        $room = sanitize_text_field( $request->get_param( 'room' ) );

        if ( empty( $room ) ) {
            $room = 'general';
        }

        $safe_table = esc_sql( $table_name );
        
        /* phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared */
        $messages = $wpdb->get_results( $wpdb->prepare(
            "SELECT * FROM `{$safe_table}` WHERE room = %s ORDER BY created_at ASC LIMIT 100",
            $room
        ) );

        // Décoder les réactions JSON pour chaque message récupéré
        foreach ( $messages as $message ) {
            $message->reactions = ! empty( $message->reactions ) ? json_decode( $message->reactions, true ) : array();
        }

        return rest_ensure_response( $messages );
    }

    public function post_chat_message( $request ) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'neptune_chat_messages';

        $room      = sanitize_text_field( $request->get_param( 'room' ) );
        $text      = sanitize_textarea_field( $request->get_param( 'text' ) );
        $pseudonym = sanitize_text_field( $request->get_param( 'pseudonym' ) );

        if ( empty( $room ) ) {
            $room = 'general';
        }

        if ( empty( $text ) ) {
            return new WP_Error( 'empty_text', 'Le message ne peut pas être vide.', array( 'status' => 400 ) );
        }

        if ( empty( $pseudonym ) ) {
            $pseudonym = 'Membre';
        }

        $inserted = $wpdb->insert(
            $table_name,
            array(
                'room'      => $room,
                'pseudonym' => $pseudonym,
                'text'      => $text,
                'reactions' => json_encode( array() ),
                'created_at'=> current_time( 'mysql' )
            ),
            array( '%s', '%s', '%s', '%s', '%s' )
        );

        if ( false === $inserted ) {
            return new WP_Error( 'db_error', 'Erreur lors de l\'enregistrement en base de données.', array( 'status' => 500 ) );
        }

        return rest_ensure_response( array( 'success' => true, 'id' => $wpdb->insert_id ) );
    }

    public function post_chat_reaction( $request ) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'neptune_chat_messages';
        $safe_table = esc_sql( $table_name );

        $message_id = intval( $request->get_param( 'id' ) );
        $emoji      = sanitize_text_field( $request->get_param( 'emoji' ) );

        if ( ! $message_id || empty( $emoji ) ) {
            return new WP_Error( 'invalid_params', 'Paramètres invalides.', array( 'status' => 400 ) );
        }

        /* phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared */
        $message = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM `{$safe_table}` WHERE id = %d", $message_id ) );

        if ( ! $message ) {
            return new WP_Error( 'not_found', 'Message introuvable.', array( 'status' => 404 ) );
        }

        $reactions = json_decode( $message->reactions, true );
        if ( ! is_array( $reactions ) ) {
            $reactions = array();
        }

        if ( isset( $reactions[$emoji] ) ) {
            $reactions[$emoji]++;
        } else {
            $reactions[$emoji] = 1;
        }

        /* phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared */
        $updated = $wpdb->query( $wpdb->prepare( 
            "UPDATE `{$safe_table}` SET reactions = %s WHERE id = %d", 
            json_encode( $reactions ), 
            $message_id 
        ) );

        if ( false === $updated ) {
            return new WP_Error( 'db_error', 'Erreur lors de la mise à jour des réactions.', array( 'status' => 500 ) );
        }

        return rest_ensure_response( array( 'success' => true, 'reactions' => $reactions ) );
    }

    public function clear_chat_messages( $request ) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'neptune_chat_messages';
        
        $message_id = intval( $request->get_param( 'id' ) );
        $room = sanitize_text_field( $request->get_param( 'room' ) );

        // Si un ID de message est fourni, on supprime UNIQUEMENT ce message
        if ( $message_id > 0 ) {
            $deleted = $wpdb->delete(
                $table_name,
                array( 'id' => $message_id ),
                array( '%d' )
            );

            if ( false === $deleted ) {
                return new WP_Error( 'db_delete_error', 'Impossible de supprimer le message', array( 'status' => 500 ) );
            }

            return rest_ensure_response( array( 'success' => true, 'deleted_id' => $message_id ) );
        }

        // Sinon, comportement initial pour vider toute la room (/clear)
        if ( empty( $room ) ) {
            $room = 'general';
        }

        $deleted = $wpdb->delete(
            $table_name,
            array( 'room' => $room ),
            array( '%s' )
        );

        if ( false === $deleted ) {
            return new WP_Error( 'db_delete_error', 'Impossible d\'effacer les messages', array( 'status' => 500 ) );
        }

        return rest_ensure_response( array( 'success' => true, 'cleared_room' => $room ) );
    }
}