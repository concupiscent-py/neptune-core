<?php
defined('ABSPATH') || exit;
$asset_url = NEPTUNE_PLUGIN_URL . 'assets/';
?>

<img class="portrait" src="<?php echo esc_url($asset_url . 'img/portrait.jpg'); ?>" alt="Portrait en noir et blanc">

<div data-site-header></div>

<main class="wrap">
  <section class="hero">
    <div class="kicker">Collectif indépendant · Est. 2024</div>
    <h1><span>NEP</span><span>TUNE.</span></h1>
    <div class="hero-bottom">
      <p>Un espace pour les idées en mouvement. Culture, création et rencontres, à notre rythme.</p>
      <span class="index-mark">48°51′ N / 2°21′ E<br>FR — EVERYWHERE</span>
    </div>
  </section>

  <hr class="rule">

  <section class="section">
    <div class="section-head">
      <span class="kicker">01 — Explorer</span>
      <span class="kicker">Le monde Neptune</span>
    </div>
    <div class="grid">
      <a class="card" href="<?php echo esc_url(home_url('/about')); ?>">
        <span class="kicker">01 / À propos</span>
        <h3>Qui sommes-nous ?</h3>
        <span class="arrow">↗</span>
      </a>
      <a class="card" href="<?php echo esc_url(home_url('/activities')); ?>">
        <span class="kicker">02 / Activités</span>
        <h3>Ce qu’on fabrique.</h3>
        <span class="arrow">↗</span>
      </a>
      <a class="card" href="<?php echo esc_url(home_url('/communication')); ?>">
        <span class="kicker">03 / Contact</span>
        <h3>Restons en lien.</h3>
        <span class="arrow">↗</span>
      </a>
    </div>
  </section>

  <hr class="rule">

  <section class="section split">
    <div>
      <span class="kicker">02 — Écoute</span>
      <h2>Le son du moment.</h2>
      <p class="copy">Luther — GARÇON</p>
    </div>
    <iframe class="spotify" src="https://open.spotify.com/embed/album/0pgPGBjDayWlzT8eAjjcKG?utm_source=generator" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Luther — GARÇON sur Spotify"></iframe>
  </section>
</main>

<div data-site-footer></div>