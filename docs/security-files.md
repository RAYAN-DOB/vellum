# Securite des fichiers

Le MVP ne doit manipuler que des exemples fictifs et non sensibles. Aucun vrai fichier client, plan, DWG, PDF, croquis ou document confidentiel ne doit etre ajoute au depot.

## Regles

- ne jamais mettre de fichier sensible dans `public/` ;
- ne jamais commiter de vrai DWG, PDF client, plan, croquis ou document projet confidentiel ;
- ne pas creer d'upload reel de fichiers sensibles au MVP ;
- utiliser uniquement des donnees mockees et clairement fictives ;
- ne pas exposer de donnees projet sans controle serveur ;
- ne pas presenter une restriction UI comme une securite reelle.

Les futurs fichiers sensibles devront etre servis via des controles serveur, des permissions, une journalisation et des URLs non publiques.

