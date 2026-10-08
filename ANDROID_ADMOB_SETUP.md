# Configuration Google AdMob pour TAPTA (Android & Web)

Ce guide détaille l'intégration et la publication Google AdMob pour **TAPTA** sur Android (Google Play Store).

---

## 1. Identifiants AdMob configurés

- **Application ID (App ID AdMob) :**
  `ca-app-pub-7613129142115500~9163524169`

- **Bloc d'annonces Récompensé (Rewarded Ad Unit ID) :**
  `ca-app-pub-7613129142115500/6407342198`

- **Identifiants de Test officiels Google AdMob :**
  - Test App ID : `ca-app-pub-3940256099942544~3347511713`
  - Test Rewarded Ad Unit ID : `ca-app-pub-3940256099942544/5224354917`

---

## 2. Bascule Mode Test ↔ Mode Production

Dans les **Paramètres** du jeu (icône ⚙️ sur l'écran d'accueil) :
- Un interrupteur **Mode Test AdMob** permet d'alterner instantanément :
  - **Mode Test (activé par défaut) :** Permet de tester sans risque de pénalité de clics factices Google AdMob.
  - **Mode Production :** Diffuse vos vraies annonces avec votre App ID et Ad Unit ID.

---

## 3. Emplacements de diffusion des annonces récompensées

1. **Reprise après échec (Defeat Modal) :**
   - Bouton : `▶ Regarder une publicité pour continuer`
   - Conserve le plateau de jeu et libère 3 emplacements pour continuer à jouer sans recommencer.

2. **Déblocage progressif des emplacements 5 à 8 :**
   - Niveaux 1 à 100 : 4 emplacements de base fixes `[ 1 ][ 2 ][ 3 ][ 4 ]`.
   - Niveaux 101 à 200 : Déblocage de l'emplacement 5 via pub récompensée.
   - Niveaux 201 à 300 : Déblocage de l'emplacement 6 via pub récompensée.
   - Niveaux 301 à 400 : Déblocage de l'emplacement 7 via pub récompensée.
   - Niveaux 401 à 500 : Déblocage de l'emplacement 8 via pub récompensée.

3. **Coffre aux Récompenses quotidiennes (3 Publicités) :**
   - Dans le menu **Récompenses** :
     - Publicité 1/3 : +100 🪙 Pièces & +1 ⭐ Étoile
     - Publicité 2/3 : +15 💎 Diamants & +100 🪙 Pièces
     - Publicité 3/3 : +1 🎁 Coffre Mystère & +25 💎 Diamants

4. **Déblocage de niveaux verrouillés :**
   - Les niveaux 5 à 500 peuvent être débloqués par anticipation en visionnant une publicité.

---

## 4. Intégration Native Android (`AndroidManifest.xml`)

Lors de la compilation avec **Capacitor** ou **Android Studio**, ajoutez la balise suivante à l'intérieur de `<application>` dans votre fichier `android/app/src/main/AndroidManifest.xml` :

```xml
<manifest ...>
    <application ...>
        <!-- Google AdMob Application ID -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-7613129142115500~9163524169"/>
    </application>
</manifest>
```
