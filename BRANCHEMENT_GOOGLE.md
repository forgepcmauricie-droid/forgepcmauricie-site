# ForgePC — Google Sheets + Google Drive

Le site est maintenant préconfiguré avec l'ID de la feuille ForgePC et lit l'onglet `Inventaire` directement via l'export CSV de Google Sheets.

## Fonctionnement

Google Sheets → onglet `Inventaire` → site ForgePC

Les colonnes attendues sont celles déjà présentes dans la feuille :

- ID PC
- Nom du PC
- Processeur
- Carte graphique
- RAM
- Stockage
- Carte mère
- Alimentation
- Windows
- État
- Prix de vente (CAD)
- Statut
- Description
- Photo 1 à Photo 6
- Coût d'achat (CAD)
- Coût pièces/remise à neuf (CAD)
- Coût total (CAD)
- Bénéfice estimé (CAD)
- Marge brute (%)

## Photos Google Drive

Dans Photo 1 à Photo 6, conserver les liens de partage des images Google Drive.

Le site reconnaît les liens du type :
`https://drive.google.com/file/d/ID/view?...`

et les convertit automatiquement en images affichables.

Pour que le site puisse charger les photos, chaque photo doit être accessible en lecture aux personnes qui disposent du lien.

## Important

La feuille doit rester accessible en lecture aux visiteurs du site. Ne jamais mettre de renseignements privés dans cet onglet.

Le site affiche les lignes dont le statut n'est pas `Vendu`, `Sold`, `Inactif` ou `Retiré`. Les statuts `En stock` et `Réservé` peuvent donc être affichés.

## Test

Avec PC-001 :
- statut `En stock`
- prix `169,95 $`
- Photo 1 à Photo 4 avec les liens Drive

En ouvrant `inventaire.html`, PC-001 devrait apparaître et sa fiche devrait être accessible via `pc.html?id=001`.

Si Google n'est pas accessible momentanément, le site utilise une fiche PC-001 locale de secours.
