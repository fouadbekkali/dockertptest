# 🐳 Projet Docker - Todo App

Un projet simple pour apprendre les principes fondamentaux de Docker avec une application Todo (Frontend + Backend API).

## 📋 Structure du Projet

```
projetFrBc/
├── backend/                 # API Node.js/Express
│   ├── server.js           # Serveur backend
│   ├── package.json        # Dépendances
│   ├── Dockerfile          # Configuration Docker pour le backend
│   └── .dockerignore       # Fichiers à ignorer lors du build
├── frontend/               # Interface utilisateur
│   ├── index.html          # Page HTML (interface Todo)
│   ├── server.js           # Serveur frontend avec proxy
│   ├── package.json        # Dépendances
│   ├── Dockerfile          # Configuration Docker pour le frontend
│   └── .dockerignore       # Fichiers à ignorer lors du build
├── docker-compose.yml      # Orchestration des conteneurs
└── README.md              # Ce fichier
```

## 🎯 Concepts Docker Couverts

✅ **Dockerfiles** - Créer des images personnalisées pour chaque service  
✅ **Docker Compose** - Orchestrer plusieurs conteneurs  
✅ **Réseaux Docker** - Communication inter-conteneurs  
✅ **Volumes** (optionnel) - Persistance des données  
✅ **Health Checks** - Vérifier l'état des services  
✅ **Variables d'environnement** - Configuration des conteneurs  
✅ **Ports** - Exposer les services  
✅ **Dépendances de services** - Ordre de démarrage  

## 🚀 Démarrage Rapide

### Prérequis

- Docker Desktop installé et en cours d'exécution
- Docker Compose (généralement inclus avec Docker Desktop)

### Commandes Essentielles

#### 1. **Construire et démarrer tous les services**

```bash
cd projetFrBc
docker-compose up -d
```

- `-d` : Exécuter en arrière-plan

#### 2. **Voir l'état des conteneurs**

```bash
docker-compose ps
```

#### 3. **Accéder à l'application**

- **Frontend** : http://localhost:3002
- **Backend API** : http://localhost:8002/api
- **Health Check** : http://localhost:8002/api/health

#### 4. **Voir les logs**

```bash
# Tous les logs
docker-compose logs -f

# Logs du backend seulement
docker-compose logs -f backend

# Logs du frontend seulement
docker-compose logs -f frontend
```

#### 5. **Entrée interactive dans un conteneur**

```bash
# Dans le conteneur backend
docker-compose exec backend sh

# Dans le conteneur frontend
docker-compose exec frontend sh

# Lister les fichiers
ls -la

# Sortir
exit
```

#### 6. **Arrêter les services**

```bash
docker-compose down
```

- Arrête et supprime les conteneurs et le réseau
- Les données en mémoire sont perdues

#### 7. **Arrêter et supprimer les images**

```bash
docker-compose down --rmi all
```

- Supprime également les images construites

#### 8. **Reconstruire les images**

```bash
docker-compose build --no-cache
```

- Reconstruit sans utiliser le cache

## 📚 Ressources d'Apprentissage

### APIs Backend Disponibles

L'API fonctionne sur `http://localhost:8002/api` :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/items` | Récupérer tous les éléments |
| GET | `/items/:id` | Récupérer un élément spécifique |
| POST | `/items` | Créer un nouvel élément |
| PUT | `/items/:id` | Mettre à jour un élément |
| DELETE | `/items/:id` | Supprimer un élément |
| GET | `/health` | Vérifier l'état du serveur |

### Exemple de Requête avec curl

```bash
# Récupérer tous les items
curl http://localhost:8002/api/items

# Créer un nouvel item
curl -X POST http://localhost:8002/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Apprendre Docker"}'

# Mettre à jour un item
curl -X PUT http://localhost:8002/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Supprimer un item
curl -X DELETE http://localhost:8002/api/items/1
```

## 🔍 Débogage et Dépannage

### Le frontend ne peut pas se connecter au backend

**Cause** : Les conteneurs peuvent être sur le même réseau et se communiquer par nom de service.

**Solution** : Docker Compose crée un réseau `app-network` automatiquement. Le frontend utilise `backend:3000` pour se connecter.

### Port déjà en utilisation

```bash
# Vérifier quel processus utilise le port 3000
netstat -ano | findstr :3000

# Tuer le processus (remplacer PID par le numéro)
taskkill /PID <PID> /F
```

### Reconstruire après modification du code

```bash
docker-compose down
docker-compose build
docker-compose up
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    DOCKER NETWORK                        │
│            (app-network - bridge driver)                 │
│                                                           │
│         ┌──────────────┐      ┌──────────────┐           │
│         │  FRONTEND    │      │   BACKEND    │           │
│         │  Port 8080   │      │   Port 3000  │           │
│         │              │      │              │           │
│         │ • Express    │      │ • Express    │           │
│         │ • HTML/CSS/JS│      │ • API REST   │           │
│         │ • Proxy      │◄────►│ • Logic      │           │
│         │   vers API   │      │ • Data Store │           │
│         └──────────────┘      └──────────────┘           │
│                                                           │
└─────────────────────────────────────────────────────────┘
         ▲                              ▲
         │                              │
    Port 8080                       Port 3000
      (Navigateur)                  (API Requests)
```

## 💡 Prochaines Étapes pour Apprendre

1. **Ajouter une base de données** : Intégrer MySQL/PostgreSQL
2. **Volumes** : Persister les données
3. **Variables d'environnement** : Utiliser `.env` pour la configuration
4. **Docker Hub** : Push vos images sur Docker Hub
5. **Kubernetes** : Orchestration avec Kubernetes
6. **GitHub Actions** : CI/CD automatisé

## 📝 Notes

- Les données sont stockées en mémoire (pas de persistance)
- Le backend redémarre automatiquement en cas d'erreur
- Les deux services communiquent via le réseau Docker interne

---

**Happy Learning avec Docker! 🚀**

## TP
# 1 images 
docker pull node:18 
docker pull mysql:8.0 
docker pull phpmyadmin/phpmyadmin 
# 2 network 
docker network create todo_network
+ la modification sur server.js (backend)
# 3  volume
docker volume create todo_data
# 4 containers
docker run -d --name mysql_db --network todo_network -v todo_data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=tododb -p 3307:3306 mysql   (3307 cause le port 3306 est reserver)
# lancement du phpmyadmin
docker run -d --name my_phpmyadmin --network todo_network -e PMA_HOST=mysql_db -p 8080:80 phpmyadmin/phpmyadmin
# docker-compose.yml (hada bax matb9ax t executes les commandes kola mara howa kitklf) test b docker-compose up -d w raddi icree lik les containers irbthom f network + ecree volumes  
# Dockerfile hada likat7t fih lwasfa siryaa dyaal projet dyaalk okat7t wa7d fl front o wa7d fl back 

