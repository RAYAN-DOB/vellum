# Roles et permissions

Le modele cible prevoit plusieurs roles, tout en evitant de dupliquer l'application par role. Les espaces doivent partager les memes objets metier lorsque c'est possible, avec des vues adaptees aux responsabilites de chacun.

## Roles prevus

- client : cree et suit ses demandes, consulte les livrables autorises ;
- chef de projet : qualifie les demandes, suit l'avancement, coordonne les livrables ;
- dessinateur : traite les demandes assignees et prepare les livrables ;
- admin : supervise la plateforme, les utilisateurs, les roles et les parametres.

## Modele cible

La logique de permissions devra etre centralisee plus tard dans `src/lib/permissions`, autour d'un modele conceptuel :

```ts
can(actor, action, resource)
```

Ce modele devra tenir compte du role global, du role projet, des assignations et de l'etat de la ressource. Les restrictions cote interface ne suffiront jamais : toute future action serveur devra refaire ses propres controles.

