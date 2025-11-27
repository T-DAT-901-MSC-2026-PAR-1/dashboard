# Dashboard Docker Setup

Ce dossier contient la configuration Docker pour le dashboard CryptoViz, incluant :
- Frontend (React + Vite + Nginx)
- Backend (NestJS)
- PostgreSQL (base de données)

## Structure des fichiers

- `dashboard/Justfile` - Commandes Docker (à exécuter depuis `dashboard/`)
- `dashboard/.env` - Variables d'environnement (à créer depuis `.env.example`)
- `dashboard/docker/dev/compose.yml` - Configuration Docker Compose (dev)
- `dashboard/docker/dev/init-db.sql` - Script d'initialisation PostgreSQL

## Prérequis

1. Docker et Docker Compose installés
2. Le réseau Kafka doit être démarré (voir `/infrastructure`)
3. Just (command runner) installé : `brew install just` (macOS) ou voir [justfile.dev](https://github.com/casey/just)

## Démarrage rapide

```bash
# Depuis le dossier dashboard/

# 1. Créer le fichier .env
cp .env.example .env

# 2. Démarrer le stack complet
just up

# 3. Vérifier que tout fonctionne
just ps

# 4. Voir les logs
just logs
```

Le dashboard sera accessible sur :
- Frontend : http://localhost:4200
- Backend : http://localhost:3000
- PostgreSQL : localhost:5432

## Commandes disponibles

### Gestion du stack

```bash
just up [ENV]        # Démarrer le stack (default: dev)
just down [ENV]      # Arrêter le stack
just rebuild [ENV]   # Reconstruire et redémarrer
just ps [ENV]        # Voir le statut des services
just logs [ENV] [SERVICE]  # Voir les logs (tous ou un service spécifique)
```

### Gestion de la base de données

```bash
just db-shell        # Accéder au shell PostgreSQL
just db-migrate      # Exécuter les migrations (à implémenter)
just clean           # Supprimer volumes et données (ATTENTION!)
```

### Exemples

```bash
# Voir les logs du backend uniquement
just logs dev backend

# Accéder au shell du backend
just exec dev backend /bin/sh

# Redémarrer après modification du code
just rebuild
```

## Structure des services

### Frontend
- **Build** : Multi-stage avec Node.js Alpine + Nginx Alpine
- **Port** : 4200 → 80
- **Variables** : `VITE_BACKEND_URL`

### Backend
- **Image** : Node.js LTS Alpine
- **Port** : 3000
- **Variables** : `DATABASE_URL`, `KAFKA_BOOTSTRAP_SERVERS`, `PORT`, `HOST`
- **Networks** : `dashboard` (interne), `kafka_kafka` (externe)

### PostgreSQL
- **Image** : PostgreSQL 16 Alpine
- **Port** : 5432
- **Volumes** : `postgres_data` (persistant)
- **Init script** : `/docker-entrypoint-initdb.d/init-db.sql`

## Développement

### Modifier le frontend

1. Faire vos changements dans `apps/frontend/`
2. Depuis la racine de dashboard : `just rebuild`
3. Le frontend sera recompilé et redéployé

### Modifier le backend

1. Faire vos changements dans `apps/backend/`
2. Depuis la racine de dashboard : `just rebuild`
3. Le backend sera recompilé et redémarré

### Schéma de base de données

Modifiez `docker/dev/init-db.sql` pour ajouter des tables/indexes. Ce fichier s'exécute uniquement au premier démarrage de PostgreSQL.

Pour appliquer des changements après le premier démarrage :
```bash
# Option 1: Recréer la base (perte de données!)
just clean
just up

# Option 2: Exécuter manuellement
just db-shell
# Puis taper vos commandes SQL
```

## Résolution de problèmes

### Le backend ne peut pas se connecter à Kafka

Vérifiez que le réseau Kafka est démarré :
```bash
cd ../infrastructure
just up kafka
```

### Le frontend ne charge pas

1. Vérifiez les logs : `just logs frontend`
2. Vérifiez que le build s'est bien passé : `just rebuild`
3. Vérifiez la variable `VITE_BACKEND_URL` dans `dashboard/.env`

### PostgreSQL ne démarre pas

1. Vérifiez les logs : `just logs postgres`
2. Vérifiez que le port 5432 n'est pas déjà utilisé
3. Nettoyez les volumes : `just clean` puis `just up`

### Permission denied lors du build

Sur certains systèmes, vous devrez peut-être exécuter avec sudo :
```bash
sudo just up
```

## Architecture réseau

```
┌─────────────────────────────────────────────┐
│         Dashboard Stack                      │
│                                              │
│  ┌──────────┐    ┌──────────┐    ┌────────┐│
│  │ Frontend │───▶│ Backend  │───▶│Postgres││
│  │  :4200   │    │  :3000   │    │ :5432  ││
│  └──────────┘    └─────┬────┘    └────────┘│
│                        │                     │
│                        │ (kafka_kafka)       │
└────────────────────────┼─────────────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ Kafka Nodes │
                  │  (external) │
                  └─────────────┘
```

## Production

Pour un déploiement en production :

1. Créer `prod/compose.yml` avec :
   - Variables d'environnement sécurisées
   - Healthchecks appropriés
   - Resource limits
   - Logging configuré

2. Utiliser des secrets Docker au lieu de variables en clair
3. Configurer SSL/TLS pour Nginx
4. Activer les mécanismes de backup PostgreSQL

## Notes

- Les volumes PostgreSQL persistent entre les redémarrages
- Le réseau `kafka_kafka` doit être créé par le stack Kafka
- Le frontend est compilé au build-time (pas de hot-reload en prod)
- Pour le développement avec hot-reload, utilisez `npx nx serve frontend/backend` localement
